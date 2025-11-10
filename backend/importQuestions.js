require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const {
  createQuestion,
  getQuestionStats
} = require('./models/QuestionByCategory');

const importQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Template files to import
    const templateFiles = [
      'aptitude-questions.json',
      'coding-questions.json',
      'dbms-questions.json',
      'os-questions.json',
      'networks-questions.json',
      'quantitative-questions.json',
      'verbal-questions.json',
      'logical-questions.json',
      'gk-questions.json',
      'miscellaneous-questions.json'
    ];

    let totalImported = 0;
    let totalFailed = 0;

    for (const file of templateFiles) {
      const filePath = path.join(__dirname, '..', 'templates', file);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
      }

      console.log(`\n📂 Processing: ${file}`);

      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      let imported = 0;
      let failed = 0;

      for (const question of questions) {
        try {
          await createQuestion(question);
          imported++;
        } catch (error) {
          failed++;
          console.log(`  ❌ Failed to import question: ${question.text?.substring(0, 50)}...`);
        }
      }

      console.log(`  ✅ Imported: ${imported}/${questions.length}`);
      if (failed > 0) {
        console.log(`  ❌ Failed: ${failed}`);
      }

      totalImported += imported;
      totalFailed += failed;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total Imported: ${totalImported}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Show stats
    console.log('\n📈 Questions per Collection:');
    const stats = await getQuestionStats();
    Object.entries(stats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing questions:', error.message);
    process.exit(1);
  }
};

importQuestions();
