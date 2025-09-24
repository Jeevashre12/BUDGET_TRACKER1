import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { AppContext } from '../context/AppContext';

const TxForm = ({ initial, onSubmit, onCancel, categories }) => {
  const [form, setForm] = useState(() => initial || { type: 'expense', amount: '', category: 'Food', note: '', date: new Date().toISOString().slice(0,10) });
  const submit = (e) => { e.preventDefault(); onSubmit({ ...form, amount: Number(form.amount) }); };
  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
      <select className="border rounded p-2 bg-white text-black" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
        <option className="text-black" value="income">Income</option>
        <option className="text-black" value="expense">Expense</option>
      </select>
      <input className="border rounded p-2 bg-white/10 text-white placeholder-white/60" type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
      <select className="border rounded p-2 bg-white text-black" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
        {categories.map(c=> <option className="text-black" key={c} value={c}>{c}</option>)}
      </select>
      <input className="border rounded p-2 bg-white/10 text-white" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
      <input className="border rounded p-2 md:col-span-5 bg-white/10 text-white placeholder-white/60" type="text" placeholder="Note (optional)" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} />
      <div className="flex gap-2 md:col-span-5">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Save</button>
        {onCancel && <button type="button" className="px-4 py-2 border rounded" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

const TransactionsInner = () => {
  const { backendUrl } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [cats, setCats] = useState(['Food','Transport','Salary']);

  const load = async () => {
    const { data } = await axios.get(`${backendUrl}/api/transactions`);
    if (data.success) setItems(data.items);
  };
  const loadCats = async () => {
    const { data } = await axios.get(`${backendUrl}/api/transactions/categories`);
    if (data.success) setCats(data.categories);
  };
  useEffect(() => { load(); loadCats(); }, []);

  const create = async (payload) => {
    const { data } = await axios.post(`${backendUrl}/api/transactions`, payload);
    if (data.success) { setEditing(null); load(); }
  };
  const update = async (payload) => {
    const { data } = await axios.put(`${backendUrl}/api/transactions/${editing._id}`, payload);
    if (data.success) { setEditing(null); load(); }
  };
  const remove = async (id) => {
    const ok = confirm('Delete this transaction?');
    if (!ok) return;
    const { data } = await axios.delete(`${backendUrl}/api/transactions/${id}`);
    if (data.success) load();
  };

  const totalIncome = useMemo(() => items.filter(i=>i.type==='income').reduce((s,i)=>s+i.amount,0), [items]);
  const totalExpense = useMemo(() => items.filter(i=>i.type==='expense').reduce((s,i)=>s+i.amount,0), [items]);

  return (
    <div className="min-h-[calc(100vh-130px)] w-full bg-gradient-to-br from-[#0f0b1a] via-[#171129] to-[#1e163b]">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-white">Transactions</h1>
        </div>

        <div className="mb-6 p-5 border border-[#3a2b5b] rounded-xl bg-[#20173a]/80">
          <h2 className="font-semibold mb-3 text-white">{editing ? 'Edit' : 'Add'} Transaction</h2>
          <div className="text-white">
            <TxForm initial={editing || undefined} onSubmit={editing ? update : create} onCancel={() => setEditing(null)} categories={cats} />
          </div>
        </div>

        <div className="mb-3 text-sm text-white/70">Income: ₹ {totalIncome.toLocaleString()} | Expenses: ₹ {totalExpense.toLocaleString()} | Net: ₹ {(totalIncome-totalExpense).toLocaleString()}</div>

        <div className="overflow-x-auto border border-[#3a2b5b] rounded-xl bg-[#20173a]/80">
          <table className="min-w-full text-white">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Note</th>
                <th className="p-3">Amount</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map(tx => (
                <tr key={tx._id}>
                  <td className="p-3 whitespace-nowrap text-white/90">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-3 capitalize text-white/90">{tx.type}</td>
                  <td className="p-3 text-white/90">{tx.category}</td>
                  <td className="p-3 text-white/70">{tx.note}</td>
                  <td className={`p-3 ${tx.type==='income'?'text-emerald-300':'text-rose-300'}`}>{tx.type==='income'?'+':'-'}₹ {tx.amount.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white mr-2" onClick={()=>setEditing(tx)}>Edit</button>
                    <button className="px-3 py-1 text-sm rounded-full bg-white/10 text-white hover:bg-white/20" onClick={()=>remove(tx._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="p-4 text-white/60" colSpan={6}>No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => (
  <ProtectedRoute>
    <TransactionsInner />
  </ProtectedRoute>
);

export default Transactions;
