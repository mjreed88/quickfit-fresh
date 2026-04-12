import { Amplify } from 'aws-amplify'

// Configure Amplify with existing Cognito User Pool
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_GH8fCdd5X',
      userPoolClientId: 'jpusklgv2sb16kttf7j8fl98g',
      signUpVerificationMethod: 'code' as const,
    }
  }
})

export default Amplify
