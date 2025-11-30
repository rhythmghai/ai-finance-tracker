import React, { useEffect, useState } from 'react';
import API from '../api';
import { SpendingPie, ForecastBar } from './Charts';

export default function Budget(){
  const [budget,setBudget] = useState(null);
  const [summary,setSummary] = useState([]);
  const [predict,setPredict] = useState(null);

  async function load(){
    const b = await API.get('/budget');
    setBudget(b.data);
    const s = await API.get('/transactions/summary');
    setSummary(s.data);
    const p = await API.get('/budget/predict');
    setPredict(p.data);
  }

  useEffect(()=>{ load(); },[]);

  if (!budget) return <div className="bg-white p-4 rounded-xl pastel-card shadow">Loading budget...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow pastel-card">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Smart Budget</h3>
          <p className="text-sm text-gray-600">Income: ₹{budget.income} • Fixed: ₹{budget.fixed} • Remaining: ₹{budget.remaining}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Savings advice</p>
          <p className="text-xs text-gray-600">{budget.advice || ''}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Distribution</h4>
          <ul className="text-sm">
            {Object.entries(budget.suggested || {}).map(([k,v]) => <li key={k} className="mb-1">{k}: ₹{v}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Spending breakdown (30d)</h4>
          {summary.length ? <SpendingPie data={summary} /> : <p className="text-sm text-gray-500">No data</p>}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-sm mb-2">Monthly history</h4>
        {predict?.history ? <ForecastBar history={predict.history} /> : <p className="text-sm text-gray-500">No history</p>}
        <p className="mt-2 text-sm text-gray-600">Next month predicted expense: ₹{predict?.predicted ?? '—'}</p>
      </div>
    </div>
  );
}
