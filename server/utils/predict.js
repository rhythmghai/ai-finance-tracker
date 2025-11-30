// OPENAI NEW SDK (2024/2025)
const OpenAI = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create OpenAI client safely
let openaiClient = null;
if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
}

// --------------------------------------------
// BASIC MONTHLY TOTAL CALCULATION
// --------------------------------------------
function monthlyTotals(transactions = []) {
  const months = {};

  transactions.forEach(tx => {
    const d = new Date(tx.date || Date.now());
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

    months[key] =
      (months[key] || 0) +
      (tx.type === "expense" ? tx.amount : -tx.amount);
  });

  const arr = Object.entries(months)
    .map(([k, v]) => ({ month: k, total: v }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return arr;
}

// --------------------------------------------
// SIMPLE LINEAR PREDICTION (FALLBACK)
// --------------------------------------------
function simplePredictNext(transactions = []) {
  const arr = monthlyTotals(transactions);
  if (arr.length === 0) return { predicted: 0, history: [] };

  const totals = arr.map(a => a.total);
  const n = totals.length;
  const xMean = (n - 1) / 2;

  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (i - xMean) * totals[i];
    den += (i - xMean) * (i - xMean);
  }

  const slope = den === 0 ? 0 : num / den;
  const predicted = Math.max(
    0,
    Math.round(totals[totals.length - 1] + slope)
  );

  return { predicted, history: arr };
}

// --------------------------------------------
// AI-ENHANCED PREDICTION (NEW OPENAI FORMAT)
// --------------------------------------------
async function openaiEnhancePrediction(transactions = []) {
  // If no OpenAI key → fallback
  if (!openaiClient) return simplePredictNext(transactions);

  const sample = transactions
    .slice(-200)
    .map(
      tx => `${tx.date} ${tx.type} ${tx.amount} ${tx.category}`
    )
    .join("\n");

  const prompt = `
Forecast next month's total expenses based on these transactions:
${sample}

Return JSON: {"predicted": number, "reason": "short explanation"}
  `;

  try {
    const resp = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });

    const text =
      resp.choices?.[0]?.message?.content ||
      resp.choices?.[0]?.text ||
      "";

    const cleaned = text.replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("AI prediction error:", err);
    return simplePredictNext(transactions);
  }
}

module.exports = { simplePredictNext, openaiEnhancePrediction };
