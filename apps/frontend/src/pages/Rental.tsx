import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Rental() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [insurance, setInsurance] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState('');
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
    Promise.all([
      apiFetch('/inventory/vehicles'),
      apiFetch('/inventory/insurance-plans'),
      apiFetch('/inventory/addons')
    ])
      .then(([v, i, a]) => {
        setVehicles(v);
        setInsurance(i);
        setAddons(a);
      })
      .catch(() => {});
  }, []);

  const handleQuote = async () => {
    setError('');
    if (!form.vehicleId || !form.insurancePlanId || !form.startAt || !form.endAt) {
      setError('Select a vehicle, insurance plan, start date, and end date.');
      return;
    }
    try {
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
        addons: addons.slice(0, 1).map((a) => ({ addonId: a.id, quantity: 1 }))
      };
      const data = await apiFetch('/rental/quote', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setQuote(data);
    } catch (err) {
      setQuote(null);
      setError(String(err));
    }
  };

  return (
    <div>
      <div className="section">
        <h2>Rental Quote</h2>
        <div className="grid grid-2">
          <div>
            <label>Vehicle</label>
            <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">Select</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.plate})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Insurance Plan</label>
            <select
              value={form.insurancePlanId}
              onChange={(e) => setForm({ ...form, insurancePlanId: e.target.value })}
            >
              <option value="">Select</option>
              {insurance.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Start Date</label>
            <input type="date" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </div>
          <div>
            <label>Pickup Date</label>
            <input type="date" value={form.pickupAt} onChange={(e) => setForm({ ...form, pickupAt: e.target.value })} />
          </div>
          <div>
            <label>Return Date</label>
            <input type="date" value={form.returnAt} onChange={(e) => setForm({ ...form, returnAt: e.target.value })} />
          </div>
        </div>
        <button onClick={handleQuote}>Generate Quote</button>
        {error && <p>{error}</p>}
      </div>
      {quote && (
        <div className="section">
          <h3>Quote Summary</h3>
          <p>Days: {quote.days}</p>
          <p>Base: ${quote.base}</p>
          <p>Insurance: ${quote.insuranceTotal}</p>
          <p>Addons: ${quote.addonTotal}</p>
          <p>Extra Drivers: ${quote.extraDriverFee}</p>
          <p>Deposit: ${quote.deposit}</p>
          <strong>Total: ${quote.total}</strong>
        </div>
      )}
    </div>
  );
}
