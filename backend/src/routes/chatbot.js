const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const { fetch } = require('undici');

// Get available AI models
router.get('/models', protect, async (req, res) => {
    try {
        const models = [
            {
                id: 'built-in',
                name: 'Built-in AI',
                description: 'Context-aware assistant available without external API keys',
                requiresApiKey: false,
                default: true
            }
        ];

        // Add OpenAI models if API key exists
        if (process.env.OPENAI_API_KEY) {
            models.push({
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                description: 'Fast, reliable everyday assistant',
                requiresApiKey: false
            });
            models.push({
                id: 'gpt-4.1',
                name: 'GPT-4.1',
                description: 'Most capable general OpenAI model',
                requiresApiKey: false
            });
        }

        // Add Google Gemini if API key exists
        if (process.env.GOOGLE_API_KEY) {
            models.push({
                id: 'gemini-2.0-flash-exp',
                name: 'Google Gemini 2.0 Flash',
                description: 'Fast and efficient AI',
                requiresApiKey: false
            });
        }

        if (process.env.GROQ_API_KEY) {
            models.push({
                id: 'groq-llama-3.1-8b-instant',
                name: 'Groq LLaMA 3.1 8B',
                description: 'Fast responses powered by Groq inference',
                requiresApiKey: false
            });
        }

        if (process.env.NVIDIA_API_KEY) {
            models.push({
                id: 'nvidia-llama-3.1-8b',
                name: 'NVIDIA NIM LLaMA 3.1 8B',
                description: 'High-performance responses via NVIDIA NIM',
                requiresApiKey: false
            });
        }

        if (process.env.PERPLEXITY_API_KEY) {
            models.push({
                id: 'perplexity-llama-3.1-sonar-small',
                name: 'Perplexity Sonar Small',
                description: 'Search-augmented answers from Perplexity',
                requiresApiKey: false
            });
        }

        res.json({
            success: true,
            models
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get models'
        });
    }
});

// AI Assistant endpoint
router.post('/chat', protect, async (req, res) => {
    try {
    const { message, conversationHistory, model } = req.body;
    const history = Array.isArray(conversationHistory) ? conversationHistory : [];

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        if (!model) {
            return res.status(400).json({
                success: false,
                message: 'No AI model selected.'
            });
        }

        // Get user's recent test results for context
    const Result = require('../../models/Result');
        const recentResults = await Result.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        // Build context from user data
        const userContext = {
            name: req.user.name,
            email: req.user.email,
            totalTests: recentResults.length,
            recentScores: recentResults.map(r => ({
                category: r.category,
                score: r.score,
                totalQuestions: r.totalQuestions,
                percentage: ((r.score / r.totalQuestions) * 100).toFixed(1)
            }))
        };

        let response;

        // Choose AI provider based on model
        if (model === 'built-in') {
            response = generateAIResponse(message, userContext, history);
        } else if (model.startsWith('gpt-')) {
            response = await callOpenAI(message, userContext, history, model);
        } else if (model === 'gemini-2.0-flash-exp') {
            response = await callGemini(message, userContext, history);
        } else if (model === 'groq-llama-3.1-8b-instant') {
            response = await callGroq(message, userContext, history);
        } else if (model === 'nvidia-llama-3.1-8b') {
            response = await callNvidia(message, userContext, history);
        } else if (model === 'perplexity-llama-3.1-sonar-small') {
            response = await callPerplexity(message, userContext, history);
        } else {
            return res.status(400).json({
                success: false,
                message: `Unsupported model: ${model}`
            });
        }

        res.json({
            success: true,
            response: response,
            model: model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process your message',
            error: error.message
        });
    }
});

// Call OpenAI API
let openAIClient;

async function callOpenAI(message, userContext, history = [], model = 'gpt-4o-mini') {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured. Please contact administrator.');
        }

        if (!openAIClient) {
            openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }

        const systemPrompt = `You are a helpful learning assistant for a programming education platform.
The user's name is ${userContext.name}.
They have taken ${userContext.totalTests} tests so far.
${userContext.totalTests > 0 ? `Recent scores: ${userContext.recentScores.map(s => `${s.category}: ${s.percentage}%`).join(', ')}` : ''}
Provide clear, educational, and encouraging responses about programming, data structures, algorithms, and learning strategies.`;

        const formattedHistory = Array.isArray(history)
            ? history
                .filter(({ role, content, text, type }) => (content || text) && (role || type))
                .map(({ role, content, text, type }) => {
                    const normalizedRole = (role || type) === 'assistant' || (role || type) === 'bot'
                        ? 'assistant'
                        : 'user';
                    const body = typeof content === 'string' ? content : (typeof text === 'string' ? text : '');
                    return {
                        role: normalizedRole,
                        content: [
                            {
                                type: 'input_text',
                                text: body
                            }
                        ]
                    };
                })
            : [];

        const response = await openAIClient.responses.create({
            model,
            input: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'input_text',
                            text: systemPrompt
                        }
                    ]
                },
                ...formattedHistory,
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: message
                        }
                    ]
                }
            ],
            temperature: 0.7,
            max_output_tokens: 800
        });

        return response.output_text?.trim() || 'I had trouble generating a response. Please try again or switch models.';
    } catch (error) {
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        const messageText = apiError?.message || responseData?.error?.message || '';
        console.error('OpenAI API error:', responseData || messageText || apiError);
        if (messageText.includes('not configured')) {
            throw error;
        }
        if (responseData?.error?.type === 'invalid_request_error' || apiError.response?.status === 401) {
            throw new Error('Invalid OpenAI API key. Please check backend configuration.');
        }
        if (apiError.response?.status === 429 || responseData?.error?.type === 'insufficient_quota') {
            throw new Error('OpenAI rate limit exceeded. Please try again later or use Built-in AI.');
        }
        throw new Error('Failed to get response from OpenAI. Please try Built-in AI model.');
    }
}

let groqClient;

async function callGroq(message, userContext, history = []) {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('Groq API key not configured. Please contact administrator.');
        }

        if (!groqClient) {
            groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
        }

        const systemPrompt = `You are a helpful learning assistant for a programming education platform.
The user's name is ${userContext.name}.
They have taken ${userContext.totalTests} tests so far.
${userContext.totalTests > 0 ? `Recent scores: ${userContext.recentScores.map(s => `${s.category}: ${s.percentage}%`).join(', ')}` : ''}
Provide clear, educational, and encouraging responses about programming, data structures, algorithms, and learning strategies.`;

        const formattedHistory = Array.isArray(history)
            ? history
                .filter(({ role, type, content, text }) => (content || text) && (role || type))
                .map(({ role, type, content, text }) => ({
                    role: role === 'bot' || type === 'bot' || role === 'assistant' ? 'assistant' : 'user',
                    content: typeof content === 'string' ? content : (typeof text === 'string' ? text : '')
                }))
            : [];

        const response = await groqClient.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                ...formattedHistory,
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 800
        });

        const completion = response?.choices?.[0]?.message?.content;
        return completion?.trim() || 'Groq responded without text. Please try again or switch models.';
    } catch (error) {
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        const messageText = apiError?.message || responseData?.error?.message || '';
        console.error('Groq API error:', responseData || messageText || apiError);
        if (messageText.includes('not configured')) {
            throw error;
        }
        if (apiError.response?.status === 401) {
            throw new Error('Invalid Groq API key. Please check backend configuration.');
        }
        if (apiError.response?.status === 429) {
            throw new Error('Groq rate limit exceeded. Please try again later or use another model.');
        }
        throw new Error('Failed to get response from Groq. Please try Built-in AI model.');
    }
}

async function callNvidia(message, userContext, history = []) {
    try {
        if (!process.env.NVIDIA_API_KEY) {
            throw new Error('NVIDIA API key not configured. Please contact administrator.');
        }

        const endpoint = process.env.NVIDIA_CHAT_ENDPOINT || 'https://integrate.api.nvidia.com/v1/chat/completions';
        const model = process.env.NVIDIA_CHAT_MODEL || 'meta/llama-3.1-8b-instruct';

        const systemPrompt = `You are a helpful learning assistant for a programming education platform.
The user's name is ${userContext.name}.
They have taken ${userContext.totalTests} tests so far.
${userContext.totalTests > 0 ? `Recent scores: ${userContext.recentScores.map(s => `${s.category}: ${s.percentage}%`).join(', ')}` : ''}
Provide clear, educational, and encouraging responses about programming, data structures, algorithms, and learning strategies.`;

        const formattedHistory = Array.isArray(history)
            ? history
                .filter(({ role, type, content, text }) => (content || text) && (role || type))
                .map(({ role, type, content, text }) => ({
                    role: role === 'bot' || type === 'bot' || role === 'assistant' ? 'assistant' : 'user',
                    content: typeof content === 'string' ? content : (typeof text === 'string' ? text : '')
                }))
            : [];

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...formattedHistory,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error?.message || 'Unexpected NVIDIA API error.';
            const err = new Error(errorMessage);
            err.response = { status: response.status, data };
            throw err;
        }

        const completion = data?.choices?.[0]?.message?.content;
        return completion?.trim() || 'NVIDIA responded without text. Please try again or switch models.';
    } catch (error) {
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        const messageText = apiError?.message || responseData?.error?.message || '';
        console.error('NVIDIA API error:', responseData || messageText || apiError);
        if (messageText.includes('not configured')) {
            throw error;
        }
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
            throw new Error('Invalid NVIDIA API key. Please check backend configuration.');
        }
        if (apiError.response?.status === 429) {
            throw new Error('NVIDIA rate limit exceeded. Please try again later or use another model.');
        }
        throw new Error('Failed to get response from NVIDIA. Please try Built-in AI model.');
    }
}

let perplexityEndpoint;

async function callPerplexity(message, userContext, history = []) {
    try {
        if (!process.env.PERPLEXITY_API_KEY) {
            throw new Error('Perplexity API key not configured. Please contact administrator.');
        }

    const endpoint = process.env.PERPLEXITY_CHAT_ENDPOINT || 'https://api.perplexity.ai/chat/completions';
    const model = process.env.PERPLEXITY_CHAT_MODEL || 'sonar';

        const systemPrompt = `You are a helpful learning assistant for a programming education platform.
The user's name is ${userContext.name}.
They have taken ${userContext.totalTests} tests so far.
${userContext.totalTests > 0 ? `Recent scores: ${userContext.recentScores.map(s => `${s.category}: ${s.percentage}%`).join(', ')}` : ''}
Provide clear, educational, and encouraging responses about programming, data structures, algorithms, and learning strategies.`;

        const formattedHistory = Array.isArray(history)
            ? history
                .filter(({ role, type, content, text }) => (content || text) && (role || type))
                .map(({ role, type, content, text }) => ({
                    role: role === 'bot' || type === 'bot' || role === 'assistant' ? 'assistant' : 'user',
                    content: typeof content === 'string' ? content : (typeof text === 'string' ? text : '')
                }))
            : [];

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...formattedHistory,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error?.message || 'Unexpected Perplexity API error.';
            const err = new Error(errorMessage);
            err.response = { status: response.status, data };
            throw err;
        }

        const completion = data?.choices?.[0]?.message?.content;
        return completion?.trim() || 'Perplexity responded without text. Please try again or switch models.';
    } catch (error) {
        const apiError = error?.error || error;
        const responseData = apiError?.response?.data;
        const messageText = apiError?.message || responseData?.error?.message || '';
        console.error('Perplexity API error:', responseData || messageText || apiError);
        if (messageText.includes('not configured')) {
            throw error;
        }
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
            throw new Error('Invalid Perplexity API key. Please check backend configuration.');
        }
        if (apiError.response?.status === 429) {
            throw new Error('Perplexity rate limit exceeded. Please try again later or use another model.');
        }
        throw new Error('Failed to get response from Perplexity. Please try Built-in AI model.');
    }
}

// Call Google Gemini API
async function callGemini(message, userContext, history = []) {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('Google API key not configured. Please contact administrator.');
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

        const contextPrompt = `You are a helpful learning assistant for a programming education platform.
The user's name is ${userContext.name}.
They have taken ${userContext.totalTests} tests so far.
${userContext.totalTests > 0 ? `Recent scores: ${userContext.recentScores.map(s => `${s.category}: ${s.percentage}%`).join(', ')}` : ''}
Provide clear, educational, and encouraging responses about programming, data structures, algorithms, and learning strategies.

User question: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: contextPrompt
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error.message);
        if (error.message.includes('not configured')) {
            throw error;
        }
        if (error.message.includes('API_KEY_INVALID')) {
            throw new Error('Invalid Google API key. Please check backend configuration.');
        }
        if (error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error('Google API rate limit exceeded. Please try again later or use Built-in AI.');
        }
        throw new Error('Failed to get response from Google Gemini. Please try Built-in AI model.');
    }
}

// Helper function to generate AI responses
function generateAIResponse(message, userContext, history = []) {
    const msg = message.toLowerCase();

    // Greeting responses
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
        return `Hello ${userContext.name}! 👋 I'm your learning assistant. I can help you with:
• 📊 Analyzing your test performance
• 💡 Study tips and recommendations
• 📚 Learning about data structures and algorithms
• 🎯 Setting learning goals

What would you like to know?`;
    }

    // Performance-related queries
    if (msg.includes('performance') || msg.includes('score') || msg.includes('result')) {
        if (userContext.totalTests === 0) {
            return "You haven't taken any tests yet! 📝 Start with a test to track your progress. I recommend beginning with fundamentals like Data Structures or Algorithms.";
        }

        const avgScore = userContext.recentScores.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / userContext.recentScores.length;
        let performanceMsg = `📊 **Your Performance Overview:**\n\n`;
        performanceMsg += `• Total Tests Taken: ${userContext.totalTests}\n`;
        performanceMsg += `• Average Score: ${avgScore.toFixed(1)}%\n\n`;
        performanceMsg += `**Recent Test Results:**\n`;
        userContext.recentScores.forEach((score, idx) => {
            const emoji = score.percentage >= 80 ? '🌟' : score.percentage >= 60 ? '👍' : '📈';
            performanceMsg += `${idx + 1}. ${emoji} ${score.category}: ${score.score}/${score.totalQuestions} (${score.percentage}%)\n`;
        });

        if (avgScore >= 80) {
            performanceMsg += `\n🎉 Excellent work! You're doing great! Keep challenging yourself with harder topics.`;
        } else if (avgScore >= 60) {
            performanceMsg += `\n👏 Good progress! Focus on reviewing incorrect answers and practicing more.`;
        } else {
            performanceMsg += `\n💪 Keep practicing! Focus on understanding concepts rather than memorizing. Take your time with each question.`;
        }

        return performanceMsg;
    }

    // Study tips
    if (msg.includes('study') || msg.includes('learn') || msg.includes('tip') || msg.includes('improve')) {
        return `📚 **Effective Learning Tips:**

1. **Understand, Don't Memorize** 🧠
   - Focus on understanding the "why" behind concepts
   - Draw diagrams to visualize data structures

2. **Practice Regularly** 💻
   - Solve at least 2-3 problems daily
   - Review your mistakes and learn from them

3. **Time Management** ⏰
   - Use the timed tests to build exam confidence
   - Don't spend too much time on one question

4. **Learn from Mistakes** ✅
   - Review all incorrect answers
   - Understand why the correct answer is right

5. **Progress Tracking** 📈
   - Take tests regularly to track improvement
   - Focus on weak areas identified in results

Which topic would you like to focus on?`;
    }

    // Data structures info
    if (msg.includes('data structure') || msg.includes('array') || msg.includes('linked list') ||
        msg.includes('stack') || msg.includes('queue') || msg.includes('tree') || msg.includes('graph')) {
        return `📊 **Data Structures Learning Path:**

**Basics (Start here):**
• Arrays & Strings - Foundation of all data structures
• Linked Lists - Dynamic memory allocation

**Intermediate:**
• Stacks & Queues - LIFO and FIFO structures
• Trees - Binary trees, BST, tree traversals
• Hashing - Hash tables, hash maps

**Advanced:**
• Graphs - BFS, DFS, shortest paths
• Heaps - Priority queues, heap sort
• Tries - String matching, autocomplete

💡 **Pro Tip:** Master one topic at a time. Take tests on each topic to solidify your understanding before moving to the next!

Which data structure would you like to practice?`;
    }

    // Algorithms info
    if (msg.includes('algorithm') || msg.includes('sorting') || msg.includes('searching') ||
        msg.includes('dynamic programming') || msg.includes('recursion')) {
        return `⚡ **Algorithm Learning Path:**

**Fundamental Algorithms:**
• Sorting - Bubble, Selection, Merge, Quick sort
• Searching - Linear, Binary search
• Recursion - Base cases, recursive thinking

**Problem-Solving Techniques:**
• Two Pointers - Array/string problems
• Sliding Window - Subarray problems
• Divide & Conquer - Breaking down problems

**Advanced Techniques:**
• Dynamic Programming - Optimization problems
• Greedy Algorithms - Local optimal choices
• Backtracking - Constraint satisfaction

🎯 **Practice Strategy:**
1. Start with sorting and searching
2. Practice recursion problems daily
3. Move to DP after mastering basics

Ready to take an algorithms test?`;
    }

    // Motivation and encouragement
    if (msg.includes('difficult') || msg.includes('hard') || msg.includes('struggle') || msg.includes('help')) {
        return `💪 **You've Got This!**

Learning programming concepts can be challenging, but remember:

✨ **Every expert was once a beginner**
📈 **Progress takes time** - Be patient with yourself
🎯 **Focus on understanding** - Not just solving
🤝 **Don't hesitate to review** - Repetition builds mastery

**Quick Tips to Overcome Challenges:**
1. Break complex problems into smaller parts
2. Use visual aids (diagrams, flowcharts)
3. Take breaks when feeling overwhelmed
4. Review solved problems regularly
5. Practice similar problems to build confidence

I'm here to help! Ask me specific questions about any topic you're struggling with.`;
    }

    // Test recommendations
    if (msg.includes('test') || msg.includes('quiz') || msg.includes('practice') || msg.includes('exam')) {
        const recommendations = [];

        if (userContext.totalTests === 0) {
            recommendations.push('Data Structures', 'Algorithms', 'Programming Basics');
        } else {
            // Recommend based on weak areas
            const weakAreas = userContext.recentScores
                .filter(s => parseFloat(s.percentage) < 70)
                .map(s => s.category);

            if (weakAreas.length > 0) {
                return `🎯 **Recommended Tests Based on Your Performance:**

I noticed you could improve in these areas:
${weakAreas.map((area, idx) => `${idx + 1}. ${area} - Review concepts and retake the test`).join('\n')}

**Study Strategy:**
1. Review your previous test results
2. Study the weak topics
3. Retake the test to measure improvement

Click on the Tests menu to start practicing!`;
            }
        }

        return `🎯 **Test Recommendations:**

**Available Test Categories:**
• 📊 Data Structures
• ⚡ Algorithms
• 💻 Programming Concepts
• 🗄️ DBMS (Database Management)
• 🌐 Computer Networks
• 🖥️ Operating Systems
• 🧮 Quantitative Aptitude
• 🧩 Logical Reasoning
• 💼 General Knowledge
• 📝 Verbal Ability

Start with topics you're less familiar with, or retake tests to improve your scores!`;
    }

    // About the platform
    if (msg.includes('about') || msg.includes('how to use') || msg.includes('feature')) {
        return `🚀 **Welcome to Unified Learning Lab!**

**Features:**
• 📝 **Practice Tests** - Multiple categories and difficulty levels
• 📊 **Performance Analytics** - Track your progress over time
• 🎯 **Personalized Feedback** - Identify weak areas
• ⏱️ **Timed Tests** - Simulate real exam conditions
• 🌙 **Dark Mode** - Comfortable studying anytime
• 🤖 **AI Assistant** - That's me! Here to help 24/7

**How to Use:**
1. Browse available test categories from the sidebar
2. Take tests and submit your answers
3. Review results and explanations
4. Track your progress in the dashboard
5. Ask me questions anytime!

What would you like to explore first?`;
    }

    // Default helpful response
    return `I'm your AI learning assistant! 🤖

I can help you with:
• 📊 **Performance Analysis** - "Show my performance"
• 💡 **Study Tips** - "How to study effectively"
• 📚 **Topic Guidance** - "Explain data structures"
• 🎯 **Test Recommendations** - "Which test should I take"
• ❓ **Questions** - Ask me anything about learning!

What would you like to know? Feel free to ask me about your progress, study strategies, or any computer science topics!`;
}

module.exports = router;
