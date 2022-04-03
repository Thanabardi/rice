import { Navigate, Route, Routes, Link,useNavigate } from 'react-router-dom'

import './App.css';

import SwapPage from './pages/SwapPage'
import StakePage from './pages/StakePage'
import VotePage from './pages/VotePage'
import AdminPage from './pages/AdminPage'


import NavBar from './components/NavBar'
import CallMetaMask from './components/CallMetaMask'

import NFT from './pages/NFT';
import { AddressContextProvider } from './context/AddressContextProvider';

function App() {
  return (
    <div className="App">
      <AddressContextProvider>
      <NavBar />
      <CallMetaMask />
      <Routes>
        <Route path="/nft" element={<NFT />} />
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/stake" element={<StakePage />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="swap" />} />
      </Routes>
      </AddressContextProvider>
    </div>
  );
}

export default App;
