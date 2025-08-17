import { useRecoilState } from "recoil";
import { textInputState } from "../recoil/atoms/textInput";
import { useState } from "react";
import { splitWords, countWords } from "../practiceFiles/WordCount";

export default function Practice() {
    const [state, setState] = useRecoilState(textInputState);
    const [localInput, setLocalInput] = useState(state.textInput);

    const handleSubmit = (e) => {
        e.preventDefault();
        const wordsArray = splitWords(localInput);
        const wordCount = countWords(localInput);
        setState({ ...state, textInput: localInput, wordsArray, wordCount });
    };

    return (
        <>
            <div>Practice Page</div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="inputText" 
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)} 
                    placeholder="Type something here..." 
                />
                <label>Enter as much text as you want here</label>
                <button type="submit">Submit</button>
            </form>
            <div>
                <p>Current Input: {state.textInput}</p>
                <p>Word Count: {state.wordCount}</p>
                <p>Array of Words: {state.wordsArray && state.wordsArray.join(", ")}</p>
            </div>
        </>
    );
}