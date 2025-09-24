import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { AppContext } from '../context/AppContext';

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

const BudgetInner = () => {
  const { backendUrl } = useContext(AppContext);
  const now = new Date();
  const [ym, setYm] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [items, setItems] = useState([]); // budgets
  const [categories, setCategories] = useState(['__overall__']);
  const [form, setForm] = useState({ category: '__overall__', amount: '' });

  const loadBudgets = async () => {
    const { data } = await axios.get(`${backendUrl}/api/budgets`, { params: ym });
    if (data.success) setItems(data.items);
  };
  const loadCategories = async () => {
    const { data } = await axios.get(`${backendUrl}/api/transactions/categories`);
    if (data.success) setCategories(['__overall__', ...data.categories]);
  };

  useEffect(() => { loadBudgets(); loadCategories(); }, []);
  useEffect(() => { loadBudgets(); }, [ym.year, ym.month]);

  const saveBudget = async (e) => {
    e.preventDefault();
    const payload = { ...ym, category: form.category, amount: Number(form.amount) };
    const { data } = await axios.post(`${backendUrl}/api/budgets`, payload);
    if (data.success) { setForm({ category: '__overall__', amount: '' }); loadBudgets(); }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] w-full bg-gradient-to-br from-[#0f0b1a] via-[#171129] to-[#1e163b]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Budgets</h1>
          <div className="text-white/80"><MonthPicker year={ym.year} month={ym.month} onChange={setYm} /></div>
        </div>

        <div className="p-5 border border-[#3a2b5b] rounded-xl bg-[#20173a]/80 mb-6">
          <h2 className="font-semibold mb-3 text-white">Set Budget</h2>
          <form onSubmit={saveBudget} className="flex flex-wrap gap-3 items-end text-white">
            <select className="border rounded p-2 bg-white text-black" value={form.category} onChange={e=>setForm(f=>({...f, category: e.target.value}))}>
              {categories.map(c => <option className="text-black" key={c} value={c}>{c === '__overall__' ? 'Overall' : c}</option>)}
            </select>
            <input className="border rounded p-2 bg-white/10 text-white placeholder-white/60" type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({...f, amount: e.target.value}))} required />
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white" type="submit">Save</button>
          </form>
        </div>

        <div className="overflow-x-auto border border-[#3a2b5b] rounded-xl bg-[#20173a]/80">
          <table className="min-w-full text-white">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map(b => (
                <tr key={b._id}>
                  <td className="p-3 text-white/90">{b.category === '__overall__' ? 'Overall' : b.category}</td>
                  <td className="p-3 text-emerald-300">₹ {b.amount.toLocaleString()}</td>
                  <td className="p-3 text-white/70">{new Date(b.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="p-4 text-white/60" colSpan={3}>No budgets yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Budget = () => (
  <ProtectedRoute>
    <BudgetInner />
  </ProtectedRoute>
);

export default Budget;
