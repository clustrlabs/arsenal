# Web Scraper

This AI agent is equipped with a Puppeteer-powered web scraper.

Advanced workflows often require real-time access to the internet, and this `scrape_website_url` serves as a great starting point to build an AI agent capable of headless headless automation.

## web-scraper.js

```js
const { Swarm, Skill } = require("@clustr/arsenal");
const puppeteer = require("puppeteer");

async function main() {
    const { Agent } = new Swarm();

    const agent = new Agent();
    
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
        name: "innerHTML",
        type: "string"
    });

    const { error, data } = await agent.do("Visit wikipedia", [
        scrape_website_url
    ]);

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }

    return;
}

main().catch(console.error);
```
