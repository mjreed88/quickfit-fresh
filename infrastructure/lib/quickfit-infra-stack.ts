import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class QuickFitInfraStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get existing secret from Secrets Manager
    const zaiApiKeySecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'ZaiApiKey',
      'quickfit-zai-api-key'
    );

    // Import existing Cognito User Pool
    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      'UserPool',
      'us-east-1_GH8fCdd5X'
    );

    // Create Cognito authorizer using the existing user pool
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'CognitoAuthorizer',
      {
        cognitoUserPools: [userPool],
      }
    );

    // DynamoDB Tables

    // Users table - stores user info from Cognito
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'QuickFitUsers',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Profiles table - stores workout/meal plans
    const profilesTable = new dynamodb.Table(this, 'ProfilesTable', {
      tableName: 'QuickFitProfiles',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Conversations table - stores AI chat history
    const conversationsTable = new dynamodb.Table(this, 'ConversationsTable', {
      tableName: 'QuickFitConversations',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Lambda Functions

    // AI Chat function - calls z.ai GLM-5.1 API
    const aiChatFn = new lambda.Function(this, 'AIChatFunction', {
      functionName: 'QuickFitAIChat',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/ai-chat.handler',
      code: lambda.Code.fromAsset('handlers'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        DYNAMODB_TABLE: profilesTable.tableName,
      },
    });

    // Grant Lambda read access to Secrets Manager
    zaiApiKeySecret.grantRead(aiChatFn);

    // Grant Lambda read/write access to DynamoDB
    profilesTable.grantReadWriteData(aiChatFn);
    conversationsTable.grantReadWriteData(aiChatFn);
    usersTable.grantReadData(aiChatFn);

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'QuickFitAPI', {
      restApiName: 'QuickFit API',
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowOrigins: ['https://quickfit.tech', 'http://localhost:5173'],
      },
    });

    // Chat resource
    const chatResource = api.root.addResource('chat');

    // Chat GET method with Cognito auth
    chatResource.addMethod('GET', new apigateway.LambdaIntegration(aiChatFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Chat POST method with Cognito auth
    chatResource.addMethod('POST', new apigateway.LambdaIntegration(aiChatFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Outputs
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      description: 'API Gateway REST API endpoint',
      exportName: 'QuickFitAPIEndpoint',
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      exportName: 'QuickFitUsersTable',
    });

    new cdk.CfnOutput(this, 'ProfilesTableName', {
      value: profilesTable.tableName,
      exportName: 'QuickFitProfilesTable',
    });

    new cdk.CfnOutput(this, 'ConversationsTableName', {
      value: conversationsTable.tableName,
      exportName: 'QuickFitConversationsTable',
    });
  }
}
