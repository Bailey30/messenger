import React from "react";
import styles from "./styles.module.scss";
import { SelectedUserT, myUserT, userT } from "../../types";
import moment from "moment";

interface Props {
    selectedUser: SelectedUserT;
    users: userT[];
    messages: any;
    myUser: myUserT;
}

const Messages = ({ selectedUser, users, messages, myUser }: Props) => {
    // console.log(selectedUser);
    // const messagesFromSelectedUser = users.map((user: userT) => {
    //     if (user.userID === selectedUser.userID) {
    //         return user.messages;
    //     }
    // });

    // console.log(messagesFromSelectedUser);

    // console.log({ users });

    messages &&
        messages.forEach((element: { content: any }) => {
            console.log(element);
        });

    const formatTime = (time: string) => {
        return moment(time).format("hh:mm a DD/MM/YY");
    };

    return (
        <div className={`${styles.messagesContainer}`} id="messagesContainer">
            <ol className={`${styles.messageList}`}>
                {messages &&
                    messages.map((message: any, i: number) => {
                        const isFromMe = message.senderId === myUser.dbId;
                        return (
                            <li
                                className={`${styles.message} ${
                                    isFromMe ? styles.right : styles.left
                                }`}
                                key={i}
                            >
                                <div className={`${styles.messageTop}`}>
                                    <div className={`${styles.imageContainer}`}>
                                        <img />
                                    </div>
                                    <div className={`${styles.messageContent}`}>
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                                <div className={`${styles.timestamp}`}>
                                    {formatTime(message.createdAt)}
                                </div>
                            </li>
                        );
                    })}
            </ol>
            <div className={styles.overflowAnchor}></div>
        </div>
    );
};

export default Messages;
