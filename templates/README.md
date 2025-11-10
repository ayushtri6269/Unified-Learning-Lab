# Question Templates Guide 📚

This folder contains easy-to-use templates for adding questions in bulk to your Learning Lab platform.

## Available Templates

Each template file contains 5 sample questions that you can modify or use as a reference:

1. **aptitude-questions.json** - Speed, Time, Distance, Percentages, Averages
2. **coding-questions.json** - Programming, Data Structures, Algorithms
3. **dbms-questions.json** - Database concepts, SQL, Normalization
4. **os-questions.json** - Operating System concepts, Scheduling, Memory
5. **networks-questions.json** - IP, OSI Model, Protocols
6. **quantitative-questions.json** - Math, Ratios, Algebra
7. **verbal-questions.json** - Grammar, Vocabulary, Synonyms/Antonyms
8. **logical-questions.json** - Reasoning, Pattern Recognition, Coding-Decoding
9. **gk-questions.json** - General Knowledge, Current Affairs, History

## How to Use

### Step 1: Choose Your Template

Pick the category you want to add questions for (e.g., `coding-questions.json`)

### Step 2: Edit the Template

Open the file in any text editor and modify the questions:

```json
{
  "text": "Your question here?",
  "category": "Coding",
  "difficulty": "easy",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0
}
```

**Important:**

- `correct` is the index (0-3) of the correct option
- Option 1 = 0, Option 2 = 1, Option 3 = 2, Option 4 = 3

### Step 3: Add More Questions

Copy-paste the question block and modify it:

```json
[
  {
    "text": "Question 1?",
    "category": "Coding",
    "difficulty": "easy",
    "options": ["A", "B", "C", "D"],
    "correct": 0
  },
  {
    "text": "Question 2?",
    "category": "Coding",
    "difficulty": "medium",
    "options": ["A", "B", "C", "D"],
    "correct": 1
  }
]
```

### Step 4: Upload to Admin Panel

1. Login as admin
2. Go to **Admin Panel** → **Questions** tab
3. Click **Bulk Import**
4. Upload your modified template file
5. Done! ✅

## Categories Available

- **Aptitude** - Numerical reasoning questions
- **Coding** - Programming and algorithms
- **DBMS** - Database management
- **OS** - Operating systems
- **Networks** - Computer networks
- **Quantitative** - Mathematical problems
- **Verbal** - English language
- **Logical** - Logical reasoning
- **GK** - General knowledge

## Difficulty Levels

- **easy** - Basic level questions
- **medium** - Intermediate level
- **hard** - Advanced level

## Tips

✅ **DO:**

- Keep questions clear and concise
- Ensure only one correct answer
- Use all 4 options
- Match the category exactly (case-sensitive)

❌ **DON'T:**

- Use index 4 or higher for correct answer (only 0-3)
- Mix categories in one file
- Leave any field empty
- Use invalid difficulty levels

## Quick Example

Want to add 3 coding questions? Edit `coding-questions.json`:

```json
[
  {
    "text": "What does HTML stand for?",
    "category": "Coding",
    "difficulty": "easy",
    "options": [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks Text Mark Language"
    ],
    "correct": 0
  },
  {
    "text": "Which symbol is used for comments in Python?",
    "category": "Coding",
    "difficulty": "easy",
    "options": ["//", "#", "/*", "<!--"],
    "correct": 1
  },
  {
    "text": "What is the output of: print(2**3)?",
    "category": "Coding",
    "difficulty": "medium",
    "options": ["6", "8", "9", "23"],
    "correct": 1
  }
]
```

Upload this file and all 3 questions will be added instantly! 🚀

## 🤖 Generate Questions with AI

Want to create hundreds of questions quickly? Use AI tools like ChatGPT, Claude, or Gemini!

📚 **See: [AI_QUESTION_GENERATION.md](../AI_QUESTION_GENERATION.md)** for:

- Ready-to-use AI prompts for all categories
- Step-by-step generation workflow
- Quality validation tips
- Bulk generation techniques

**Quick AI Prompt:**

```
Generate 25 [CATEGORY] questions in JSON format.
Structure: {"text": "...", "category": "...", "difficulty": "...", "options": [...], "correct": 0-3}
```

## Need Help?

If you get an error during import:

1. Check that your JSON syntax is correct (use a JSON validator)
2. Verify the category name matches exactly
3. Ensure `correct` is between 0-3
4. Make sure difficulty is "easy", "medium", or "hard"

## 📖 Additional Resources

- **Manual Creation:** Use these templates as starting point
- **AI Generation:** See [AI_QUESTION_GENERATION.md](../AI_QUESTION_GENERATION.md)
- **Bulk Import:** Admin Panel → Questions → Bulk Import

Happy Teaching! 📖✨
