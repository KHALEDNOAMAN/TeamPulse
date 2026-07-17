import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useData } from './hooks/useData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OKRTracker from './components/OKRTracker';
import SprintAnalytics from './components/SprintAnalytics';
import TeamView from './components/TeamView';
import MeetingNotes from './components/MeetingNotes';
import RetroBoard from './components/RetroBoard';

export default function App() {
  const data = useData();

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard data={data} />} />
            <Route path="/okrs" element={<OKRTracker data={data} />} />
            <Route path="/sprints" element={<SprintAnalytics data={data} />} />
            <Route path="/team" element={<TeamView data={data} />} />
            <Route path="/meetings" element={<MeetingNotes data={data} />} />
            <Route path="/retros" element={<RetroBoard data={data} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
