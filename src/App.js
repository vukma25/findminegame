import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import FormLogin from './Components/FormLogin/FormLogin';
import Home from './Pages/HomePage/Home'
import Minesweeper from './Pages/MinesweeperPage/Minesweeper';
import Chess from './Pages/Chess/Chess'
import Sudoku from './Pages/Sudoku/Sudoku'
import Caro from './Pages/Caro/Caro'
import FastFinger from './Pages/FastFinger/FastFinger'
import Memory from './Pages/Memory/Memory';
import Wordle from './Pages/Wordle/Wordle'
import Snake from './Pages/Snake/Snake'

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
        <Route path="/games/sudoku" element={<Sudoku />} />
        <Route path="/games/caro" element={<Caro />} />
        <Route path="/games/fastfinger" element={<FastFinger />} />
        <Route path="/games/memorygame" element={<Memory />} />
        <Route path="/games/wordle" element={<Wordle />} />
        <Route path="/games/snakegame" element={<Snake />} />
      </Routes>
    </>
  );
}

export default App;
