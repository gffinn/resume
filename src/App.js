import { Route, Routes } from 'react-router-dom';
import './App.css';
import { RecoilRoot } from 'recoil';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Resume" element={<Resume />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </RecoilRoot>
    </div>
  );
}
