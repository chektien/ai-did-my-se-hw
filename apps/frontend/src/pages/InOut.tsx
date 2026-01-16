import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function InOut() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    apiFetch('/inout/returns')
      .then((data) => {
        setReturns(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load return processes');
        setLoading(false);
      });
  }, []);

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      INSPECTION: '#3b82f6',
      REPAIR: '#f59e0b',
      SERVICE: '#8b5cf6',
      CLEANING: '#06b6d4',
      VALUATION: '#ec4899',
      COMPLETE: '#10b981',
    };
    return colors[stage] || '#6b7280';
  };

  const getStageBadge = (stage: string) => {
    const color = getStageColor(stage);
    return (
      <span style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'white',
        backgroundColor: color,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {stage}
      </span>
    );
  };

  const filteredReturns = filterStage === 'all'
    ? returns
    : returns.filter(r => r.stage === filterStage);

  const stageStats = {
    total: returns.length,
    inspection: returns.filter(r => r.stage === 'INSPECTION').length,
    repair: returns.filter(r => r.stage === 'REPAIR').length,
    service: returns.filter(r => r.stage === 'SERVICE').length,
    cleaning: returns.filter(r => r.stage === 'CLEANING').length,
    valuation: returns.filter(r => r.stage === 'VALUATION').length,
    complete: returns.filter(r => r.stage === 'COMPLETE').length,
  };

  if (loading) {
    return (
      <div className="section">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading return processes...</p>
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
        <h2>📊 Return Process Statistics</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ 
            padding: '16px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stageStats.total}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Total Returns</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: getStageColor('INSPECTION'), 
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stageStats.inspection}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Inspection</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: getStageColor('REPAIR'), 
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stageStats.repair}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Repair</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: getStageColor('SERVICE'), 
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stageStats.service}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Service</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: getStageColor('CLEANING'), 
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stageStats.cleaning}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Cleaning</div>
          </div>
          <div style={{ 
            padding: '16px', 
            background: getStageColor('COMPLETE'), 
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stageStats.complete}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Complete</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ marginBottom: 0 }}>🔄 Return Process Tracker</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ margin: 0, fontWeight: '600' }}>Filter by Stage:</label>
            <select 
              value={filterStage} 
              onChange={(e) => setFilterStage(e.target.value)}
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="all">All Stages</option>
              <option value="INSPECTION">Inspection</option>
              <option value="REPAIR">Repair</option>
              <option value="SERVICE">Service</option>
              <option value="CLEANING">Cleaning</option>
              <option value="VALUATION">Valuation</option>
              <option value="COMPLETE">Complete</option>
            </select>
          </div>
        </div>

        {filteredReturns.length === 0 ? (
          <div className="info">No return processes found matching the selected filter.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Booking</th>
                <th>Current Stage</th>
                <th>Returned At</th>
                <th>Mileage In</th>
                <th>Fuel Level</th>
                <th>Late Fee</th>
                <th>Charges</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {r.id.substring(0, 8)}...
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {r.bookingId.substring(0, 8)}...
                  </td>
                  <td>{getStageBadge(r.stage)}</td>
                  <td>{new Date(r.returnedAt).toLocaleString()}</td>
                  <td>{r.mileageIn.toLocaleString()} km</td>
                  <td>{r.fuelLevelIn}</td>
                  <td style={{ 
                    fontWeight: '700', 
                    color: Number(r.lateFee) > 0 ? '#dc2626' : '#6b7280' 
                  }}>
                    ${Number(r.lateFee).toFixed(2)}
                  </td>
                  <td style={{ fontWeight: '600', color: '#0369a1' }}>
                    ${(Number(r.fuelCharge) + Number(r.overageCharge)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredReturns.length > 0 && (
        <div className="section">
          <h3>💡 Process Flow</h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            alignItems: 'center',
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '10px'
          }}>
            {['INSPECTION', 'REPAIR', 'SERVICE', 'CLEANING', 'VALUATION', 'COMPLETE'].map((stage, idx) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getStageBadge(stage)}
                {idx < 5 && <span style={{ fontSize: '1.5rem', color: '#cbd5e1' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
