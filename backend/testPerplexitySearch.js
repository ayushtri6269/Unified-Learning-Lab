const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Perplexity = require('@perplexity-ai/perplexity_ai');

async function runSearch() {
  if (!process.env.PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY not set. Please update backend/.env');
    process.exit(1);
  }

  const client = new Perplexity({ apiKey: process.env.PERPLEXITY_API_KEY });

  try {
    const search = await client.search.create({
      query: [
        'What is Comet Browser?',
        'Perplexity AI',
        'Perplexity Changelog'
      ]
    });

    console.log('✅ Perplexity search succeeded. Top results:');
    search.results.forEach((result, idx) => {
      console.log(`${idx + 1}. ${result.title}: ${result.url}`);
    });
  } catch (error) {
    console.error('❌ Perplexity search failed');
    console.error(error?.response?.data || error.message || error);
    process.exitCode = 1;
  }
}

runSearch();
