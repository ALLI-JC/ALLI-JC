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
  ['é', 'é'], ['è', 'è'], ['ê', 'ê'], ['à', 'à'], ['ö', 'ö'], ['ü', 'ü'], ['ç', 'ç'],
  ['ñ', 'ñ'], ['ã', 'ã'], ['ï', 'ï'], ['ô', 'ô'], ['û', 'û'], ['ù', 'ù'], ['ß', 'ß'],
  ['É', 'É'], ['À', 'À'], ['Ç', 'Ç'], ['Î', 'Î'], ['Ö', 'Ö'], ['Ü', 'Ü'], ['à', 'à'],
  ['á', 'á'], ['ó', 'ó'], ['ú', 'ú'], ['ý', 'ý'], ['ä', 'ä'], ['å', 'å'],
  ['œ', 'œ'], ['’', '’'], ['’', '’'], ['–', '–'], ['—', '—'], ['…', '…'],
  ['“', '“'], ['”', '”'], ['"', '"'], ['°', '°'], ['²', '²'], ['³', '³'], ['€', '€'],
  ['©', '©'], ['«', '«'], ['»', '»'], ['à', 'à'], [' ', ' '], ['à', 'à'], ['’', '’']
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
