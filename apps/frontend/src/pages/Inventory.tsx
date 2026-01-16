import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Inventory() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch('/inventory/vehicles'),
      apiFetch('/inventory/categories')
    ])
      .then(([v, c]) => {
        setVehicles(v);
        setCategories(c);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load inventory data');
        setLoading(false);
      });
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'badge badge-available';
      case 'RENTED': return 'badge badge-rented';
      case 'MAINTENANCE': return 'badge badge-maintenance';
      default: return 'badge';
    }
  };

  const filteredVehicles = filterStatus === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.status === filterStatus);

  const vehicleStats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'AVAILABLE').length,
    rented: vehicles.filter(v => v.status === 'RENTED').length,
    maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
  };

  if (loading) {
    return (
      <div className="section">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="section"><div className="error">{error}</div></div>;
  }

  return (
    <div>
      <div className="section">
        <h2>📊 Fleet Statistics</h2>
        <div className="grid grid-2" style={{ gap: '16px' }}>
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{vehicleStats.total}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total Vehicles</div>
          </div>
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{vehicleStats.available}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Available</div>
          </div>
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{vehicleStats.rented}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Currently Rented</div>
          </div>
          <div style={{ 
            padding: '20px', 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{vehicleStats.maintenance}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>In Maintenance</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ marginBottom: 0 }}>🚗 Fleet Overview</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ margin: 0, fontWeight: '600' }}>Filter:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="all">All Vehicles</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
        
        {filteredVehicles.length === 0 ? (
          <div className="info">No vehicles found matching the selected filter.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Year</th>
                <th>Color</th>
                <th>Seats</th>
                <th>Mileage</th>
                <th>Status</th>
                <th>Daily Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: '700', fontFamily: 'monospace' }}>{v.plate}</td>
                  <td><strong>{v.make} {v.model}</strong></td>
                  <td>{v.year}</td>
                  <td>{v.color}</td>
                  <td>{v.seats}</td>
                  <td>{v.mileage.toLocaleString()} km</td>
                  <td>
                    <span className={getStatusBadgeClass(v.status)}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: '#0369a1' }}>${Number(v.dailyRate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="section">
        <h2>📁 Vehicle Categories</h2>
        {categories.length === 0 ? (
          <div className="info">No categories configured.</div>
        ) : (
          <div className="grid grid-2">
            {categories.map((c) => (
              <div key={c.id} style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px',
                border: '2px solid #bae6fd'
              }}>
                <h3 style={{ marginBottom: '8px', color: '#0369a1' }}>{c.name}</h3>
                {c.description && (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px' }}>
                    {c.description}
                  </p>
                )}
                {c.baseDailyRate && (
                  <div style={{ 
                    fontWeight: '700', 
                    color: '#0369a1',
                    fontSize: '1.1rem'
                  }}>
                    Base Rate: ${Number(c.baseDailyRate).toFixed(2)}/day
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
