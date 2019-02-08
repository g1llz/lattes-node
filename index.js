const express = require('express');
const app = express();
const scrape = require('./src/service/scraping');

app.get('/search/:name', async (req, res) => {
    const { name } = req.params
    try {
        res.json(await scrape(name)
            .then((res) => res)
            .catch(err => console.log(err)));
    } catch (error) {
        res.json(404, error);
    }
});

app.listen(3000, () => console.log('listening ...')); 