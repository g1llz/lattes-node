const puppeteer = require('puppeteer');
const setBaseUrl = require('./helper/base-url');

const scrape = async (search) => {   
    const { page, browser } = await _init();
    
    await page.goto(await setBaseUrl(search));
    await page.waitForSelector('div[class=resultado]');

    const numRegisters = await page.$eval('div.tit_form b', element => element.innerText);
    const referenceURL = await page.$$eval('a[data-role=paginacao]', links => links.map(link => link.href)[0]);

    // console.log(numRegisters);
    // console.log(referenceURL);
    let result;
    
    if (referenceURL) {
        const targetList = await _generateLinks(referenceURL, ~~numRegisters);

        await page.goto(targetList[0], { waitUntil: 'load' });
        result = { total: numRegisters, persons: await _content(page), pages: targetList };
        
    } else {
        if (isNaN(numRegisters)) { 
            result = { total: '0', persons: [] };
        } else {
            result = { total: numRegisters, persons: await _content(page) };
        }
    }

    browser.close();

    return result;
}

const scrapeNextPage = async (url) => {
    const { page, browser } = await _init();

    await page.goto(url, { waitUntil: 'load' });
    let result = await _content(page);

    browser.close();

    return { persons: result };

}

const scrapeResume = async (id) => {
    const { page, browser } = await _init();
    const url = `http://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=${ id }`;

    await page.goto(url, { waitUntil: 'load' });
    await page.waitForSelector('div[class=layout-cell-pad-main]');
    
    let result = await _contentResume(page);

    browser.close();

    return { person: result };
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
                    item.querySelector('img').getAttribute('src') : '',
                lattesId: href.slice(24, href.indexOf(',')-1),
                resume: (item.innerText).split('\n').filter(Boolean)
            };
        });            
    });

}

const _contentResume = async (context) => {

    const targets = ['Identificação', 'Endereço', 'Linhas de pesquisa', 'Áreas de atuação'];

    return (await context.evaluate(() => {
        const main = document.body.querySelector('.layout-cell-pad-main');
        const nodeList = main.querySelectorAll('div[class=title-wrapper]');
        return Array.from(nodeList).map(item => {

            let data = item.querySelector('.data-cell');
            let cell = data ? data.querySelectorAll('.layout-cell-pad-5') : []; 
            
            return {
                section: item.querySelector('a') ? item.querySelector('a').innerText : '',
                dataCell: Array.from(cell).map(item => item.innerText)
            }
        });     
    })).filter(item => targets.includes(item.section));    

}
 
// (xyz.map((item, i) => {
//     if (i%2==0) {
//         return {[item]: xyz[i+1]}	
//     }
// })).filter(item => item)

const _generateLinks = (referenceURL, numRegisters) => {
    let result = [];

    for (let x = 0; x < numRegisters; x+=20) {
        // console.log('x: ', x);
        result.push(referenceURL.replace(`registros=0;10`, `registros=${ x };20`));
    };

    return result;
}

module.exports = { scrape, scrapeNextPage, scrapeResume };
