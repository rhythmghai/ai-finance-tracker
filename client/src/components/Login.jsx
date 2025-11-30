import React, { useState } from 'react';
import API from '../api';

export default function Login() {
  const [form,setForm] = useState({ email:'', password:'' });

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      // store user info optional
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (e) {
      alert('Invalid credentials');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={submit} className="w-96 p-6 pastel-card rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Welcome back 💖</h1>
        <input required type="email" placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}
          className="w-full p-2 mb-3 border rounded-md" />
        <input required type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}
          className="w-full p-2 mb-3 border rounded-md" />
        <button className="w-full py-2 rounded-full bg-pink-200 hover:bg-pink-300">Login</button>
        <p className="mt-3 text-center text-sm text-gray-500">No account? <a href="/register" className="text-blue-600">Register</a></p>
      </form>
    </div>
  );
}
