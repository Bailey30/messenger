import React, { useState } from "react";
import { socket } from "../../utils/socket";
import styles from "./styles.module.scss";
import { MessageT, SelectedUserT, myUserT, userT } from "../../types";

interface Props {
    setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUserT>>;
    selectedUser: SelectedUserT;
    users: userT[];
    setUsers: any;
    myUser: myUserT;
}

export function MyForm({
    selectedUser,
    setSelectedUser,
    users,
    setUsers,
    myUser,
}: Props) {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log(myUser);

    function onSubmit(event: any) {
        event.preventDefault();
        // setIsLoading(true);

        // socket.timeout(1000).emit("chat message", value, () => {
        //     setIsLoading(false);
        //     console.log(value);
        // });
        console.log("sending private message");
        console.log(selectedUser.conversationId);
        console.log(selectedUser.userID);
        socket.emit("private message", {
            content: value,
            to: selectedUser.userID,
            conversationId: selectedUser.conversationId,
            toUsername: selectedUser.username,
        });

        const currentUsers = users.map((user: any) => {
            if (user.userID === selectedUser.userID) {
                console.log("select", user);
                if (user.messages) {
                    return { ...user, messages: [...user.messages, value] };
                } else {
                    return { ...user, messages: [value] };
                }
            } else {
                console.log(user);
                return user;
            }
        });
        console.log(currentUsers);
        setUsers(currentUsers);

        const newMessage: MessageT = {
            content: value,
            conversationId: selectedUser.conversationId as number | string,
            createdAt: new Date().toISOString(),
            senderId: myUser.dbId,
        };

        // const oldMessages = [...selectedUser.messages];
        // setSelectedUser({
        //     ...selectedUser,
        //     messages: [...oldMessages, newMessage],
        // });

        const messages =
            selectedUser.messages.length > 0
                ? [...selectedUser.messages, newMessage]
                : [newMessage];

        setSelectedUser((prevState: SelectedUserT) => ({
            ...prevState,
            messages,
        }));
    }

    return (
        <div className={`${styles.inputSection}`}>
            <form onSubmit={onSubmit} className={`${styles.inputContainer}`}>
                <input onChange={(e) => setValue(e.target.value)} />

                <button onClick={(e) => onSubmit(e)} disabled={isLoading}>
                    Submit
                </button>
            </form>
        </div>
    );
}
