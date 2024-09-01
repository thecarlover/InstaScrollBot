require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

const COOKIES_FILE_PATH = 'cookies.json';

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Restore session if cookies file exists
        if (fs.existsSync(COOKIES_FILE_PATH)) {
            const cookiesString = fs.readFileSync(COOKIES_FILE_PATH);
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
            console.log('Session restored from cookies.');
        }

        await page.goto('https://www.instagram.com/');

        // Check if logged in by waiting for a specific element
        try {
            await page.waitForSelector('input[name="username"]', { timeout: 5000 });
            console.log('Not logged in. Logging in now...');
            await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME);
            await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
            await page.click('button[type="submit"]');
            await page.waitForNavigation();
            const cookies = await page.cookies();
            fs.writeFileSync(COOKIES_FILE_PATH, JSON.stringify(cookies, null, 2));
            console.log('Session cookies saved.');
        } catch (error) {
            console.log('Already logged in or another issue.');
        }

        await page.goto('https://www.instagram.com/reels/');

        // Scroll through reels
        for (let i = 0; i < 20; i++) {
            await page.keyboard.press('ArrowDown');
            await new Promise(resolve => setTimeout(resolve, 30000)); // Use Promise for delay
        }

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
