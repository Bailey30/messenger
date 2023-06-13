import React from "react";

interface Props {
    isConnected: any;
}
export function ConnectionState({ isConnected }: Props) {
    return <p>State: {"" + isConnected}</p>;
}
