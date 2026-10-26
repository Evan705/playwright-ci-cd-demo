import {test,expect} from '@playwright/test';
test("End to End Playwright Test", async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill("henryrichard@gmail.com");
    await page.locator("#userPassword").fill("Henryrichard123@");
    await page.getByRole('button',{name: 'Login'}).click();
})