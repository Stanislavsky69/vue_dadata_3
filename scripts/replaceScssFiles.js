const { resolve } = require('path');
const { copyFile } = require('fs/promises');


const STYLES_FILE = '../src/assets/styles.scss';
const DIST_PATH = '../dist/styles.scss';

const copyStylesFile = async () => {
    try {
        await copyFile(resolve(__dirname, STYLES_FILE), resolve(__dirname, DIST_PATH));
    } catch(error){
        console.log(error)
    }
}

copyStylesFile();


