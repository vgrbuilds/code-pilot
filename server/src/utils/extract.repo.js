import fs from "fs/promises";
import path from "path";

const IGNORED_DIRECTORIES = new Set([
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage"
]);

const ALLOWED_EXTENSIONS = new Set([
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".cs",
    ".go",
    ".rs",
    ".php",
    ".rb",
    ".swift",
    ".kt",
    ".md",
    ".json",
    ".yaml",
    ".yml",
    ".toml"
]);

const shouldIgnoreDirectory = (dirName) => {
    return IGNORED_DIRECTORIES.has(dirName);
};

const shouldProcessFile = (fileName) => {
    return ALLOWED_EXTENSIONS.has(path.extname(fileName));
};

const walkDirectory = async (rootDir, currentDir, files) => {
    const entries = await fs.readdir(currentDir, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            if (shouldIgnoreDirectory(entry.name)) continue;

            await walkDirectory(rootDir, fullPath, files);
        } else {
            if (!shouldProcessFile(entry.name)) continue;

            const content = await fs.readFile(fullPath, "utf8");

            files.push({
                file_path: path.relative(rootDir, fullPath),
                content
            });
        }
    }
};

export const extractRepoContent = async (repoPath) => {
    const files = [];

    await walkDirectory(repoPath, repoPath, files);

    return files;
};