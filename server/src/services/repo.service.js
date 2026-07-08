import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import extractZip from 'extract-zip';
import Repo from '../models/repo.model.js';
import {exec} from 'child_process';
import { promisify } from "util";

//function to download a repo as zip and exract in temp repo
const downloadRepo = async (repo_url) => {
    const repoName = repo_url.split('/').pop();
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "repo-"));
    const zipPath = path.join(tempDir, `${repoName}.zip`);
    const zipUrl = `${repo_url}/archive/refs/heads/main.zip`;
    const reposonse = await fetch(zipUrl);
    if (!reposonse.ok) {
        throw new Error(`Failed to download repo: ${reposonse.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(zipPath, Buffer.from(buffer));
    await extractZip(zipPath, { dir: tempDir});
    return tempDir;
}


//function to check if repo exists in db
const checkIfRepoExists = async (repo_url) => {
    const normalizedUrl = normalizeRepoUrl(repo_url);
    const exists = await Repo.exists({
        repo_url: normalizedUrl
    });
    return !!exists;
};



const exractRepoContent = async (tempDir) => {
    

}