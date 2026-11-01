// Vérifie sur le site EN LIGNE que l'écran de séance tient dans la hauteur de plusieurs
// téléphones (pas d'ascenseur) : au tambour, à la coupe, après une erreur, et quand la phrase est réussie.
// Vérifie aussi qu'il n'y a aucune erreur dans la console.
// Usage : node tests/telephone.cjs [url]   (captures dans captures/)
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2] || 'https://lechampdelaurore-boop.github.io/couper-les-mots/';
const SIZES = [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844], [412, 780], [430, 932]];
const expectedCache = (fs.readFileSync('sw.js', 'utf8').match(/couper-les-mots-v\d+/) || [])[0];

(async () => {
  fs.mkdirSync('captures', { recursive: true });
  // Attendre que GitHub Pages serve bien la version du dépôt (même CACHE que sw.js).
  if (/^https:/.test(URL)) {
    for (let i = 0; ; i++) {
      const live = await fetch(URL + 'sw.js?nocache=' + Date.now()).then(r => r.text()).catch(() => '');
      if (live.includes(expectedCache)) { console.log('Version en ligne : ' + expectedCache); break; }
      if (i >= 18) { console.log('Version en ligne différente de ' + expectedCache + ' après 3 min'); process.exit(1); }
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  const browser = await chromium.launch();
  const lines = ['| Écran | Tambour | Coupe | Après erreur | Réussie | Console |', '|---|---|---|---|---|---|'];
  let failed = false;
  for (const [w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    // Niveau 3 (phrases longues) : le cas le plus serré.
    await page.addInitScript(() => {
      localStorage.setItem('marc.couper.prefs', JSON.stringify({ sound: false, anim: false, voice: false }));
      localStorage.setItem('marc.couper.prog', JSON.stringify({ level: 3 }));
    });
    await page.goto(URL + '?nocache=' + Date.now());
    await page.evaluate(() => document.fonts.ready);
    const over = () => page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await page.tap('#startBtn');
    await page.waitForSelector('#drum');
    const st = await page.evaluate(() => { const g = window.__couper.state(); return { n: g.cur.p.counts[0], cuts: Object.keys(g.cur.p.cuts).map(Number) }; });
    for (let k = 0; k < st.n; k++) await page.tap('#drum');
    const drum = await over();
    await page.screenshot({ path: `captures/${w}x${h}-tambour.png` });
    await page.tap('[data-act="drumDone"]');
    await page.waitForSelector('#glued .l', { timeout: 5000 });
    await page.waitForTimeout(200);
    const cut = await over();
    await page.screenshot({ path: `captures/${w}x${h}-coupe.png` });
    const wrong = [1, 2, 3].find(k => !st.cuts.includes(k));
    await page.evaluate(k => window.__couper.cutAt(k), wrong);
    await page.waitForTimeout(300);
    const err = await over();
    await page.screenshot({ path: `captures/${w}x${h}-erreur.png` });
    for (const k of st.cuts) await page.evaluate(k => window.__couper.cutAt(k), k);
    await page.waitForSelector('#solvedTxt', { timeout: 3000 }).catch(() => errors.push('phrase pas résolue'));
    const ok = await over();
    await page.screenshot({ path: `captures/${w}x${h}-reussie.png` });
    const cell = d => (d > 0 ? `❌ dépasse de ${d} px` : '✅');
    if (drum > 0 || cut > 0 || err > 0 || ok > 0 || errors.length) failed = true;
    lines.push(`| ${w}×${h} | ${cell(drum)} | ${cell(cut)} | ${cell(err)} | ${cell(ok)} | ${errors.length ? '❌ ' + errors.join(' ; ') : '✅'} |`);
    await page.close();
  }
  await browser.close();
  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Test téléphone (site en ligne)\n\n' + report + '\n');
  process.exit(failed ? 1 : 0);
})();
