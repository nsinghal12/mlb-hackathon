import os from 'os';
import fs from 'fs-extra';

const userHomeDir = os.homedir();

// base root to store data
const ROOT = `${userHomeDir}//mlb/data`;

export function writeObject(id, type, data) {
    const filePath = `${ROOT}/${type}/${id}.json`;

    // create folder, if required
    fs.ensureDirSync(`${ROOT}/${type}`, { recursive: true });

    // write data
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {
        encoding: 'utf8'
    });
}

export function readObject(id, type) {
    const filePath = `${ROOT}/${type}/${id}.json`;

    // check if file exists
    const exists = fs.existsSync(filePath);
    if(!exists) {
        return undefined;
    }

    // read data
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

export function readAllObjects(type) {
    const dirPath = `${ROOT}/${type}`;

    // check if directory exists
    const exists = fs.existsSync(dirPath);
    if(!exists) {
        return [];
    }

    // read all files in directory
    const files = fs.readdirSync(dirPath, {
        recursive: true,
    });
    const data = files.map(file => {
        const filePath = `${dirPath}/${file}`;
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
    });

    return data;
}