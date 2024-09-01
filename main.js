const puppeteer=require('puppeteer');

let scroller=async()=>{
    let browser=await puppeteer.launch({headless:false});
    let page =await browser.newPage();


    await page.goto('https://www.instagram.com/');


    


    




}



scroller();