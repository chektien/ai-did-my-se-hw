import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Rental from './pages/Rental';
import Inventory from './pages/Inventory';
import InOut from './pages/InOut';

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'active' : '';
  
  return (
    <header>
      <h1>🚗 RCPS - Rent Car Processing System</h1>
      <nav>
        <Link to="/rental" className={isActive('/rental')}>Rental</Link>
        <Link to="/inventory" className={isActive('/inventory')}>Inventory</Link>
        <Link to="/inout" className={isActive('/inout')}>In/Out</Link>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div>
      <Navigation />
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
