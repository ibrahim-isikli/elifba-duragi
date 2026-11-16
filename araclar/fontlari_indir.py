#!/usr/bin/env python3
"""Downloads the app's fonts (all SIL Open Font License 1.1) into fonts/ so the PWA works offline.
Keeps only the subsets the app needs (Turkish: latin + latin-ext, Arabic: arabic). Run once: python3 araclar/fontlari_indir.py"""
import pathlib, re, urllib.request
here = pathlib.Path(__file__).resolve().parent.parent
out = here / 'fonts'; out.mkdir(exist_ok=True)
URL = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700;800&family=Scheherazade+New:wght@400;700&display=swap'
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'}
css = urllib.request.urlopen(urllib.request.Request(URL, headers=UA)).read().decode()
keep = {'latin', 'latin-ext', 'arabic'}
blocks = re.findall(r'/\* ([\w-]+) \*/\s*(@font-face \{.*?\})', css, re.S)
res = []
for subset, block in blocks:
    fam = re.search(r"font-family: '([^']+)'", block).group(1)
    if subset not in keep: continue
    if fam == 'Scheherazade New' and subset == 'latin-ext': continue
    url = re.search(r'url\((https://[^)]+)\)', block).group(1)
    w = re.search(r'font-weight: (\d+)', block).group(1)
    name = f"{fam.replace(' ', '')}-{w}-{subset}.woff2"
    (out / name).write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read())
    res.append(block.replace(url, name))
(out / 'fonts.css').write_text('/* Baloo 2, Nunito, Scheherazade New: SIL Open Font License 1.1 (https://openfontlicense.org) */\n' + '\n'.join(res) + '\n', encoding='utf8')
print(len(res), 'font dosyası,', sum(f.stat().st_size for f in out.glob('*.woff2')) // 1024, 'KB')
