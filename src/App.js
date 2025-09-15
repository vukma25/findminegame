import { Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';

function App() {


  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
