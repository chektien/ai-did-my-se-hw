import { useState } from 'react';
import { apiFetch } from '../api';

export default function Login() {
  const [email, setEmail] = useState('staff@rcps.dev');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      setMessage('Logged in. Navigate to modules.');
    } catch (err) {
      setMessage(String(err));
    }
  };

  return (
    <div className="section">
      <h2>Staff / Customer Login</h2>
      <div className="grid grid-2">
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
}
