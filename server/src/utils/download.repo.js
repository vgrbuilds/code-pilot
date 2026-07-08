import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import extractZip from 'extract-zip';

// function to download a repo as zip and extract in temp repo
export const downloadRepo = async (repo_url) => {
    const repoName = repo_url.split('/').pop();
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "repo-"));
    const zipPath = path.join(tempDir, `${repoName}.zip`);
    
    // Attempt to download from main branch first
    let zipUrl = `${repo_url}/archive/refs/heads/main.zip`;
    let response = await fetch(zipUrl);
    
    if (!response.ok) {
        // Fallback to master branch if main fails
        zipUrl = `${repo_url}/archive/refs/heads/master.zip`;
        response = await fetch(zipUrl);
    }

    if (!response.ok) {
        throw new Error(`Failed to download repo zip: ${response.statusText} (Tried main.zip and master.zip)`);
    }
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(zipPath, Buffer.from(buffer));
    await extractZip(zipPath, { dir: tempDir });
    return tempDir;
};

export default downloadRepo;