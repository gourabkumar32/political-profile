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

async function promptMLA() {
  return new Promise((resolve) => {
    rl.question('Enter MLA name (or "done" to finish): ', (name) => {
      if (name.toLowerCase() === 'done') {
        resolve(null);
      } else {
        rl.question('Enter constituency: ', (constituency) => {
          rl.question('Enter party: ', (party) => {
            rl.question('Enter image filename: ', (image) => {
              resolve({ name, constituency, party, image });
            });
          });
        });
      }
    });
  });
}

async function addMLAsForState(state) {
  console.log(`Adding MLAs for ${state}...`);
  
  while (true) {
    const mlaData = await promptMLA();
    if (!mlaData) break;

    const newMLA = new MLA({
      ...mlaData,
      state,
    });

    await newMLA.save();
    console.log(`Added MLA: ${mlaData.name}`);
  }

  console.log(`Finished adding MLAs for ${state}`);
}

async function main() {
  rl.question('Enter state name: ', async (state) => {
    await addMLAsForState(state);
    mongoose.disconnect();
    rl.close();
  });
}

main();
