from pathlib import Path
import re

root = Path('.')
exts = {'.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.md', '.json', '.txt', '.jsonl'}
files = [p for p in root.rglob('*') if p.is_file() and p.suffix.lower() in exts and 'node_modules' not in str(p) and 'dist' not in str(p)]

replacements = [
    ('Ã©', 'é'), ('Ã¨', 'è'), ('Ãª', 'ê'), ('Ã¢', 'â'), ('Ã¶', 'ö'), ('Ã¼', 'ü'), ('Ã§', 'ç'),
    ('Ã±', 'ñ'), ('Ã£', 'ã'), ('Ã¯', 'ï'), ('Ã´', 'ô'), ('Ã»', 'û'), ('Ã¹', 'ù'), ('ÃŸ', 'ß'),
    ('Ã‰', 'É'), ('Ã€', 'À'), ('Ã‡', 'Ç'), ('ÃŒ', 'Î'), ('ÃŽ', 'Î'), ('Ã–', 'Ö'), ('Ãœ', 'Ü'),
    ('Ã ', 'à'), ('Ã¡', 'á'), ('Ã³', 'ó'), ('Ãº', 'ú'), ('Ã½', 'ý'), ('Ã¤', 'ä'), ('Ã¥', 'å'),
    ('Å“', 'œ'), ('Å’', '’'), ('â€™', '’'), ('â€“', '–'), ('â€”', '—'), ('â€¦', '…'),
    ('â€œ', '“'), ('â€', '”'), ('â€', '“'), ('Â°', '°'), ('Â²', '²'), ('Â³', '³'), ('Â€', '€'),
    ('Â©', '©'), ('Â«', '«'), ('Â»', '»'), ('Â', ' '),
]

changed = []
for path in files:
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        try:
            text = path.read_text(encoding='latin-1')
        except Exception:
            continue
    updated = text
    for old, new in replacements:
        updated = updated.replace(old, new)
    # Clean common broken sequences left after first pass
    updated = updated.replace('ï¿½', '’')
    updated = updated.replace('â', 'à')
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        changed.append(str(path))

print('CHANGED', len(changed))
for p in changed[:200]:
    print(p)
