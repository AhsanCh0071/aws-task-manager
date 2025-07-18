const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_8cNxfCbGI",
      userPoolClientId: "184uedr5kev2o360vocos1ji69",
      signUpVerificationMethod: "code",
    },
  },
};

export default awsConfig;
