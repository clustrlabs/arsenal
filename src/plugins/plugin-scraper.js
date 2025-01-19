const { Skill } = require("../main");
const puppeteer = require("puppeteer");

const scrape_website_url = new Skill({
    name: "scrape_website_url",
    task: "Scrape the web page at a given URL",
    schema: {
        type: "object",
        properties: {
            url: {
                type: "string",
                description: "The URL of the page to scrape"
            }
        },
        required: ["url"],
        additionalProperties: false
    }
}, async ({ url }) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();

    await page.goto(url);

    const data = await page.evaluate(function() {
        const html = document.querySelector("html").innerHTML;

        return html;
    });
    
    await browser.close();

    return data;
}, {
    name: "pageData",
    type: "string"
});

module.exports = {
    scrape_website_url
};
