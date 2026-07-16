import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('UNHANDLED EXCEPTION:', err.toString());
  });
  
  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });
  try {
    await page.goto('http://localhost:5175', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000));
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log('HTML CONTENT:', html);
    console.log('Test complete');
  } catch (err) {
  }
  await browser.close();
})();
