import { Link, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Rental from './pages/Rental';
import Inventory from './pages/Inventory';
import InOut from './pages/InOut';

export default function App() {
  return (
    <div>
      <header>
        <h1>Rent Car Processing System</h1>
        <nav>
          <Link to="/">Login</Link>
          <Link to="/rental">Rental</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/inout">In & Out</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rental" element={<Rental />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inout" element={<InOut />} />
        </Routes>
      </main>
    </div>
  );
}
