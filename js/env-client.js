// Scrape env from dom
let scrapedEnv = JSON.parse(document.getElementById(`environment-variables`).textContent);

export default scrapedEnv;
