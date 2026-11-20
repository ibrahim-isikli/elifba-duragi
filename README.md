# Elifba Durağı

Çocuklar için Kur'an okumaya hazırlık uygulaması (deneme sürümü). Telefona kurulabilir ve internetsiz çalışır.

**Dersler:** Harfler (4 ders) · Lamelif · Noktalı kardeşler · Harflerin şekilleri · Üstün · Esre · Ötre · Tenvin · Cezm · Şedde · Med.
Her durakta önce kartlarla tanışılır, sonra kısa bir oyun oynanır; yıldız kazanılınca sonraki durak açılır.

## Deneme sürümü notları

- **Sesler geçici:** cihazın konuşma motoru kullanılıyor. Gerçek uygulamada mahreci doğru, kayıtlı ses kullanılmalı.
- **Okunuşlar** Türkiye'deki elifba geleneğine göre: ince harfler e‑i‑ü, kalın harfler (ح خ ص ض ط ظ ع غ ق) a‑ı‑u ile; Ra üstün ve ötrede kalın, esrede ince.
- **İçerik bir hoca tarafından kontrol edilmedi.** Yayından önce gözden geçirilmeli.
- İlerleme yalnızca cihazın tarayıcısında saklanır.

## Dosyalar

| Yol | Ne |
|---|---|
| `kaynak/elifba-duragi.html` | Uygulamanın kaynağı (tek dosya) |
| `build.py` | `index.html` ve `sw.js` dosyalarını üretir: `python3 build.py` |
| `fonts/` | Yerel fontlar (Baloo 2, Nunito, Scheherazade New; SIL Open Font License 1.1). Yeniden indirmek için: `python3 araclar/fontlari_indir.py` |
| `icons/` | Uygulama ikonları. Yeniden çizmek için: `node araclar/ikonlar.js` |

Kaynakta değişiklik yaptıktan sonra `python3 build.py` çalıştırılır; service worker sürümü kendiliğinden değişir.
