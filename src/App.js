import { Route, Routes } from "react-router-dom";
import './App.css';
import { RecoilRoot } from "recoil";
import Home from './pages/Home';
import CodingChallenges from "./pages/CodingChallenges";
import Resume from "./pages/Resume";
import Announcements from "./pages/Announcements";

export default function App() {
  return (
    <div>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CodingChallenges" element={<CodingChallenges />} />
          <Route path="/Resume" element={<Resume />} />
          <Route path="/Announcements" element={<Announcements />} />
        </Routes>
      </RecoilRoot>
    </div>
  );
}