import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
} from "amazon-cognito-identity-js";

export const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID as string,
    ClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID as string,
};

export const userPool = new CognitoUserPool(poolData);
