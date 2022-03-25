import { Navigate, Route, Routes, Link,useNavigate } from 'react-router-dom'

import './App.css';

import SwapPage from './pages/SwapPage'
import StakePage from './pages/StakePage'
import VotePage from './pages/VotePage'
import AdminPage from './pages/AdminPage'

function App() {
  const path_rice = localStorage.state;
  const navigate = useNavigate();

  return (
    <div className="App">
      <center>
      <div className='topnav'>
        <div onClick={()=>{localStorage.state="swap";  navigate('/swap')}} style={{backgroundColor:path_rice==="swap"?'#55d6a7':'white'}}>swap</div>
        <div onClick={()=>{localStorage.state="stake"; navigate('/stake')}} style={{backgroundColor:path_rice==="stake"?'#55d6a7':'white'}}>stake</div>
        <div onClick={()=>{localStorage.state="vote"; navigate('/vote')}} style={{backgroundColor:path_rice==="vote"?'#55d6a7':'white'}}>vote</div>
        <div onClick={()=>{localStorage.state="admin"; navigate('/admin')}} style={{backgroundColor:path_rice==="admin"?'#55d6a7':'white'}}>admin</div>
      </div>
      </center>
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
