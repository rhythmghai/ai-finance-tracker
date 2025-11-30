import React, { useEffect, useState } from 'react';
import API from '../api';
import AddTransaction from './AddTransaction';
import Subscriptions from './Subscriptions';
import Bills from './Bills';
import Budget from './Budget';

export default function Dashboard(){
  const [txs,setTxs] = useState([]);

  async function loadTxs(){
    const res = await API.get('/transactions');
    setTxs(res.data);
  }

  useEffect(()=>{ loadTxs(); },[]);

  return (
    <div className="p-6 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Finance Tracker</h1>
        <div>
          <button onClick={()=>{ localStorage.removeItem('token'); window.location.href='/login'; }} className="py-2 px-4 rounded-full bg-pink-100">Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <AddTransaction onAdded={loadTxs} />
          <Subscriptions />
          <Bills />
        </div>

        <div className="col-span-2 space-y-4">
          <Budget />
          <div className="bg-white p-4 rounded-xl pastel-card shadow">
            <h3 className="font-semibold mb-3">Recent transactions</h3>
            {txs.length ? txs.map(tx => (
              <div key={tx._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <div className="font-medium">{tx.category} • {tx.type}</div>
                  <div className="text-sm text-gray-500">{tx.note}</div>
                </div>
                <div className="font-semibold">₹{tx.amount}</div>
              </div>
            )) : <p className="text-sm text-gray-500">No transactions yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
