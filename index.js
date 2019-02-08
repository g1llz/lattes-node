const express = require('express');
const app = express();
const scrape = require('./src/service/scraping');

app.get('/', async (req, res) => {
    try {
        res.json(await scrape()
            .then((res) => res)
            .catch(err => console.log(err)));
    } catch (error) {
        res.json(404, error);
    }
});

app.listen(3020, () => console.log('listening on port 3020')); 