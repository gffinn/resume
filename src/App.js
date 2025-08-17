import { Route, Routes } from "react-router-dom";
import './App.css';
import { RecoilRoot } from "recoil";
import Home from './pages/Home';
import Practice from './pages/Practice';

function App() {
  return (
    <div>
      <RecoilRoot>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Practice" element={<Practice/>} />
      </Routes>
      </RecoilRoot>
    </div>
  );
}

export default App;