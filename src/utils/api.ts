import axios from "axios";

export const getMessageHistory = async (usernames: string[]) => {
    try {
        const res = await axios.post("http://localhost:3001/messageHistory", {
            usernames,
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
