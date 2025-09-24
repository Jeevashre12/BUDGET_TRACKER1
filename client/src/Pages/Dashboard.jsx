import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import ProtectedRoute from '../components/ProtectedRoute';

const MonthPicker = ({ year, month, onChange }) => {
  const onPrev = () => {
    const d = new Date(year, month - 2, 1);
    onChange({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };
  const onNext = () => {
    const d = new Date(year, month, 1);
    onChange({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };
  const label = useMemo(() => new Date(year, month - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' }), [year, month]);
  return (
    <div className="flex items-center gap-3">
      <button className="px-3 py-1 border rounded" onClick={onPrev}>◀</button>
      <div className="font-medium">{label}</div>
      <button className="px-3 py-1 border rounded" onClick={onNext}>▶</button>
    </div>
  );
};

const DashboardInner = () => {
  const { backendUrl } = useContext(AppContext);
  const now = new Date();
  const [ym, setYm] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/finance/monthly`, { params: ym });
      setData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ym.year, ym.month]);

  const income = data?.income || 0;
  const expenses = data?.expenses || 0;
  const net = data?.net || 0;
  const budgetProgress = data?.budgetProgress || [];
  const recent = data?.recent || [];

  return (
    <div className="min-h-[calc(100vh-130px)] w-full bg-gradient-to-br from-[#0f0b1a] via-[#171129] to-[#1e163b]">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <div className="text-white/80">
            <MonthPicker year={ym.year} month={ym.month} onChange={setYm} />
          </div>
        </div>

        {loading && <div className="text-white/80">Loading...</div>}

        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-xl border border-[#3a2b5b] bg-[#23183e]/80 shadow-[0_10px_25px_-10px_rgba(124,58,237,0.35)]">
                <div className="text-sm text-white/60">Total Income</div>
                <div className="text-2xl font-bold text-emerald-400">₹ {income.toLocaleString()}</div>
              </div>
              <div className="p-5 rounded-xl border border-[#3a2b5b] bg-[#23183e]/80 shadow-[0_10px_25px_-10px_rgba(168,85,247,0.35)]">
                <div className="text-sm text-white/60">Total Expenses</div>
                <div className="text-2xl font-bold text-rose-400">₹ {expenses.toLocaleString()}</div>
              </div>
              <div className="p-5 rounded-xl border border-[#3a2b5b] bg-[#23183e]/80 shadow-[0_10px_25px_-10px_rgba(59,130,246,0.25)]">
                <div className="text-sm text-white/60">Net Balance</div>
                <div className={`text-2xl font-bold ${net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>₹ {net.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-5 rounded-xl border border-[#3a2b5b] bg-[#20173a]/80">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-white">Recent Transactions</h2>
                  <a className="text-sm bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-3 py-1 rounded-full hover:opacity-90 transition" href="/transactions">View all</a>
                </div>
                <ul className="divide-y divide-white/10">
                  {recent.map(tx => (
                    <li key={tx._id} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          {tx.category} <span className="text-xs text-white/50">{new Date(tx.date).toLocaleDateString()}</span>
                        </div>
                        {tx.note ? <div className="text-sm text-white/60">{tx.note}</div> : null}
                      </div>
                      <div className={tx.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}>
                        {tx.type === 'income' ? '+' : '-'}₹ {tx.amount.toLocaleString()}
                      </div>
                    </li>
                  ))}
                  {recent.length === 0 && <li className="py-4 text-white/60">No transactions yet.</li>}
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-[#3a2b5b] bg-[#20173a]/80">
                <h2 className="font-semibold mb-3 text-white">Budget Progress</h2>
                <ul className="space-y-3">
                  {budgetProgress.map((b, idx) => (
                    <li key={idx}>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-white/90">{b.category === '__overall__' ? 'Overall' : b.category}</div>
                        <div className="text-white/60">₹ {b.spent.toLocaleString()} / ₹ {b.budget.toLocaleString()}</div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded mt-1 overflow-hidden">
                        <div className={`h-2 rounded bg-gradient-to-r ${b.percent >= 90 ? 'from-rose-500 to-rose-400' : b.percent >= 70 ? 'from-amber-500 to-amber-400' : 'from-[#7c3aed] to-[#a855f7]'}`} style={{ width: `${b.percent}%` }} />
                      </div>
                    </li>
                  ))}
                  {budgetProgress.length === 0 && <li className="text-white/60">No budgets set for this month.</li>}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => (
  <ProtectedRoute>
    <DashboardInner />
  </ProtectedRoute>
);

export default Dashboard;
