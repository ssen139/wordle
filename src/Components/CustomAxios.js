import axios from 'axios';

export const isValidWord = async (word) => {
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

    try {
        const response = await axios.get(url);
        if (response.data !== null && response.data !== undefined) {
            return true;
        }
    } catch (err) {
        return false;
    }
}