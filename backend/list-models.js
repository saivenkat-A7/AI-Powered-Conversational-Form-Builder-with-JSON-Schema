require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);

async function run() {
  try {
    // There is no direct listModels in the JS SDK usually, but if there is, we could use REST.
    // Let's just fetch REST using native fetch to see models.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.LLM_API_KEY}`);
    const data = await response.json();
    const flashModels = data.models.filter(m => m.name.includes('1.5-flash') || m.name.includes('flash-latest'));
    console.log(JSON.stringify(flashModels, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
