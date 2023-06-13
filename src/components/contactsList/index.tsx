import React, { useCallback, useEffect } from "react";
import { SelectedUserT, myUserT, userT } from "../../types";
import { getMessageHistory } from "../../utils/api";
import styles from "./styles.module.scss";
import { scrollToBottom } from "../../utils/scrollToBottom";
// import { queryClient } from "../../App";
import { useQuery } from "@tanstack/react-query";

interface Props {
    users: userT[];
    setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUserT>>;
    selectedUser: SelectedUserT;
    myUser: myUserT;
    isConnected: boolean;
    // isMount: boolean;
    // setIsMount: any;
}

const ContactsList = ({
    users,
    setSelectedUser,
    selectedUser,
    myUser,
    isConnected,
}: Props) => {
    const { data } = useQuery({
        queryKey: ["message", selectedUser.username],
        queryFn: async () =>
            await getMessageHistory([selectedUser.username, myUser.username]),
        // refetchOnMount: false,
        // refetchOnWindowFocus: false,
        staleTime: 1000000000, // ling stale time stopped more calls as component was rerendering
    });

    console.log(data?.data);
    console.log("test");

    useEffect(() => {
        console.log({ data });
    }, [data]);

    useEffect(() => {
        console.log({ selectedUser });
    }, [selectedUser.username]);

    const HandleSelectedUser = async (user: userT) => {
        const messageHistory: any = await getMessageHistory([
            user.username,
            myUser.username,
        ]);
        const conversationId = messageHistory?.data.conversationId ?? "";
        console.log(messageHistory);
        console.log(conversationId);

        setSelectedUser({
            ...selectedUser,
            userID: user.userID,
            username: user.username,
            conversationId: messageHistory.data.conversationId,
            //TODO - stop this being an array from the backend
            messages: messageHistory.data.conversationHistory,
        });
    };

    return (
        <div className={`${styles.contactsList}`}>
            <div className={`${styles.myUser}`}>
                <div className={`${styles.username}`}>{myUser.username}</div>
                <p>{isConnected ? "online" : "offine"}</p>
            </div>

            <ul>
                {users.map((user, i) => {
                    return (
                        <li
                            key={i}
                            onClick={() => HandleSelectedUser(user)}
                            className={`${styles.contact}`}
                        >
                            <div className={`${styles.imageContainer}`}>
                                <img />
                            </div>
                            <div className={`${styles.right}`}>
                                <div className={`${styles.username}`}>
                                    {user.username}
                                </div>
                                <span>
                                    {user.onlineStatus === true
                                        ? "online"
                                        : "offline"}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ContactsList;
