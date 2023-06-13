export interface userT {
    username: string;
    userID: string;
    messages: (string | MessageT)[];
    onlineStatus?: boolean;
}

export interface SelectedUserT extends userT {
    conversationId: string | number;
}

export interface myUserT {
    userID: string;
    username: string;
    dbId: number | string;
}

export interface MessageT {
    content: string;
    conversationId: number | string;
    createdAt: string;
    sender?: {
        id: number;
        username: string;
    };
    senderId: number | string;
}
