const OpenAI = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let openaiClient = null;
if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
}


/**
 * Basic heuristic budget generator
 */
function heuristicBudget(income, bills = [], subs = [], transactions = []) {
  const fixed = bills.reduce((a, b) => a + (b.amount || 0), 0) + subs.reduce((a, b) => a + (b.monthlyCost || 0), 0);
  const remaining = Math.max(0, income - fixed);
  const suggested = {
    food: Math.round(remaining * 0.25),
    travel: Math.round(remaining * 0.15),
    entertainment: Math.round(remaining * 0.12),
    shopping: Math.round(remaining * 0.10),
    savings: Math.round(remaining * 0.30),
    misc: Math.round(remaining * 0.08)
  };
  return { income, fixed, remaining, suggested };
}

/**
 * Use OpenAI to refine budget suggestions given recent spending
 */
async function openaiRefineBudget({ income, bills, subs, transactions }) {
  if (!openaiClient) return heuristicBudget(income, bills, subs, transactions);

  // Summarize last 3 months transactions (light)
  const sample = transactions.slice(-50).map(tx => `${tx.date ? new Date(tx.date).toISOString().slice(0,10) : ''} ${tx.type} ${tx.amount} ${tx.category} ${tx.note || ''}`).join('\n');

  const prompt = `You are a friendly personal finance assistant. The user has monthly income ₹${income}. Their fixed monthly costs and subscriptions are:
${JSON.stringify({ bills, subs }, null, 2)}

Recent transactions (latest lines):
${sample}

Give:
1) A clear suggested monthly budget allocation (categories & amounts) that covers fixed costs and recommends savings.
2) One paragraph of friendly advice on where they can reduce spending.
Return JSON only with keys: income, fixed, remaining, suggested (object of category:amount), advice.
`;

  const resp = await openaiClient.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400
  });

  const text = resp.data.choices?.[0]?.message?.content || resp.data.choices?.[0]?.text || '';
  try {
    // Try to parse JSON directly from assistant output
    const jsonText = text.trim().replace(/\s*```json\s*|\s*```\s*/g, '');
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (e) {
    // fallback to heuristic
    return heuristicBudget(income, bills, subs, transactions);
  }
}

module.exports = {
  heuristicBudget,
  openaiRefineBudget
};
