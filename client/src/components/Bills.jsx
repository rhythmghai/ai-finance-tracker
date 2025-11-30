import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Bills(){
  const [list,setList] = useState([]);
  const [form,setForm] = useState({ name:'', amount:0 });

  async function load(){ const res = await API.get('/bills'); setList(res.data); }
  async function add(e){ e.preventDefault(); await API.post('/bills', form); setForm({ name:'', amount:0 }); load(); }
  useEffect(()=>{ load(); },[]);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 pastel-card">
      <h3 className="font-semibold mb-2">Bills</h3>
      <form onSubmit={add}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Bill name" className="w-full p-2 mb-2 border rounded-md"/>
        <input value={form.amount} onChange={e=>setForm({...form,amount:Number(e.target.value)})} placeholder="Amount" className="w-full p-2 mb-2 border rounded-md"/>
        <button className="w-full py-2 rounded-full bg-red-100 hover:bg-red-200">Add</button>
      </form>
      <div className="mt-3">
        {list.map(b=> <div key={b._id} className="mt-2 text-sm text-gray-600">{b.name} — ₹{b.amount}</div>)}
      </div>
    </div>
  );
}
