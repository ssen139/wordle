const file = require("../Assets/words1.txt");

export const getWord = async () => {
    let textArr = [];
    let wordList = [];
    let text = readTextFile(file);

    if(text!==undefined && text.length>0){
        textArr = text.split('\r\n');
    }

    if (textArr !== undefined && textArr.length > 0) {
        for (let i = 0; i < textArr.length; i++) {
            if (textArr[i].length === 5) {
                wordList.push(textArr[i]);
            }
        }

        let word = wordList[Math.floor(Math.random() * wordList.length)];
        return word;
    }
}

const readTextFile = (file) => {
    let rawFile = new XMLHttpRequest();
    let text;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                text = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return text;
};