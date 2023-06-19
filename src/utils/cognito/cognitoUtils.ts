import {
    CognitoUserAttribute,
    AuthenticationDetails,
    CognitoUser,
} from "amazon-cognito-identity-js";
import { userPool } from "./poolData";

/**
 * Handles the sign-up process.
 *
 * @param e - The event object, typically a form submission event.
 * @param email - The email entered by the user during sign-up.
 * @param password - The password entered by the user during sign-up.
 * @param setUser - A function to update the user state in React.
 */
export const signUp = (
    e: any,
    email: string,
    password: string,
    setUser: React.Dispatch<any>,
    setStep: React.Dispatch<any>
) => {
    try {
        e.preventDefault();

        // Create a new CognitoUserAttribute object with the email data
        const dataEmail = { Name: "email", Value: email };
        const attributeEmail = new CognitoUserAttribute(dataEmail);

        // Create an attribute list and add the email attribute to it
        const attributeList = [];
        attributeList.push(attributeEmail);

        // Sign up the user using the provided email, password, and attribute list
        userPool.signUp(
            email,
            password,
            attributeList,
            [],
            function (err, result) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }

                // Get the CognitoUser object from the result
                var cognitoUser = result?.user;

                // Update the user state in React
                setUser(cognitoUser);

                // Log the username of the signed-up user
                console.log("user name is " + cognitoUser?.getUsername());
                setStep("verify");
            }
        );
    } catch (error) {
        console.log(error);
    }
};

/**
 * Handles the verification of a sign-up.
 *
 * @param e - The event object, typically a form submission event.
 * @param user - The CognitoUser object representing the user.
 * @param verificationCode - The verification code entered by the user.
 */
export const verifySignUp = (e: any, user: any, verificationCode: string) => {
    e.preventDefault();

    try {
        // Confirm the sign-up using the provided verification code
        user.confirmRegistration(
            verificationCode,
            true,
            function (err: any, result: any) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }

                // Log the result of the confirmation
                console.log("call result: " + result);
            }
        );
    } catch (error) {
        console.log(error);
    }
};

/**
 * Handles the sign-in process.
 *
 * @param e - The event object, typically a form submission event.
 * @param email - The email entered by the user during sign-in.
 * @param password - The password entered by the user during sign-in.
 */
export const signIn = (e: any, email: string, password: string) => {
    e.preventDefault();

    let signInSuccess: boolean;

    // Create an object with the user's email and password
    var authenticationData = {
        Username: email,
        Password: password,
    };

    // Create an object with the user's email and the user pool
    var userData = {
        Username: email,
        Pool: userPool,
    };

    // Create an AuthenticationDetails object using the authentication data
    var authenticationDetails = new AuthenticationDetails(authenticationData);

    // Create a new CognitoUser object using the user data
    const user = new CognitoUser(userData);

    // Authenticate the user using the provided authentication details
    user.authenticateUser(authenticationDetails, {
        onSuccess: function (result: any) {
            // Get the access token from the result
            var accessToken = result.getAccessToken().getJwtToken();

            // Log the access token
            console.log("accessToken", accessToken);

            signInSuccess = true;
        },

        onFailure: function (err: any) {
            // Handle the sign-in failure
            alert(err.message || JSON.stringify(err));

            signInSuccess = false;
        },
    });
};
