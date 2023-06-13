import React from "react";
import SocketContainer from "../socketContainer";
import styles from "./styles.module.scss";

const ChatPage = () => {
    return (
        <div className={`${styles.chatPage}`}>
            <SocketContainer />
        </div>
    );
};

export default ChatPage;
