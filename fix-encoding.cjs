const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.md', '.json', '.txt', '.jsonl']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.next', 'build'].includes(entry.name)) continue;
      files.push(...walk(full));
    } else if (entry.isFile() && exts.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

const replacements = [
  ['Ã©', 'é'], ['Ã¨', 'è'], ['Ãª', 'ê'], ['Ã¢', 'â'], ['Ã¶', 'ö'], ['Ã¼', 'ü'], ['Ã§', 'ç'],
  ['Ã±', 'ñ'], ['Ã£', 'ã'], ['Ã¯', 'ï'], ['Ã´', 'ô'], ['Ã»', 'û'], ['Ã¹', 'ù'], ['ÃŸ', 'ß'],
  ['Ã‰', 'É'], ['Ã€', 'À'], ['Ã‡', 'Ç'], ['ÃŒ', 'Î'], ['Ã–', 'Ö'], ['Ãœ', 'Ü'], ['Ã ', 'à'],
  ['Ã¡', 'á'], ['Ã³', 'ó'], ['Ãº', 'ú'], ['Ã½', 'ý'], ['Ã¤', 'ä'], ['Ã¥', 'å'],
  ['Å“', 'œ'], ['Å’', '’'], ['â€™', '’'], ['â€“', '–'], ['â€”', '—'], ['â€¦', '…'],
  ['â€œ', '“'], ['â€', '”'], ['â€', '"'], ['Â°', '°'], ['Â²', '²'], ['Â³', '³'], ['Â€', '€'],
  ['Â©', '©'], ['Â«', '«'], ['Â»', '»'], ['Ã ', 'à'], ['Â', ' '], ['â', 'à'], ['ï¿½', '’']
];

const files = walk(root);
let changed = 0;
for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let updated = content;
    for (const [from, to] of replacements) {
      updated = updated.split(from).join(to);
    }
    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      changed++;
      console.log('UPDATED', path.relative(root, file));
    }
  } catch (err) {
    // ignore unreadable files
  }
}
console.log('CHANGED', changed);
