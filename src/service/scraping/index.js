const puppeteer = require('puppeteer');

const scrape = async (name) => {
    const data = [];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('http://buscatextual.cnpq.br/buscatextual/busca.do?metodo=apresentar');
    await page.waitForSelector('input[id=textoBusca]');
    await page.type('input[id=textoBusca]', name);
    await page.click('a[id=botaoBuscaFiltros]');
    await page.waitForSelector('div.resultado');

    const paginated = await page.$$eval('a[data-role=paginacao]', links => links.map(link => link.href));
    // console.log(paginated.length)
    // console.log(paginated)
    
    for (let i = 0; i < paginated.length/2; i++) {
        await page.goto(paginated[i], { waitUntil: "load" });
        
        const persons = await page.evaluate(() => {
            const nodeList = document.body.querySelectorAll('li');
            return Array.from(nodeList).map(item => ({
                name: item.querySelector('a').textContent,
                country: item.contains(item.querySelector('img')) ? 
                    item.querySelector('img').getAttribute('alt') : '',
                details: item.querySelector('a').getAttribute('href'),
                resume: item.innerText
            }));            
        });

        data.push(persons);

    }

    browser.close()

    return data;
}

module.exports = scrape;
