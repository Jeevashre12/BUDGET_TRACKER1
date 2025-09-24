import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { AppContext } from '../context/AppContext';

const ReportsInner = () => {
  const { backendUrl } = useContext(AppContext);
  const now = new Date();
  const [ym, setYm] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [data, setData] = useState(null);

  const load = async () => {
    const { data } = await axios.get(`${backendUrl}/api/finance/monthly`, { params: ym });
    setData(data);
  };

  useEffect(() => { load(); }, [ym.year, ym.month]);

  const byCategory = data?.byCategory || {};

  return (
    <div className="min-h-[calc(100vh-130px)] w-full bg-gradient-to-br from-[#0f0b1a] via-[#171129] to-[#1e163b]">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <div className="flex gap-2 items-center">
            <select className="border rounded p-2 bg-white text-black" value={ym.month} onChange={e=>setYm(m=>({...m, month: Number(e.target.value)}))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option className="text-black" key={m} value={m}>{new Date(2000, m-1, 1).toLocaleString(undefined, { month: 'long' })}</option>
              ))}
            </select>
            <input className="border rounded p-2 w-28 bg-white/10 text-white" type="number" value={ym.year} onChange={e=>setYm(m=>({...m, year: Number(e.target.value)}))} />
          </div>
        </div>

        {!data && <div className="text-white/80">Loading...</div>}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 border border-[#3a2b5b] rounded-xl bg-[#20173a]/80">
              <h2 className="font-semibold mb-3 text-white">Category Breakdown (Expense)</h2>
              <ul className="space-y-2">
                {Object.entries(byCategory).map(([cat, v]) => (
                  <li key={cat} className="flex items-center justify-between">
                    <div className="text-white/90">{cat}</div>
                    <div className="text-rose-300">₹ {(v.expense || 0).toLocaleString()}</div>
                  </li>
                ))}
                {Object.keys(byCategory).length === 0 && <li className="text-white/60">No data.</li>}
              </ul>
            </div>

            <div className="p-5 border border-[#3a2b5b] rounded-xl bg-[#20173a]/80">
              <h2 className="font-semibold mb-3 text-white">Summary</h2>
              <div className="text-sm text-white/70 mb-2">Income</div>
              <div className="text-emerald-300 text-xl font-semibold mb-4">₹ {data.income.toLocaleString()}</div>
              <div className="text-sm text-white/70 mb-2">Expenses</div>
              <div className="text-rose-300 text-xl font-semibold mb-4">₹ {data.expenses.toLocaleString()}</div>
              <div className="text-sm text-white/70 mb-2">Net</div>
              <div className={`text-xl font-semibold ${data.net>=0?'text-emerald-300':'text-rose-300'}`}>₹ {data.net.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Reports = () => (
  <ProtectedRoute>
    <ReportsInner />
  </ProtectedRoute>
);

export default Reports;
