import { Navigate, Route, Routes } from 'react-router-dom'

// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home'
import Vote from './pages/Vote'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/rice" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="*" element={<Navigate to="rice" />} />
      </Routes>
    </div>
  );
}

export default App;
