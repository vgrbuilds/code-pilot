export const normalizeRepoUrl = (url) => {
    if (!url) return "";
    return url
        .trim()               // Remove leading/trailing spaces
        .toLowerCase()        // Make case-insensitive
        .replace(/\.git$/, "")// Remove .git suffix
        .replace(/\/$/, "");  // Remove trailing slash
};

export default normalizeRepoUrl;
