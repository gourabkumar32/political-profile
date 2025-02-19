const mongoose = require('mongoose');
const readline = require('readline');
const dotenv = require('dotenv');

dotenv.config();

const MLA = require('./models/MLA');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function deleteState(state) {
  try {
    // First, check if the state exists
    const stateExists = await MLA.exists({ state: state });
    
    if (!stateExists) {
      console.log(`State "${state}" does not exist in the database.`);
      return;
    }

    // If the state exists, update all MLAs with this state to have no state
    const result = await MLA.updateMany(
      { state: state },
      { $set: { state: 'Unassigned' } }
    );

    console.log(`Updated ${result.modifiedCount} MLAs. Their state has been set to 'Unassigned'.`);
    console.log(`The state "${state}" has been effectively removed from the database.`);
  } catch (error) {
    console.error('Error updating MLAs:', error.message);
  }
}

async function main() {
  const state = await promptInput('Enter the state name to delete: ');
  
  const confirmDelete = await promptInput(`Are you sure you want to delete the state "${state}"? This will set all associated MLAs to 'Unassigned'. (yes/no): `);
  
  if (confirmDelete.toLowerCase() === 'yes') {
    await deleteState(state);
  } else {
    console.log('Operation cancelled.');
  }

  mongoose.disconnect();
  rl.close();
}

main();