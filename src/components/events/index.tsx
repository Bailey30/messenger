import React from "react";
import { socket } from "../../utils/socket";

interface Props {
    events: any;
    users: any;
}

const Events = ({ events, users }: Props) => {
    const handleSelectedUser = (user: any) => {
        // TODO = list all users down side in separate component
        // TODO - send own userID
        // TODO - alert other user
        // TODO - move into private chat and show only messages with person in that room
        // TODO -

        socket.emit("private chat started", {
            content: "private chat started",
            to: user.userID,
        });
    };
    return (
        <ul>
            {events.map((event: any, index: number) => (
                <li key={index}>{event}</li>
            ))}
        </ul>
    );
};

export default Events;
