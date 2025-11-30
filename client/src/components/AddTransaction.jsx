import React, { useState } from 'react';
import API from '../api';

export default function AddTransaction({ onAdded }) {
  const [form,setForm] = useState({ amount:'', category:'', note:'', type:'expense' });

  async function submit(e){
    e.preventDefault();
    try{
      await API.post('/transactions', { ...form, amount: Number(form.amount) });
      setForm({ amount:'', category:'', note:'', type:'expense' });
      onAdded && onAdded();
    }catch(e){
      alert('Error adding transaction');
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 pastel-card">
      <h3 className="font-semibold mb-2">Add Transaction</h3>
      <form onSubmit={submit}>
        <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Amount" className="w-full p-2 mb-2 border rounded-md"/>
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category (e.g., Food)" className="w-full p-2 mb-2 border rounded-md"/>
        <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Note (optional)" className="w-full p-2 mb-2 border rounded-md"/>
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full p-2 mb-2 border rounded-md">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button className="w-full py-2 rounded-full bg-green-100 hover:bg-green-200">Add</button>
      </form>
    </div>
  );
}
