import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { ResultPanel } from './ResultPanel';
import { isValidWord } from './CustomAxios';
import { getWord } from './FileReader';
import { Keyboard } from './Keyboard';
import _ from 'lodash';

export const Game = () => {

    const [entries, setEntries] = useState([]);
    const [row, setRow] = useState([]);
    const [gameStatus, setGameStatus] = useState('IN_PROGRESS');
    const [currentElemIndex, setCurrentElemIndex] = useState(0);
    const [wrongEntry, setWrongEntry] = useState(false);
    const [correctWord, setCorrectWord] = useState('');
    const [alphabetColorMap, setAlphabetColorMap] = useState(new Map());
    const TAB_ENTRY_MAX = 30;
    const TAB_ENTRY_MIN = 0;
    const ROW_TAB_INDEX_RANGES = [[0, 4], [5, 9], [10, 14], [15, 19], [20, 24], [25, 29]];
    const ROW_CHAR_COUNT = 5;
    const MAX_TRIES = 6;

    useEffect(() => {
        switchInput(currentElemIndex);
    });

    useEffect(async () => {
        let word = await getWord();
        setCorrectWord(word);
    }, []);

    /**
     * switches to next input box
     * @param {number} nextIndex 
     * @returns 
     */
    const switchInput = (nextIndex) => {
        if (nextIndex < TAB_ENTRY_MIN || nextIndex >= TAB_ENTRY_MAX) {
            return;
        }

        let elems = document.getElementsByTagName('input');
        for (let i = 0; i < elems.length; i++) {
            let tidx = Number(elems[i].getAttribute("tabindex"));
            if (tidx === nextIndex) {
                elems[i].focus();
                break;
            }
        }
    }

    /**
     * handled key entered by user
     * @param {element} elmnt 
     */
    const handleCellChange = (elmnt) => {
        let existingRow = row;
        let next = -1;
        let tabIndexRangeMin = -1, tabIndexRangeMax = -1;
        let tabindex = Number(elmnt.target.getAttribute("tabindex"));
        for (let i = 0; i < ROW_TAB_INDEX_RANGES.length; i++) {
            if (tabindex >= ROW_TAB_INDEX_RANGES[i][0] && tabindex <= ROW_TAB_INDEX_RANGES[i][1]) {
                tabIndexRangeMin = ROW_TAB_INDEX_RANGES[i][0];
                tabIndexRangeMax = ROW_TAB_INDEX_RANGES[i][1];
                break;
            }
        }
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            existingRow.pop();
            next = (tabindex <= tabIndexRangeMin || wrongEntry || existingRow.length % 5 === (tabindex) % 5) ? tabindex : tabindex - 1;
        } else if (elmnt.keyCode >= 65 && elmnt.keyCode <= 90) {
            if (existingRow.length < ROW_CHAR_COUNT) {
                existingRow.push(elmnt.key.toUpperCase());
                next = tabindex <= tabIndexRangeMax ? tabindex + 1 : tabindex;
            }
        }
        setRow(existingRow);
        setCurrentElemIndex(next);
        setWrongEntry(false);
        console.log(next);
    }

    /**
     * handles entry by user on submit
     * @returns 
     */
    const handleSubmit = async () => {
        if (! await validateRow(row))
            return;

        let existingEntries = [...(entries || [])];

        let correct = correctWord.toUpperCase().split('');
        console.log(correct);

        let entryColorMap = getEntryColorMap(row, correct);
        console.log({ entryColorMap });

        let alphaColMap = getAlphaColorMap(entryColorMap);
        setAlphabetColorMap(alphaColMap);

        existingEntries.push(entryColorMap);
        setEntries(existingEntries);
        setRow([]);

        let status = getGameStatus(entryColorMap, existingEntries);
        setGameStatus(status);
    }

    /**
     * validates if an entry has reqd character count and if its a valid word
     * @param {*} row 
     * @returns boolean value true or false
     */
    const validateRow = async (row) => {
        if (row.length < ROW_CHAR_COUNT) {
            enableToast("letterToast");
            return false;
        }
        if (! await isValidWord(row.join(''))) {
            enableToast("wrongToast");
            setWrongEntry(true);
            if ((entries.length + 1) * row.length === currentElemIndex && currentElemIndex < 30)
                setCurrentElemIndex(currentElemIndex - 1);

            console.log(currentElemIndex);
            return false;
        }

        return true;
    }

    /**
     * gets the current game status
     * @param {*} entryColorMap 
     * @param {*} existingEntries 
     * @returns SUCCESS or FAILURE or IN_PROGRESS
     */
    const getGameStatus = (entryColorMap, existingEntries) => {
        let status = 'SUCCESS';
        for (let i = 0; i < entryColorMap.length; i++) {
            if (entryColorMap[i][1] !== 'GREEN' && existingEntries.length === 6) {
                status = 'FAILURE';
                break;
            }
            if (entryColorMap[i][1] !== 'GREEN' && existingEntries.length < 6) {
                status = 'IN_PROGRESS';
                break;
            }
        }
        return status;
    }

    /**
     * 
     * @param {*} row 
     * @param {*} correct 
     * @returns character-color mapping
     */
    const getEntryColorMap = (row, correct) => {
        let entryColorMap = [];
        for (let i = 0; i < row.length; i++) {
            let color = 'N/A';
            let letterIdx = [];
            for (let index = 0; index < correct.length; index++) {
                if (correct[index] === row[i]) {
                    letterIdx.push(index);
                }
            }

            if (letterIdx.includes(i)) {
                color = 'GREEN';
                correct[letterIdx] = '#';
            }
            console.log(row[i] + " : " + color);
            entryColorMap.push([row[i], color]);
        }
        for (let i = 0; i < row.length; i++) {
            let color = 'N/A';
            if (entryColorMap[i][1] === 'N/A') {
                let letterIdx = correct.indexOf(row[i]);
                if (letterIdx >= 0) {
                    color = 'YELLOW';
                    correct[letterIdx] = '#';
                    console.log(row[i] + " : " + color);
                    entryColorMap[i][1] = color;
                }
            }
        }
        for (let i = 0; i < row.length; i++) {
            let color = 'N/A';
            if (entryColorMap[i][1] === 'N/A') {
                color = 'GREY';
                console.log(row[i] + " : " + color);
                entryColorMap[i][1] = color;
            }
        }
        return entryColorMap;
    }

    /**
     * get alphaColMap for current entry
     * @param {*} entryColorMap 
     * @returns 
     */
    const getAlphaColorMap = (entryColorMap) => {
        let alphaColMap = alphabetColorMap;
        let colorPriorityMap = new Map();
        colorPriorityMap.set('GREEN', 0);
        colorPriorityMap.set('YELLOW', 1);
        colorPriorityMap.set('GREY', 2);
        for (let i in entryColorMap) {
            let updateAlphaColorMap = true;
            if (alphaColMap.has(entryColorMap[i][0])) {
                if (colorPriorityMap.get(alphaColMap.get(entryColorMap[i][0])) <= colorPriorityMap.get(entryColorMap[i][1])) {
                    updateAlphaColorMap = false;
                }
            }
            if (updateAlphaColorMap)
                alphaColMap.set(entryColorMap[i][0], entryColorMap[i][1]);
        }
        return alphaColMap;
    }

    /**
     * displays toast message
     * @param {String} id 
     */
    const enableToast = (id) => {
        let toast = document.getElementById(id);
        toast.className = toast.className + " show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        },
            1000);
    }

    /**
     * calculates tabindex attribute of input
     * @param {*} rowNo 
     * @param {*} colNo 
     * @returns 
     */
    const calcTabIndex = (rowNo, colNo) => {
        return 5 * Number(rowNo) + Number(colNo);
    }

    const rows = _.times(gameStatus !== 'IN_PROGRESS' ? entries.length : entries.length < MAX_TRIES ? (entries.length + 1) : MAX_TRIES, (rowNo) => (
        <Grid.Row columns={5} key={rowNo} style={{ border: "none" }}>
            {_.times(5, (colNo) => (
                <Grid.Column key={colNo}>
                    <input type="text" maxLength="1" tabIndex={calcTabIndex(rowNo, colNo)}
                        disabled={entries.length > rowNo ? true : false} value={entries.length > rowNo ? entries[rowNo][colNo][0] : row.length > colNo ? row[colNo] : ''}
                        style={{
                            backgroundColor: entries.length > rowNo ? entries[rowNo][colNo][1] === 'GREY' ? 'grey' : entries[rowNo][colNo][1] === 'YELLOW' ? '#E1D328' : entries[rowNo][colNo][1] === 'GREEN' ? '#6aaa64' : 'white' : 'white',
                            color: entries.length > rowNo ? 'white' : 'black'
                        }}
                        onChange={e => { }}
                        onKeyUp={e => handleCellChange(e)} />
                </Grid.Column>
            ))}
        </Grid.Row>
    ))

    return (
        <div className='div-css' onClick={() => switchInput(currentElemIndex)}>
            <div id="letterToast" className='toast'>Not Enough Letters</div>
            <div id="wrongToast" className='toast'>Word Not in Dictionary</div>
            <Grid>
                {rows}
            </Grid>
            <ResultPanel gameStatus={gameStatus} tryCount={entries.length} correctWord={correctWord.toUpperCase()} handleSubmit={handleSubmit} />
            <Keyboard alphabetColormap={alphabetColorMap} handleCellChange={handleCellChange} />
        </div>
    );
}

