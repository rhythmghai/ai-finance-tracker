import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Subscriptions(){
  const [list,setList] = useState([]);
  const [form,setForm] = useState({ name:'', provider:'', monthlyCost:0 });

  async function load(){ const res = await API.get('/subscriptions'); setList(res.data); }
  async function add(e){ e.preventDefault(); await API.post('/subscriptions', form); setForm({ name:'', provider:'', monthlyCost:0 }); load(); }

  useEffect(()=>{ load(); },[]);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 pastel-card">
      <h3 className="font-semibold mb-2">Subscriptions</h3>
      <form onSubmit={add}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name e.g., Netflix" className="w-full p-2 mb-2 border rounded-md"/>
        <input value={form.provider} onChange={e=>setForm({...form,provider:e.target.value})} placeholder="Provider" className="w-full p-2 mb-2 border rounded-md"/>
        <input value={form.monthlyCost} onChange={e=>setForm({...form,monthlyCost:Number(e.target.value)})} placeholder="Monthly cost" className="w-full p-2 mb-2 border rounded-md"/>
        <button className="w-full py-2 rounded-full bg-purple-100 hover:bg-purple-200">Add</button>
      </form>
      <div className="mt-3">
        {list.map(s=> <div key={s._id} className="mt-2 text-sm text-gray-600">{s.name} — ₹{s.monthlyCost}</div>)}
      </div>
    </div>
  );
}
