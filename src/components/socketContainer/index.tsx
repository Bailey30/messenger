import React, { useState, useEffect, useMemo, useReducer } from "react";
import { socket } from "../../utils/socket";
import styles from "./styles.module.scss";
import { ConnectionState } from "../connectionState";
import { ConnectionManager } from "../connectionManager";
import { MyForm } from "../chat";
import Events from "../events";
import ContactsList from "../contactsList";
import { MessageT, SelectedUserT, myUserT, userT } from "../../types";
import Messages from "../messages";
import { scrollToBottom } from "../../utils/scrollToBottom";

const SocketContainer = () => {
    const [isConnected, setIsConnected] = useState<any>(socket.connected);
    const [fooEvents, setFooEvents] = useState<any>([]);
    const [myUser, setMyUser] = useState<myUserT>({
        userID: "",
        username: "",
        dbId: "",
    });
    const [users, setUsers] = useState<userT[]>([]);
    const [selectedUser, setSelectedUser] = useState<SelectedUserT>({
        userID: "",
        username: "",
        messages: [""],
        conversationId: "",
    });

    const [messagesWithSelectedUser, setMessagesWithSelectedUser] = useState<
        string[]
    >([]);
    const [isMount, setIsMount] = useReducer((isMount) => {
        return !isMount;
    }, false);

    const onPrivateMessage = ({ content, from }: any) => {
        console.log(content);
        console.log(from);
        const currentUsers = users.map((user: any) => {
            if (user.userID === from) {
                if (user.messages) {
                    return { ...user, messages: [...user.messages, content] };
                } else {
                    return { ...user, messages: [content] };
                }
            } else {
                return user;
            }
        });

        setUsers(currentUsers);
        const newMessage: MessageT = {
            content: content,
            conversationId: selectedUser.conversationId as number | string,
            createdAt: new Date().toISOString(),
            senderId: myUser.dbId,
        };

        const messages =
            selectedUser.messages.length > 0
                ? [...selectedUser.messages, newMessage]
                : [newMessage];

        setSelectedUser((prevState: SelectedUserT) => ({
            ...prevState,
            messages,
        }));
    };

    useEffect(() => {
        console.log(users);
        socket.on("private message", onPrivateMessage);

        return () => {
            socket.off("private message", onPrivateMessage);
        };
    }, [users]);

    useEffect(() => {
        scrollToBottom();
        function onConnect() {
            setMyUser({ ...myUser, userID: socket.id });
            setIsConnected(true);
        }

        function onDisconnect(user: any) {
            console.log(`${user} disconnected`);
            setIsConnected(false);
        }

        function onFooEvent(value: any) {
            setFooEvents((previous: any) => [...previous, value]);
            console.log(users);
        }

        function onUsers(value: any) {
            users.forEach((user: any) => {
                console.log(user.userID);
                console.log(socket.id);
                user.self = user.userID === socket.id;
                // initReactiveProperties(user);
            });
            console.log(socket.id);
            // const new = [...value]
            const newUsers = [...value];
            const otherUsers = newUsers.filter((user) => {
                return user.userID !== socket.id;
            });
            console.log(otherUsers);

            const contacts = value.map((contact: any) => {
                return { ...contact, userID: contact.id };
            });
            console.log(contacts);
            setUsers(contacts);
        }

        function onUserConnected(user: userT) {
            console.log(`${user.username} connected`);
            setUsers((prev: any) => [...prev, user]);
        }

        const sessionID = localStorage.getItem("sessionID");

        if (sessionID) {
            // triggers on refresh
            console.log(sessionID);
            socket.auth = { sessionID };
            socket.connect();
        }

        socket.on("session", ({ sessionID, userID, username, dbId }) => {
            console.log({ sessionID });
            console.log(username);
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            (socket as any).userID = userID;
            setMyUser({
                ...myUser,
                username: username,
                userID: userID,
                dbId: dbId,
            });
        });

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("chat message", onFooEvent);
        socket.on("users", onUsers);
        socket.on("user connected", onUserConnected);
        socket.on("connect_error", (err) => {
            console.log(err);
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("chat message", onFooEvent);
            socket.off("users", onUsers);
            socket.off("user connected", onUserConnected);
            socket.off("connect_error", () => {});
        };
    }, []);

    useEffect(() => {
        // const messagesFromSelectedUser = users.flatMap((user: userT) => {
        //     if (user.userID === selectedUserID) {
        //         return user.messages;
        //     }
        // }) as any;
        // setMessagesWithSelectedUser(messagesFromSelectedUser);
        scrollToBottom();
    }, [selectedUser]);

    function disconnect() {
        socket.disconnect();
    }

    return (
        <div className={`${styles.chatComponent}`}>
            {!isConnected ? (
                <ConnectionManager
                    setMyUser={setMyUser}
                    myUser={myUser}
                    username={myUser.username}
                />
            ) : (
                <>
                    <div className={`${styles.left}`}>
                        <ContactsList
                            users={users}
                            setSelectedUser={setSelectedUser}
                            selectedUser={selectedUser}
                            myUser={myUser}
                            isConnected={isConnected}
                            // setIsMount={setIsMount}
                            // isMount={isMount}
                        />
                    </div>
                    <div className={`${styles.right}`}>
                        <div className={`${styles.chatTopBar}`}>
                            <p>{selectedUser.username}</p>
                        </div>
                        <div className={`${styles.chat}`}>
                            <Messages
                                users={users}
                                selectedUser={selectedUser}
                                messages={selectedUser.messages}
                                myUser={myUser}
                            />
                            <MyForm
                                setSelectedUser={setSelectedUser}
                                selectedUser={selectedUser}
                                users={users}
                                setUsers={setUsers}
                                myUser={myUser}
                            />
                            <button onClick={disconnect}>Log out</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SocketContainer;
