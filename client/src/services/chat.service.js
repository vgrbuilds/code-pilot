import api from "./api.service";

export const getChatHistory = async (repoId) => {
    const response = await api.get(`/chat/${repoId}/history`);
    return response.data;
};

export const sendMessage = async (repoId, message) => {
    const response = await api.post(`/chat/${repoId}/message`, { message });
    return response.data;
};
