import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function InOut() {
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/inout/returns').then(setReturns).catch(() => {});
  }, []);

  return (
    <div className="section">
      <h2>Return Process Tracker</h2>
      <table>
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Booking</th>
            <th>Stage</th>
            <th>Returned At</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.bookingId}</td>
              <td>{r.stage}</td>
              <td>{new Date(r.returnedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
