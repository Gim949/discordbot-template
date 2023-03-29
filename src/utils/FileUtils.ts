import fs from "node:fs/promises"
import path from "node:path";

export async function recursiveReadDir(directory: string) {
    const files: string[] = [];
    const recur = async (dir: string) => {
        const fileList = await fs.readdir(dir);
        await Promise.all(fileList.map(async f => {
            const file = path.join(dir, f);
            const stat = await fs.stat(file);
            if(stat.isDirectory())
                await recur(file);
            else
                files.push(file);
        }));
    }
    
    await recur(directory);
    return files;
}