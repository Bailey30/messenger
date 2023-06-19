import React, { useState } from "react";
import { socket } from "../../utils/socket";
import styles from "./styles.module.scss";
import { signIn, signUp, verifySignUp } from "../../utils/cognito/cognitoUtils";

interface Props {
    setMyUser: any;
    myUser: { userID: string; username: string };
    username: string;
}

export function ConnectionManager({ setMyUser, myUser, username }: Props) {
    const sessionID = localStorage.getItem("sessionID");
    const [signupLogin, setSignupLogin] = useState<string>("login");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [user, setUser] = useState<any>();
    const [step, setStep] = useState<"details" | "verify">("details");
    const [verificationCode, setVerificationCode] = useState<string>("");

    function handleButton(e: any) {
        if (signupLogin === "login") {
            signIn(e, email, password);
        } else {
            signUp(e, email, password, setUser, setStep);
        }
    }

    function handleVerify(e: any) {
        verifySignUp(e, user, verificationCode);
    }

    return (
        <div className={`${styles.page}`}>
            <div className={`${styles.content}`}>
                {step === "details" && (
                    <>
                        <p
                            onClick={() =>
                                setSignupLogin(
                                    signupLogin === "login" ? "signup" : "login"
                                )
                            }
                        >
                            {signupLogin === "login"
                                ? "Don't have an account? Create one here"
                                : "Already have an account? Sign in here"}
                        </p>

                        <input
                            value={email!}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email"
                        />

                        <input
                            value={password!}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                        />
                        <button onClick={handleButton}>
                            {" "}
                            {signupLogin === "login" ? "Log in" : "Sign up"}
                        </button>
                    </>
                )}
                {step === "verify" && (
                    <>
                        <input
                            value={verificationCode!}
                            onChange={(e) =>
                                setVerificationCode(e.target.value)
                            }
                            placeholder="verificationCode"
                        />
                        <button onClick={handleVerify}>Verify</button>
                    </>
                )}
                {/* <button onClick={disconnect}>Disconnect</button> */}
            </div>
        </div>
    );
}
