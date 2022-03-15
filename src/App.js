import { Navigate, Route, Routes, Link } from 'react-router-dom'

import './App.css';

import SwapPage from './pages/SwapPage'
import StakePage from './pages/StakePage'
import VotePage from './pages/VotePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div className="App">
      <Link to={'/swap'}>swap</Link>
      <Link to={'/stake'}>stake</Link>
      <Link to={'/vote'}>vote</Link>
      <Link to={'/admin'}>admin</Link>
      <Routes>
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/stake" element={<StakePage />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="swap" />} />
      </Routes>
    </div>
  );
}

export default App;
