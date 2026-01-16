import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Rental() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [insurance, setInsurance] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quoting, setQuoting] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: number }>({});
  const [form, setForm] = useState({
    vehicleId: '',
    insurancePlanId: '',
    startAt: '',
    endAt: '',
    pickupAt: '',
    returnAt: '',
    payFullUpfront: false
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch('/inventory/vehicles'),
      apiFetch('/inventory/insurance-plans'),
      apiFetch('/inventory/addons')
    ])
      .then(([v, i, a]) => {
        setVehicles(v.filter((vehicle: any) => vehicle.status === 'AVAILABLE'));
        setInsurance(i.filter((plan: any) => plan.active));
        setAddons(a.filter((addon: any) => addon.active));
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      });
  }, []);

  const validateForm = () => {
    if (!form.vehicleId) return 'Please select a vehicle';
    if (!form.insurancePlanId) return 'Please select an insurance plan';
    if (!form.startAt) return 'Please select a start date';
    if (!form.endAt) return 'Please select an end date';
    if (!form.pickupAt) return 'Please select a pickup date/time';
    if (!form.returnAt) return 'Please select a return date/time';
    
    const start = new Date(form.startAt);
    const end = new Date(form.endAt);
    if (end <= start) return 'End date must be after start date';
    
    return null;
  };

  const handleQuote = async () => {
    setError('');
    setQuote(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setQuoting(true);
    try {
      const selectedAddonList = Object.entries(selectedAddons)
        .filter(([_, quantity]) => quantity > 0)
        .map(([addonId, quantity]) => ({ addonId, quantity }));

      const payload = {
        ...form,
        drivers: [
          {
            name: 'Demo Driver',
            licenseNo: 'S1234567A',
            licenseIssuedAt: '2021-01-01',
            dob: '1995-01-01'
          }
        ],
        addons: selectedAddonList
      };
      const data = await apiFetch('/rental/quote', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setQuote(data);
    } catch (err) {
      setQuote(null);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setQuoting(false);
    }
  };

  const handleAddonChange = (addonId: string, quantity: number) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: Math.max(0, quantity)
    }));
  };

  const selectedVehicle = vehicles.find(v => v.id === form.vehicleId);
  const selectedInsurance = insurance.find(i => i.id === form.insurancePlanId);

  if (loading) {
    return (
      <div className="section">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading rental options...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section">
        <h2>🚗 Create Rental Quote</h2>
        
        <div className="grid grid-2" style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label>Vehicle *</label>
            <select 
              value={form.vehicleId} 
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            >
              <option value="">-- Select a vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year} ({v.plate}) - ${v.dailyRate}/day
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <div className="info" style={{ marginTop: '8px', padding: '10px' }}>
                <strong>{selectedVehicle.make} {selectedVehicle.model}</strong><br />
                {selectedVehicle.seats} seats • {selectedVehicle.color} • Daily rate: ${selectedVehicle.dailyRate}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Insurance Plan *</label>
            <select
              value={form.insurancePlanId}
              onChange={(e) => setForm({ ...form, insurancePlanId: e.target.value })}
            >
              <option value="">-- Select insurance --</option>
              {insurance.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ${p.pricePerDay}/day
                </option>
              ))}
            </select>
            {selectedInsurance && (
              <div className="info" style={{ marginTop: '8px', padding: '10px' }}>
                <strong>{selectedInsurance.name}</strong><br />
                {selectedInsurance.unlimitedKm && '✓ Unlimited KM '}
                {selectedInsurance.includesCdw && '✓ CDW '}
                {selectedInsurance.includesChips && '✓ Chips & Windscreen'}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input 
              type="date" 
              value={form.startAt} 
              onChange={(e) => setForm({ ...form, startAt: e.target.value })} 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input 
              type="date" 
              value={form.endAt} 
              onChange={(e) => setForm({ ...form, endAt: e.target.value })} 
              min={form.startAt || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Pickup Date & Time *</label>
            <input 
              type="datetime-local" 
              value={form.pickupAt} 
              onChange={(e) => setForm({ ...form, pickupAt: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label>Return Date & Time *</label>
            <input 
              type="datetime-local" 
              value={form.returnAt} 
              onChange={(e) => setForm({ ...form, returnAt: e.target.value })} 
            />
          </div>
        </div>

        {addons.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3>Add-ons (Optional)</h3>
            <div className="grid grid-2">
              {addons.map((addon) => (
                <div key={addon.id} style={{ 
                  padding: '16px', 
                  background: '#f9fafb', 
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    {addon.name} - ${addon.pricePerRental}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ margin: 0, flex: 1 }}>Quantity:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={selectedAddons[addon.id] || 0}
                      onChange={(e) => handleAddonChange(addon.id, parseInt(e.target.value) || 0)}
                      style={{ width: '80px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="payFullUpfront"
            checked={form.payFullUpfront}
            onChange={(e) => setForm({ ...form, payFullUpfront: e.target.checked })}
          />
          <label htmlFor="payFullUpfront" style={{ margin: 0 }}>
            Pay in full upfront (Get 2% discount!)
          </label>
        </div>

        <button onClick={handleQuote} disabled={quoting}>
          {quoting && <span className="loading"></span>}
          {quoting ? 'Calculating...' : 'Generate Quote'}
        </button>
        
        {error && <div className="error">{error}</div>}
      </div>

      {quote && (
        <div className="section quote-summary">
          <h3>📊 Quote Summary</h3>
          <div>
            <p>
              <span>Rental Duration:</span>
              <strong>{quote.days} day{quote.days > 1 ? 's' : ''}</strong>
            </p>
            <p>
              <span>Base Rate:</span>
              <strong>${Number(quote.base).toFixed(2)}</strong>
            </p>
            <p>
              <span>Insurance:</span>
              <strong>${Number(quote.insuranceTotal).toFixed(2)}</strong>
            </p>
            {quote.addonTotal > 0 && (
              <p>
                <span>Add-ons:</span>
                <strong>${Number(quote.addonTotal).toFixed(2)}</strong>
              </p>
            )}
            {quote.extraDriverFee > 0 && (
              <p>
                <span>Extra Driver Fee:</span>
                <strong>${Number(quote.extraDriverFee).toFixed(2)}</strong>
              </p>
            )}
            <p>
              <span>Deposit Required:</span>
              <strong>${Number(quote.deposit).toFixed(2)}</strong>
            </p>
            {form.payFullUpfront && (
              <p style={{ color: '#16a34a' }}>
                <span>Discount Applied (2%):</span>
                <strong>-${(quote.base + quote.insuranceTotal + quote.addonTotal + quote.extraDriverFee - quote.total).toFixed(2)}</strong>
              </p>
            )}
            <p style={{ 
              borderTop: '2px solid #0369a1', 
              paddingTop: '16px', 
              marginTop: '16px',
              fontSize: '1.25rem'
            }}>
              <span>Total Amount:</span>
              <strong style={{ color: '#0369a1' }}>${Number(quote.total).toFixed(2)}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
