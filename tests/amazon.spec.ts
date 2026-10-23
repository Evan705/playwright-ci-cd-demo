import { test, expect } from '@playwright/test';

test('Amazon Web Page', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.amazon.com/');

    const all = await page.locator('#nav-main .nav-left #nav-hamburger-menu ').textContent();
    console.log(all);

    const allMenuItems = await page.locator('#nav-main .nav-fill .nav-a').allTextContents();
    const count = await page.locator('#nav-main .nav-fill .nav-a').count();
    console.log(allMenuItems);
    console.log(count);

    for(let i=0;i<count;i++)
    {
        if(allMenuItems[i]=="Prime Video")
        {
            
            await page.locator('#nav-main .nav-fill .nav-a').nth(i).click();
            console.log("clicked on Prime Video");
            await page.getByTestId('pv-nav-home-movies').click();
        }
    }

});