// Writes hoca-kontrol-listesi.md from the app's own data (so the list always matches the app).
// Run after build: node araclar/kontrol_listesi.js   (needs Playwright)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+root+'/index.html');await p.waitForTimeout(300);
const md=await p.evaluate(()=>{
 const o=[];const row=a=>o.push('| '+a.join(' | ')+' |');const head=(...h)=>{row(h);row(h.map(()=>'---'))};const ok='☐';
 o.push('# Elifba Durağı: içerik kontrol listesi','',
  'Bu liste uygulamadaki bütün Arapça içeriği ve okunuşları gösterir. Liste uygulamanın kendi verisinden üretilir.','',
  '**Nasıl kullanılır:** Doğru olan satırın sonundaki ☐ işaretini ☑ yapın. Yanlış olan satırda doğrusunu yanına yazın.','',
  '## Uygulamada verilen kararlar','',
  'Bu kararların her biri bir hocanın onayını bekliyor.','',
  '1. Okunuşlar Türkiye\'deki elifba geleneğine göre yazıldı: ince harfler e‑i‑ü, kalın harfler a‑ı‑u ile okunur. ☐',
  '2. Kalın sayılan harfler: '+LETTERS.filter(l=>l.k).map(l=>l.c+' ('+l.n+')').join(', ')+'. ☐',
  '3. Ra üstün ve ötrede kalın (ra, ru), esrede ince (ri) okunur. ☐',
  '4. Ayn okunuşta kesme işaretiyle gösterilir (’a, ’ı, ’u). ☐',
  '5. Tenvin harf üzerinde tek başına gösterilir (بً “ben”). İki üstünün Elif\'le yazılışı (بًا) henüz yok. ☐',
  '6. Med harfleri (Elif, Ye, Vav) cezmsiz yazıldı. Uzun okunuş â, î, û ile gösterilir; kalın harflerde de aynı işaretler kullanılır (قِي “kî”). ☐',
  '7. Rastgele cezm ve şedde sorularında yalnızca ince harfler kullanılır (kalın harf, Ra, Elif, Vav, Ye ve Ayn dışarıda). ☐',
  '8. Kelime okumada yalnızca bütün harfleri ince olan kelimeler var. Karışık kelimelerde (خَلَقَ “halaka”, قَلَمٌ “kalem”) Türkçe okunuş tutarsız olduğu için bunlar eklenmedi. ☐',
  '9. Sesler şu an cihazın konuşma motoruyla çalıyor ve Arapça söylüyor (بَ için “ba”). Gerçek uygulamada kayıtlı ses kullanılacak. ☐','');
 o.push('## 1. Harfler','');head('Sıra','Harf','Adı','Okunuş','Tek','Başta','Ortada','Sonda','Kontrol');
 LETTERS.forEach(l=>{const f=forms(l);row([l.i+1,l.c,l.n,l.c==='ر'?'üstün ve ötrede kalın, esrede ince':l.k?'kalın':'ince',...f.map((g,i)=>(!l.j&&i===1)?g+' (bitişmez)':g),ok])});
 o.push('','## 2. Lamelif','');head('Yazılış','Adı / okunuş','Kontrol');
 row([LA.c,'Lamelif',ok]);row([T+LA.c,'Lamelif, sonda (sonraki harfe bitişmez)',ok]);row(['ل'+HAREKE[0].m,'le (kısa)',ok]);row(['ل'+HAREKE[0].m+'ا','lâ (Elif sesi uzatır)',ok]);
 o.push('','## 3. Noktalı kardeşler','');head('Harf','Adı','Noktası','Kontrol');
 SIBS.flat().forEach(c=>row([c,BYC[c].n,dotWhere(c),ok]));
 o.push('','## 4. Harekeli heceler','');head('Harf','Üstün','Esre','Ötre','Kontrol');
 LETTERS.forEach(l=>row([l.c+' '+l.n,...[0,1,2].map(h=>l.c+HAREKE[h].m+' '+reading(l,h)),ok]));
 o.push('','## 5. Tenvin','');head('Harf','İki üstün','İki esre','İki ötre','Kontrol');
 TN_BASE.forEach(l=>row([l.c+' '+l.n,...[0,1,2].map(h=>tnWord(l,h)+' '+tnRead(l,h)),ok]));
 o.push('','## 6. Cezm','','Örnekler:','');head('Yazılış','Okunuş','Kontrol');CZ_EX.forEach(x=>row([czWord(...x),czRead(...x),ok]));
 o.push('','Oyunda rastgele kurulan kelimelerde cezmli harf yalnızca şu harflerden seçilir: '+CZ_SAKIN.join(' ')+'. Örnek: '+czWord('ك',0,'ب')+' '+czRead('ك',0,'ب')+', '+czWord('ف',2,'ت')+' '+czRead('ف',2,'ت')+'.');
 o.push('','## 7. Şedde','');head('Yazılış','Heceler','Okunuş','Kontrol');SD_EX.forEach(x=>row([sdWord(...x),czRead(x[0],x[1],x[2])+' + '+reading(BYC[x[2]],x[3]),sdRead(...x),ok]));
 o.push('','## 8. Med','');head('Harf','Üstün + Elif','Esre + Ye','Ötre + Vav','Kontrol');
 MD_BASE.forEach(l=>row([l.c+' '+l.n,...[0,1,2].map(h=>mdWord(l,h)+' '+mdRead(l,h)),ok]));
 o.push('','## 9. Kelime okuma','','Okunuşlar kelimenin yazılışından kurallarla hesaplanır.','');
 [['Kelime okuma 1',WORDS.K1],['Kelime okuma 2',WORDS.K2],['Son kart (İhlâs suresinden)',[AYET]]].forEach(([t,ws])=>{o.push('### '+t,'');head('Yazılış','Heceler','Okunuş','Kontrol');
  ws.forEach(w=>{const ts=parseW(w);row([arW(ts),hecW(ts).replace(/  /g,' / '),readW(ts),ok])});o.push('')});
 return o.join('\n')+'\n'});
fs.writeFileSync(path.join(root,'hoca-kontrol-listesi.md'),md);console.log('hoca-kontrol-listesi.md:',md.split('\n').length,'satır');await b.close()})();
