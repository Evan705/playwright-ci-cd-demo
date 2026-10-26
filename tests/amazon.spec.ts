import { test, expect } from '@playwright/test';

// A program to validate the Alexa Speaker prices,
// which products have the price below 5000 and print the product names

test('Amazon Web Page', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.amazon.in/');

    const all = await page
        .locator('#nav-main .nav-left #nav-hamburger-menu')
        .textContent();

    console.log(all);

    const count = await page.locator('.nav-ul .nav-li .nav-a').count();

    for (let i = 0; i < count; i++) {
        console.log( "The Menu Items : " + 
            await page.locator('.nav-ul .nav-li .nav-a').nth(i).textContent()
        );
    }

    await page.getByPlaceholder('Search Amazon.in').pressSequentially('Alexa');

    const firstSearchOption = await page.locator('.left-pane-results-container .s-suggestion').first().textContent();

    console.log("firstSearchOption : " + firstSearchOption);

    await page.getByRole('button',{name : 'alexa speaker'}).click();

    await page.waitForLoadState('load');

    const countOfItems = await page.locator("div[role='listitem'] .sg-col-inner").count();
    console.log("Total Products Found: " + countOfItems);

    for (let i = 0; i < countOfItems; i++) {

        const product = page.locator("div[role='listitem'] .sg-col-inner").nth(i);

        const productName = await product.locator('h2.a-size-medium span').textContent().catch(()=>null);

        const price = await product.locator('.a-price-whole').textContent().catch(()=>null);

        if (productName && price) {

            const priceNumber = Number(
                price.replace(/[^0-9]/g, '')
            );

            if (priceNumber < 5000) {
                console.log(
                    `Product: ${productName.trim().split(/[,|]/)[0]} | Price: ₹${priceNumber}`
                );
            }
        }
    }
});