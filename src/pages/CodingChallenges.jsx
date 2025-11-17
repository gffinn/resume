import { useRecoilState } from 'recoil';
import { textInputState } from '../recoil/atoms/textInput';
import { useState } from 'react';
import { splitWords, countWords } from '../practiceFiles/WordCount';
import NavBar from '../components/NavBar';

export default function CodingChallenges() {
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
      <NavBar />
      <main>
        <h1>Engineering Challenges</h1>
        <form onSubmit={handleSubmit} aria-labelledby="form-heading">
          <h2 id="form-heading" className="visually-hidden">
            Text Analysis Form
          </h2>
          <div>
            <label htmlFor="inputText">
              Enter as much text as you want here
            </label>
            <input
              type="text"
              id="inputText"
              name="inputText"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Type something here..."
              aria-describedby="input-help"
            />
            <span id="input-help" className="visually-hidden">
              Enter text to analyze word count
            </span>
          </div>
          <button type="submit">Submit</button>
        </form>
        <section aria-live="polite" aria-label="Analysis results">
          <p>Current Input: {state.textInput}</p>
          <p>Word Count: {state.wordCount}</p>
          <p>
            Array of Words: {state.wordsArray && state.wordsArray.join(', ')}
          </p>
        </section>
      </main>
    </>
  );
}
