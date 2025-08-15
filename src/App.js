import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import FormLogin from './Components/FormLogin/FormLogin';
import Home from './Pages/HomePage/Home'
import Minesweeper from './Pages/MinesweeperPage/Minesweeper';
import Chess from './Pages/Chess/Chess'

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FormLogin setOpen={setOpen} open={ open }/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/minesweeper" element={<Minesweeper />} />
        <Route path="/games/chess" element={<Chess />} />
      </Routes>
    </>
  );
}

export default App;
