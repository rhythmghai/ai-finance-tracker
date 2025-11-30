import React, { useState } from 'react';
import API from '../api';

export default function Register(){
  const [form,setForm] = useState({ name:'', email:'', password:'', monthlyIncome:0, savingsGoal:0 });

  async function submit(e){
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered. Please login.');
      window.location.href = '/login';
    } catch (err) {
      alert('Error registering: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={submit} className="w-96 p-6 pastel-card rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Create account ✨</h1>
        <input required placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 mb-2 border rounded-md" />
        <input required type="email" placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-2 mb-2 border rounded-md" />
        <input required type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} className="w-full p-2 mb-2 border rounded-md" />
        <input type="number" placeholder="Monthly Income" onChange={e=>setForm({...form,monthlyIncome:Number(e.target.value)})} className="w-full p-2 mb-2 border rounded-md" />
        <input type="number" placeholder="Savings Goal (monthly)" onChange={e=>setForm({...form,savingsGoal:Number(e.target.value)})} className="w-full p-2 mb-2 border rounded-md" />
        <button className="w-full py-2 rounded-full bg-blue-100 hover:bg-blue-200">Register</button>
        <p className="mt-3 text-center text-sm text-gray-500">Have account? <a href="/login" className="text-blue-600">Login</a></p>
      </form>
    </div>
  );
}
