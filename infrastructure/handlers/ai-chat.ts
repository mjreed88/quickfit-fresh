import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// Initialize clients outside handler for better performance
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });

// z.ai GLM-5.1 API configuration
const ZAI_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'QuickFitProfiles';

// Cache for API key
let cachedApiKey: string | null = null;

// Fitness trainer system prompt
const FITNESS_TRAINER_PROMPT = `You are an AI fitness trainer assistant called QuickFit AI. You help users with:
- Creating personalized workout plans based on their fitness level, age, injuries, and goals
- Providing meal and nutrition guidance
- Explaining proper form for exercises
- Adjusting plans based on user feedback
- Motivating users to stay consistent with their fitness journey

Keep responses concise, encouraging, and practical. Focus on actionable advice.`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  userId: string;
  message: string;
  conversationHistory: ChatMessage[];
}

// Get API key from Secrets Manager (with caching)
async function getApiKey(): Promise<string> {
  if (cachedApiKey) return cachedApiKey;

  try {
    const command = new GetSecretValueCommand({ SecretId: 'quickfit-zai-api-key' });
    const response = await secretsClient.send(command);
    cachedApiKey = response.SecretString || '';
    return cachedApiKey;
  } catch (error) {
    console.error('Failed to get API key from Secrets Manager:', error);
    throw new Error('API key not available');
  }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json',
      },
      body: '',
    };
  }

  try {
    // Parse request body
    const body: ChatRequest = JSON.parse(event.body || '{}');
    const { userId, message, conversationHistory = [] } = body;

    if (!userId || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'userId and message are required' }),
      };
    }

    // Get API key from Secrets Manager
    const apiKey = await getApiKey();

    // Build messages array for z.ai API
    const messages: ChatMessage[] = [
      { role: 'system', content: FITNESS_TRAINER_PROMPT },
      ...conversationHistory.slice(-10), // Last 10 messages for context
      { role: 'user', content: message },
    ];

    // Call z.ai GLM-5.1 API
    console.log('Calling z.ai API...');
    const zaiResponse = await fetch(ZAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-5',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!zaiResponse.ok) {
      const errorText = await zaiResponse.text();
      console.error('z.ai API error:', zaiResponse.status, errorText);
      throw new Error(`z.ai API error: ${zaiResponse.status}`);
    }

    const zaiData: any = await zaiResponse.json();
    const aiMessage = zaiData.choices?.[0]?.message?.content || 'Sorry, I could not process that.';

    // Save conversation to DynamoDB
    try {
      await docClient.send(new PutCommand({
        TableName: DYNAMODB_TABLE,
        Item: {
          userId: `${userId}#convo`,
          timestamp: Date.now(),
          userMessage: message,
          aiMessage: aiMessage,
        },
      }));
    } catch (ddbError) {
      console.error('DynamoDB save error (non-fatal):', dbbError);
      // Continue even if DynamoDB save fails
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: aiMessage,
        conversationId: `${userId}#${Date.now()}`,
      }),
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
