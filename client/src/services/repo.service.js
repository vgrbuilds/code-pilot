import api from "./api.service";

export const getAllRepos = async () => {
    const response = await api.get("/repos");
    return response.data;
};

export const getRepoById = async (id) => {
    const response = await api.get(`/repos/${id}`);
    return response.data;
};

export const ingestRepo = async (repo_url) => {
    const response = await api.post("/repos", { repo_url });
    return response.data;
};
