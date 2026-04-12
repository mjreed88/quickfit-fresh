# QuickFit.Tech - Production Setup Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Pages (quickfit.tech)               │
│                 React SPA + Cloudflare DNS                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    AWS Infrastructure                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Cognito   │  │   Lambda   │  │     DynamoDB        │ │
│  │  (Auth)    │  │  (AI API)  │  │  (Users, Profiles)  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                              ↓                              │
│                  ┌─────────────────┐                       │
│                  │  Secrets Mgr    │                       │
│                  │  (z.ai API Key)│                       │
│                  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous deployment:

### Workflow Stages

1. **Lint & Type Check** - Runs on every PR and push
2. **Test** - Runs after lint passes
3. **Deploy Staging** (PR only) - Preview URL for review
4. **Deploy Production** (main branch) - Auto-deploys to quickfit.tech
5. **Deploy Infrastructure** (main branch) - Updates AWS CDK stack

### Required Secrets

Configure these in GitHub Settings → Secrets:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Wrangler token |
| `AWS_ACCESS_KEY_ID` | AWS credentials for CDK |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials for CDK |
| `PRODUCTION_API_URL` | Lambda API endpoint |
| `STAGING_API_URL` | Staging API endpoint |
| `COGNITO_USER_POOL_ID` | `us-east-1_GH8fCdd5X` |
| `COGNITO_CLIENT_ID` | Client ID from Cognito |
| `ADMIN_USERNAMES` | Comma-separated admin usernames |
| `ADMIN_EMAILS` | Comma-separated admin emails |

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your MiniMax API key

# Run dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

## AWS CDK Infrastructure

The CDK stack is in `infrastructure/`:

```bash
cd infrastructure
npm install
npx cdk synth    # Preview CloudFormation
npx cdk deploy  # Deploy to AWS
```

### CDK Stack Resources
- Lambda (AI Chat API)
- API Gateway (REST API with Cognito authorizer)
- DynamoDB tables (Users, Profiles, Conversations)
- Secrets Manager for z.ai API key

## Deployment Commands

### Manual Cloudflare Pages Deploy
```bash
npm run build
npx wrangler pages deploy dist/ --project-name=quickfit-tech
```

### Add Custom Domain
```bash
npx wrangler pages domain add quickfit.tech --project-name=quickfit-tech
```

## Environment Variables

### Frontend (.env)
```
VITE_MINIMAX_API_KEY=your_key_here
VITE_ADMIN_USERNAMES=Quickfit_admin
VITE_ADMIN_EMAILS=admin@example.com
```

### Production (.env.production)
```
VITE_API_URL=https://api.quickfit.tech
VITE_COGNITO_USER_POOL_ID=us-east-1_GH8fCdd5X
VITE_COGNITO_CLIENT_ID=jpusklgv2sb16kttf7j8fl98g
```

## Cognito Admin Setup

1. Create admin group:
```bash
aws cognito-idp create-group \
  --user-pool-id us-east-1_GH8fCdd5X \
  --group-name Admin \
  --description "QuickFit administrators"
```

2. Add user to group:
```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_GH8fCdd5X \
  --username user@example.com \
  --group-name Admin
```

## Code Splitting

Premium routes (AITrainer, Progress, SpotMe, Admin) are lazy-loaded for better performance:

```tsx
const AITrainer = lazy(() => import('./pages/AITrainer'))
```

## API Key Management

The z.ai API key is stored in AWS Secrets Manager and accessed by the Lambda function - it should NEVER be in frontend code.

### Store API Key
```bash
aws secretsmanager create-secret \
  --name quickfit-zai-api-key \
  --secret-string "your_api_key_here"
```

## Troubleshooting

### Login issues after deployment
- Clear localStorage: `localStorage.clear()`
- Check Cognito user is confirmed

### Cloudflare Pages not updating
- Wait 1-2 minutes for cache to clear
- Use direct deployment URL to verify

### API errors
- Check Lambda CloudWatch logs
- Verify API Gateway CORS settings
- Ensure Cognito token is valid
