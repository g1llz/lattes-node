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

    const numRegisters = await page.$eval('div.tit_form b', element => element.innerText);
    const referenceURL = await page.$$eval('a[data-role=paginacao]', links => links.map(link => link.href)[0]);

    // console.log(numRegisters);
    // console.log(referenceURL);
    
    if (referenceURL) {
        const targetL = await _generateLinks(referenceURL, ~~numRegisters);
        // console.log(targetL);

        if (~~numRegisters <= 100) {

            await page.goto(referenceURL.replace('registros=0;10', `registros=0;${numRegisters}`), { waitUntil: "load" });
            data.push(await _content(page));
        
        } else {
            
            for (let i = 0; i < targetL.length; i++) {
                await page.goto(targetL[i], { waitUntil: "load" });
                data.push(await _content(page)); 
            };

        }

    } else {
        data.push(await _content(page))
    }

    browser.close()

    return data;
}


_content = async (context) => {
        
    return await context.evaluate(() => {
        const nodeList = document.body.querySelectorAll('li');
        return Array.from(nodeList).map(item => ({
            name: item.querySelector('a').textContent,
            country: item.contains(item.querySelector('img')) ? 
                item.querySelector('img').getAttribute('alt') : '',
            details: item.querySelector('a').getAttribute('href'),
            resume: item.innerText
        }));            
    });

}

_generateLinks = (referenceURL, numRegisters) => {
    let result = [];

    for (let x = 0; x < numRegisters; x+=10) {
        // console.log('x: ', x);
        x > 0 ? 
        result.push(referenceURL.replace(`registros=0;10`, `registros=${ x };10`)) :
        result.push(referenceURL);
    };

    return result;
}

module.exports = scrape;
