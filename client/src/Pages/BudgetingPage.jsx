import React, { useMemo, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';

const categories = ['Food', 'Transport', 'Entertainment', 'Other'];

function getCurrentMonthValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

const BudgetingPage = () => {
  const { backendUrl } = useContext(AppContext);

  const [budgetItems, setBudgetItems] = useState([]);
  const [spendItems, setSpendItems] = useState([]);
  const [salaryByMonth, setSalaryByMonth] = useState({});

  const [form, setForm] = useState({ category: categories[0], amount: '', month: getCurrentMonthValue() });
  const [spendForm, setSpendForm] = useState({ category: categories[0], amount: '', date: new Date().toISOString().slice(0, 10) });
  const [salaryForm, setSalaryForm] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const month = form.month;
    const [y, m] = month.split('-').map(Number);
    const start = new Date(y, m - 1, 1).toISOString();
    const end = new Date(y, m, 0, 23, 59, 59, 999).toISOString();

    const load = async () => {
      try {
        const [budRes, txRes, salRes] = await Promise.all([
          axios.get(`${backendUrl}/api/budgets`, { params: { month }, signal: controller.signal }),
          axios.get(`${backendUrl}/api/transactions`, { params: { start, end }, signal: controller.signal }),
          axios.get(`${backendUrl}/api/salary`, { params: { month }, signal: controller.signal }),
        ]);
        setBudgetItems(budRes.data?.budgets || []);
        setSpendItems((txRes.data?.transactions || []).map((t) => ({ ...t, month: (t.date || '').slice(0,7) })));
        const salaryValue = Number(salRes.data?.salary || 0);
        setSalaryByMonth((prev) => ({ ...prev, [month]: salaryValue }));
        setSalaryForm(String(salaryValue || ''));
      } catch (e) {
        if (e?.name !== 'CanceledError') console.error(e);
      }
    };
    load();
    return () => controller.abort();
  }, [backendUrl, form.month]);

  const onSaveBudget = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/budgets`, {
        month: form.month,
        category: form.category,
        budget: Number(form.amount),
      });
      if (data?.budget) {
        setBudgetItems((prev) => {
          const idx = prev.findIndex((b) => b.category === data.budget.category && b.month === data.budget.month);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = data.budget;
            return copy;
          }
          return [data.budget, ...prev];
        });
      }
    } catch (e) {
      console.error(e);
    }
    setForm((f) => ({ ...f, amount: '' }));
  };

  const onAddSpend = async (e) => {
    e.preventDefault();
    if (!spendForm.amount || Number(spendForm.amount) <= 0 || !spendForm.date) return;
    const month = spendForm.date.slice(0, 7);
    try {
      const { data } = await axios.post(`${backendUrl}/api/transactions`, {
        category: spendForm.category,
        amount: Number(spendForm.amount),
        date: spendForm.date,
        type: 'actual',
      });
      if (data?.transaction) setSpendItems((prev) => [{ ...data.transaction, month }, ...prev]);
    } catch (e) {
      console.error(e);
    }
    setSpendForm((s) => ({ ...s, amount: '' }));
  };

  const onSaveSalary = async (e) => {
    e.preventDefault();
    if (salaryForm === '' || Number(salaryForm) < 0) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/salary`, { month: form.month, salary: Number(salaryForm) });
      if (data?.salary !== undefined) setSalaryByMonth((prev) => ({ ...prev, [form.month]: Number(data.salary) }));
    } catch (e) {
      console.error(e);
    }
  };

  const budgetsForMonth = useMemo(() => {
    const map = new Map();
    for (const c of categories) map.set(c, 0);
    for (const b of budgetItems) if (b.month === form.month) map.set(b.category, Number(b.budget || 0));
    return map;
  }, [budgetItems, form.month]);

  const spentForMonthByCategory = useMemo(() => {
    const map = new Map();
    for (const c of categories) map.set(c, 0);
    for (const s of spendItems) if (s.month === form.month) map.set(s.category, Number(map.get(s.category) || 0) + Number(s.amount || 0));
    return map;
  }, [spendItems, form.month]);

  const rows = useMemo(() => categories.map((category) => {
    const budget = Number(budgetsForMonth.get(category) || 0);
    const spent = Number(spentForMonthByCategory.get(category) || 0);
    const remaining = Math.max(0, budget - spent);
    const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : (spent > 0 ? 100 : 0);
    return { id: `${form.month}-${category}`, category, budget, spent, remaining, pct };
  }), [budgetsForMonth, spentForMonthByCategory, form.month]);

  const totalSpent = useMemo(() => rows.reduce((sum, r) => sum + r.spent, 0), [rows]);
  const salary = Number(salaryByMonth[form.month] || 0);
  const totalSaved = Math.max(0, salary - totalSpent);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0b0f] px-4 py-10">
      <div className="w-full max-w-4xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl p-6 text-white">
        <h1 className="text-2xl font-semibold mb-4">Budgeting</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#171722] border border-white/10 rounded-xl p-4">
            <div className="text-white/60 text-xs">Salary</div>
            <div className="text-2xl font-semibold mt-1">₹{salary.toFixed(2)}</div>
          </div>
          <div className="bg-[#171722] border border-white/10 rounded-xl p-4">
            <div className="text-white/60 text-xs">Total Spent</div>
            <div className="text-2xl font-semibold mt-1">₹{totalSpent.toFixed(2)}</div>
          </div>
          <div className="bg-[#171722] border border-white/10 rounded-xl p-4">
            <div className="text-white/60 text-xs">Total Saved</div>
            <div className="text-2xl font-semibold mt-1">₹{totalSaved.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#171722] border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Monthly Salary</label>
            <input type="number" min="0" step="0.01" placeholder="e.g. 6000" value={salaryForm} onChange={(e) => setSalaryForm(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Month</label>
            <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex items-end"><button onClick={onSaveSalary} className="w-full md:w-auto px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors font-semibold shadow-lg">Save Salary</button></div>
        </div>

        <form onSubmit={onSaveBudget} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#171722] border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500">
              {categories.map((c) => (<option key={c} value={c} className="bg-[#0f0f17]">{c}</option>))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Budget</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Month</label>
            <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex items-end"><button type="submit" className="w-full md:w-auto px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors font-semibold shadow-lg">Save Budget</button></div>
        </form>

        <form onSubmit={onAddSpend} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#171722] border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Category</label>
            <select value={spendForm.category} onChange={(e) => setSpendForm({ ...spendForm, category: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500">
              {categories.map((c) => (<option key={c} value={c} className="bg-[#0f0f17]">{c}</option>))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Date</label>
            <input type="date" value={spendForm.date} onChange={(e) => setSpendForm({ ...spendForm, date: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-white/70">Amount</label>
            <input type="number" min="0" step="0.01" value={spendForm.amount} onChange={(e) => setSpendForm({ ...spendForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex items-end"><button type="submit" className="w-full md:w-auto px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors font-semibold shadow-lg">Add Expense</button></div>
        </form>

        <div className="bg-[#171722] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current Budgets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-white/60">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Spent</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{r.category}</td>
                    <td className="px-4 py-3 text-white">₹{r.budget.toFixed(2)}</td>
                    <td className="px-4 py-3 text-white">₹{r.spent.toFixed(2)}</td>
                    <td className="px-4 py-3 text-white">₹{r.remaining.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {r.spent > r.budget && r.budget > 0 ? (
                        <span className="inline-flex items-center gap-2 text-red-300">Overspent</span>
                      ) : r.spent > 0 && r.budget === 0 ? (
                        <span className="inline-flex items-center gap-2 text-red-300">Overspent</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-emerald-300">Within budget</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-semibold"
                        onClick={() => setForm({ ...form, category: r.category, amount: String(r.budget) })}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-semibold"
                        onClick={async () => {
                          try {
                            await axios.delete(`${backendUrl}/api/budgets`, { params: { month: form.month, category: r.category } });
                            setBudgetItems((prev) => prev.filter((b) => !(b.month === form.month && b.category === r.category)));
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetingPage;


