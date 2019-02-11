const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { scrape, scrapeNextPage } = require('./src/service/scraping');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/v1/search', async (req, res) => {
    const { search } = req.body
    try {
        res.json(await scrape(search)
            .then((res) => res)
            .catch(err => console.log(err)));
    } catch (error) {
        res.json(404, error);
    }
});

app.post('/api/v1/next-page', async (req, res) => {
    const { url } = req.body
    try {
        res.json(await scrapeNextPage(url)
            .then((res) => res)
            .catch(err => console.log(err)));
    } catch (error) {
        res.json(404, error);
    }
});

app.listen(3000, () => console.log('listening ...')); 