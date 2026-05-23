import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const docxDir = path.join(process.cwd(), 'public', 'docx');

const files = fs.readdirSync(docxDir).filter(f => f.endsWith('.docx'));

for (const file of files) {
  const filePath = path.join(docxDir, file);
  const result = await mammoth.extractRawText({ path: filePath });
  console.log(`\n${'='.repeat(80)}`);
  console.log(`FILE: ${file}`);
  console.log(`${'='.repeat(80)}`);
  console.log(result.value);
}
