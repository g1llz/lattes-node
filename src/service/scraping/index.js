const puppeteer = require('puppeteer');

const scrape = async (search) => {   
    const { page, browser } = await _init();

    await page.goto('http://buscatextual.cnpq.br/buscatextual/busca.do?metodo=apresentar');

    // if true search by subject (title or key word); if false search only by name
    search.searchFor == 2 && await page.click('input[id=buscaAssunto]');

    await page.waitForSelector('input[id=textoBusca]');
    await page.type('input[id=textoBusca]', search.term);
    
    // if true search in all bases; if false search only PhDs
    search.whichBase == 2 && await page.click('input[id=buscarDemais]');
    
    await page.click('a[id=botaoBuscaFiltros]');
    await page.waitForSelector('div[class=resultado]');

    const numRegisters = await page.$eval('div.tit_form b', element => element.innerText);
    const referenceURL = await page.$$eval('a[data-role=paginacao]', links => links.map(link => link.href)[0]);

    // console.log(numRegisters);
    // console.log(referenceURL);
    let result;
    
    if (referenceURL) {
        const targetList = await _generateLinks(referenceURL, ~~numRegisters);

        await page.goto(targetList[0], { waitUntil: 'load' });
        result = { persons: await _content(page), pages: targetList };
        
    } else {
        result = { persons: await _content(page) };
    }

    browser.close();

    return result;
}

const scrapeNextPage = async (url) => {
    // const persons = [];
    const { page, browser } = await _init();

    await page.goto(url, { waitUntil: 'load' });
    let result = await _content(page);

    browser.close();

    return { persons: result };

}

const _init = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    return { page, browser };
}

const _content = async (context) => {
        
    return await context.evaluate(() => {
        const nodeList = document.body.querySelectorAll('li');
        return Array.from(nodeList).map(item => {

            const data = item.querySelector('a');
            const href = data.getAttribute('href');
            return {
                name: data.textContent,
                country: item.contains(item.querySelector('img')) ? 
                    item.querySelector('img').getAttribute('alt') : '',
                link: `http://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=${ href.slice(24, href.indexOf(',')-1) }`,
                resume: (item.innerText).split('\n').filter(Boolean)
            };
        });            
    });

}

const _generateLinks = (referenceURL, numRegisters) => {
    let result = [];

    for (let x = 0; x < numRegisters; x+=20) {
        // console.log('x: ', x);
        result.push(referenceURL.replace(`registros=0;10`, `registros=${ x };20`));
    };

    return result;
}

module.exports = { scrape, scrapeNextPage };
