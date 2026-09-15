import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanJsonFile() {
  const filePath = path.join(__dirname, './public/ielts-words.json');

  try {
    // 1. Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    // 2. Filter out objects with duplicate "primary" keys
    const seenPrimaryWords = new Set();
    
    const deduplicatedData = data.filter(item => {
      // If we have already seen this primary word, filter it out (return false)
      if (seenPrimaryWords.has(item.primary)) {
        return false;
      }
      
      // Otherwise, add it to our tracking Set and keep it (return true)
      seenPrimaryWords.add(item.primary);
      return true;
    });

    // 3. Convert the cleaned data back to a JSON string
    const newJsonString = JSON.stringify(deduplicatedData, null, 2);

    // 4. Write the updated JSON back to the file
    await fs.writeFile(filePath, newJsonString, 'utf-8');

    // Optional: Calculate how many duplicates were removed
    const removedCount = data.length - deduplicatedData.length;
    console.log(`Successfully updated the file! Removed ${removedCount} duplicate(s).`);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Execute the function
cleanJsonFile();