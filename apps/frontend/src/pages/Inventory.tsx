import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Inventory() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/inventory/vehicles').then(setVehicles).catch(() => {});
    apiFetch('/inventory/categories').then(setCategories).catch(() => {});
  }, []);

  return (
    <div>
      <div className="section">
        <h2>Fleet Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Plate</th>
              <th>Model</th>
              <th>Status</th>
              <th>Daily Rate</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.plate}</td>
                <td>{v.make} {v.model}</td>
                <td>{v.status}</td>
                <td>${v.dailyRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section">
        <h2>Categories</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
