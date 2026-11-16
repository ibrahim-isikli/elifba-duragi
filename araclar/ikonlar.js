// Draws the app icons with the app's own Arabic font. Run: node araclar/ikonlar.js (needs Playwright)
const {chromium}=require('playwright');const path=require('path');const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch();
const draw=async(size,pad,file)=>{const p=await b.newPage({viewport:{width:size,height:size}});
 await p.setContent(`<style>@font-face{font-family:S;src:url(file://${root}/fonts/ScheherazadeNew-700-arabic.woff2)}
 html,body{margin:0;width:${size}px;height:${size}px;background:#0B7A77;overflow:hidden}
 .t{position:absolute;inset:${pad}px;border-radius:${size*.09}px;border:${Math.max(2,size*.018)}px dotted rgba(255,255,255,.45)}
 .g{position:absolute;inset:0;display:grid;place-items:center;font-family:S;color:#fff;font-size:${size*.62}px;line-height:1;padding-bottom:${size*.2}px;box-sizing:border-box}
 .s{position:absolute;right:${size*.22}px;top:${size*.2}px;width:${size*.13}px;height:${size*.13}px;color:#F2B705}</style>
 <div class="t"></div><div class="g">ب</div>
 <svg class="s" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z"/></svg>`,{waitUntil:'load'});
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:path.join(root,'icons',file)});await p.close()};
await draw(512,40,'icon-512.png');await draw(192,15,'icon-192.png');await draw(180,14,'apple-touch-icon.png');await draw(512,70,'maskable-512.png');
await b.close();console.log('ikonlar hazır')})();
