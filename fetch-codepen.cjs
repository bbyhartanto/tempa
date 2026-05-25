const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://codepen.io/GreenSock/pen/XWzRraJ', { waitUntil: 'networkidle2' });
    
    // Wait for the JS editor to load, or just extract the iframe content if possible
    // Codepen has `#box-js` for JS editor if not in full view, but wait, it's easier to just grab the iframe's script tags if it's the result view
    
    // Let's try to get the JS from the pen's source
    const result = await page.evaluate(() => {
        // Look for the script tags in the iframe
        const iframe = document.querySelector('#result');
        if (iframe) {
            return iframe.src;
        }
        return 'No iframe found';
    });
    console.log("Iframe src:", result);

    if (result && result.startsWith('http')) {
        await page.goto(result, { waitUntil: 'networkidle2' });
        const html = await page.content();
        console.log(html.substring(0, 5000)); 
    }

    await browser.close();
})();
