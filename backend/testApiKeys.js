const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const OpenAI = require('openai');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const { fetch } = require('undici');

const openaiClient = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;
const groqClient = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;
const nvidiaConfig = process.env.NVIDIA_API_KEY
    ? {
        endpoint: process.env.NVIDIA_CHAT_ENDPOINT || 'https://integrate.api.nvidia.com/v1/chat/completions',
        model: process.env.NVIDIA_CHAT_MODEL || 'meta/llama-3.1-8b-instruct',
        apiKey: process.env.NVIDIA_API_KEY
    }
    : null;
const perplexityConfig = process.env.PERPLEXITY_API_KEY
    ? {
        endpoint: process.env.PERPLEXITY_CHAT_ENDPOINT || 'https://api.perplexity.ai/chat/completions',
        model: process.env.PERPLEXITY_CHAT_MODEL || 'sonar',
        apiKey: process.env.PERPLEXITY_API_KEY
    }
    : null;

async function testOpenAI() {
    console.log('\n🔍 Testing OpenAI API Key...');
    try {
        if (!openaiClient) {
            throw new Error('OpenAI API key not configured');
        }

        const response = await openaiClient.responses.create({
            model: 'gpt-4o-mini',
            input: 'Say "API key works!"'
        });

        console.log('✅ OpenAI API Key: WORKING');
        console.log('   Response:', response.output_text?.trim() || 'No text returned');
        return true;
    } catch (error) {
        console.log('❌ OpenAI API Key: FAILED');
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        console.log('   Error:', responseData?.error?.message || apiError?.message || apiError);
        return false;
    }
}

async function testGemini() {
    console.log('\n🔍 Testing Google Gemini API Key...');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: 'Say "API key works!"'
        });

        console.log('✅ Google Gemini API Key: WORKING');
        console.log('   Response:', response.text);
        return true;
    } catch (error) {
        console.log('❌ Google Gemini API Key: FAILED');
        console.log('   Error:', error.message);
        return false;
    }
}

async function testGroq() {
    console.log('\n🔍 Testing Groq API Key...');
    try {
        if (!groqClient) {
            throw new Error('Groq API key not configured');
        }

        const response = await groqClient.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: 'Say "API key works!"' }],
            max_tokens: 20
        });

        console.log('✅ Groq API Key: WORKING');
        console.log('   Response:', response?.choices?.[0]?.message?.content?.trim() || 'No text returned');
        return true;
    } catch (error) {
        console.log('❌ Groq API Key: FAILED');
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        console.log('   Error:', responseData?.error?.message || apiError?.message || apiError);
        return false;
    }
}

async function testNvidia() {
    console.log('\n🔍 Testing NVIDIA API Key...');
    try {
        if (!nvidiaConfig) {
            throw new Error('NVIDIA API key not configured');
        }

        const response = await fetch(nvidiaConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${nvidiaConfig.apiKey}`
            },
            body: JSON.stringify({
                model: nvidiaConfig.model,
                messages: [{ role: 'user', content: 'Say "API key works!"' }],
                max_tokens: 30
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error?.message || `NVIDIA API request failed with status ${response.status}`;
            const err = new Error(errorMessage);
            err.response = { status: response.status, data };
            throw err;
        }

        console.log('✅ NVIDIA API Key: WORKING');
        console.log('   Response:', data?.choices?.[0]?.message?.content?.trim() || 'No text returned');
        return true;
    } catch (error) {
        console.log('❌ NVIDIA API Key: FAILED');
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        console.log('   Error:', responseData?.error?.message || apiError?.message || apiError);
        return false;
    }
}

async function testPerplexity() {
    console.log('\n🔍 Testing Perplexity API Key...');
    try {
        if (!perplexityConfig) {
            throw new Error('Perplexity API key not configured');
        }

        const response = await fetch(perplexityConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${perplexityConfig.apiKey}`
            },
            body: JSON.stringify({
                model: perplexityConfig.model,
                messages: [{ role: 'user', content: 'Say "API key works!"' }],
                max_tokens: 30
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error?.message || `Perplexity API request failed with status ${response.status}`;
            const err = new Error(errorMessage);
            err.response = { status: response.status, data };
            throw err;
        }

        console.log('✅ Perplexity API Key: WORKING');
        console.log('   Response:', data?.choices?.[0]?.message?.content?.trim() || 'No text returned');
        return true;
    } catch (error) {
        console.log('❌ Perplexity API Key: FAILED');
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        console.log('   Error:', responseData?.error?.message || apiError?.message || apiError);
        return false;
    }
}

const testerRegistry = {
    openai: { label: 'OpenAI', envKey: 'OPENAI_API_KEY', run: testOpenAI },
    gemini: { label: 'Google Gemini', envKey: 'GOOGLE_API_KEY', run: testGemini },
    groq: { label: 'Groq', envKey: 'GROQ_API_KEY', run: testGroq },
    nvidia: { label: 'NVIDIA', envKey: 'NVIDIA_API_KEY', run: testNvidia },
    perplexity: { label: 'Perplexity', envKey: 'PERPLEXITY_API_KEY', run: testPerplexity }
};

async function runTests() {
    const args = process.argv.slice(2).map(arg => arg.toLowerCase());
    const runAll = args.length === 0 || args.includes('all');
    const selectedKeys = runAll
        ? Object.keys(testerRegistry)
        : args.filter(arg => testerRegistry[arg]);
    const unknownArgs = args.filter(arg => arg !== 'all' && !testerRegistry[arg]);

    if (unknownArgs.length > 0) {
        console.log(`⚠️ Unknown providers skipped: ${unknownArgs.join(', ')}`);
    }

    if (selectedKeys.length === 0) {
        console.log('No valid providers specified. Available options:');
        console.log(`  ${Object.keys(testerRegistry).join(', ')}, all`);
        return;
    }

    console.log('=================================');
    console.log('🧪 API Key Testing Tool');
    console.log('=================================');

    console.log('\n🎯 Providers to test:', runAll ? 'all' : selectedKeys.join(', '));

    console.log('\n📋 Configuration:');
    selectedKeys.forEach((key) => {
        const { label, envKey } = testerRegistry[key];
        const value = process.env[envKey];
        console.log(`   ${label} Key:`, value ? `${value.substring(0, 20)}...` : 'NOT SET');
    });

    const results = {};
    for (const key of selectedKeys) {
        const { label, run } = testerRegistry[key];
        results[label] = await run();
    }

    console.log('\n=================================');
    console.log('📊 Test Summary:');
    console.log('=================================');
    selectedKeys.forEach((key) => {
        const { label } = testerRegistry[key];
        const passed = results[label];
        console.log(`${label}: ${passed ? '✅ Working' : '❌ Failed'}`);
    });
    console.log('=================================\n');
}

runTests();
