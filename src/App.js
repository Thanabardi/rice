import { Navigate, Route, Routes, Link,useNavigate } from 'react-router-dom'

import './App.css';

import SwapPage from './pages/SwapPage'
import StakePage from './pages/StakePage'
import VotePage from './pages/VotePage'
import AdminPage from './pages/AdminPage'

import NavBar from './components/NavBar'

function App() {
  return (
    <div className="App">
      <NavBar />
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
