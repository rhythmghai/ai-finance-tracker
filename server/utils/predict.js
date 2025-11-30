const { Configuration, OpenAIApi } = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openaiClient = null;
if (OPENAI_API_KEY) {
  const conf = new Configuration({ apiKey: OPENAI_API_KEY });
  openaiClient = new OpenAIApi(conf);
}

// naive linear prediction based on monthly totals
function monthlyTotals(transactions = []) {
  const months = {};
  transactions.forEach(tx => {
    const d = new Date(tx.date || Date.now());
    const key = `${d.getFullYear()}-${d.getMonth()+1}`;
    months[key] = (months[key] || 0) + (tx.type === 'expense' ? tx.amount : -tx.amount);
  });
  const arr = Object.entries(months).map(([k,v])=>({ month:k, total:v })).sort((a,b)=>a.month.localeCompare(b.month));
  return arr;
}

function simplePredictNext(transactions = []) {
  const arr = monthlyTotals(transactions);
  if (arr.length === 0) return { predicted: 0, history: [] };
  const totals = arr.map(a => a.total);
  // linear regression slope
  const n = totals.length;
  const xMean = (n-1)/2;
  let num = 0, den = 0;
  for (let i=0;i<n;i++){
    num += (i - xMean) * totals[i];
    den += (i - xMean) * (i - xMean);
  }
  const slope = den === 0 ? 0 : num/den;
  const predicted = Math.max(0, Math.round(totals[totals.length-1] + slope));
  return { predicted, history: arr };
}

async function openaiEnhancePrediction(transactions=[]) {
  if (!openaiClient) return simplePredictNext(transactions);
  const sample = transactions.slice(-200).map(tx => `${tx.date} ${tx.type} ${tx.amount} ${tx.category}`).join('\n');
  const prompt = `Forecast next month's total expenses based on these transactions:\n${sample}\nReturn JSON: {"predicted":number,"reason":"short text"}`;
  const resp = await openaiClient.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200
  });
  const text = resp.data.choices?.[0]?.message?.content || resp.data.choices?.[0]?.text || '';
  try {
    const jsonText = text.replace(/```/g,'').trim();
    return JSON.parse(jsonText);
  } catch (e) {
    return simplePredictNext(transactions);
  }
}

module.exports = { simplePredictNext, openaiEnhancePrediction };
