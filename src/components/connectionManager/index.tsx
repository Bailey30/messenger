import React, { useState } from "react";
import { socket } from "../../utils/socket";
import styles from "./styles.module.scss";

interface Props {
    setMyUser: any;
    myUser: { userID: string; username: string };
    username: string;
}

export function ConnectionManager({ setMyUser, myUser, username }: Props) {
    const sessionID = localStorage.getItem("sessionID");
    const [signupLogin, setSignupLogin] = useState<string>("login");

    function connect() {
        // TODO - save sessions in DB
        // TODO - figure out if i still want this functionality here
        // if (sessionID) {
        //     console.log(sessionID);
        //     socket.auth = { sessionID, username: myUser.username };
        // } else {
        socket.auth = { username: myUser.username };
        // }
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <div className={`${styles.page}`}>
            <div className={`${styles.content}`}>
                <input
                    value={username!}
                    onChange={(e) =>
                        setMyUser({ ...myUser, username: e.target.value })
                    }
                />
                <button onClick={connect}>Connect</button>
                {/* <button onClick={disconnect}>Disconnect</button> */}
            </div>
        </div>
    );
}
