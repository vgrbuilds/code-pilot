import api from "./api.service";

export const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
};

export const deleteProfile = async () => {
    const response = await api.delete("/auth/profile");
    return response.data;
};
