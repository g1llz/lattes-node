const cors = require('cors');
const { scrape, scrapeNextPage, scrapeResume } = require('../service/scraping');

const routes = (app) => {
    
    // app.use(cors());
    // app.options('*', cors());

    app.get('/', (req, res) => {
        res.render('index.html');
    });

    app.post('/api/v1/search', async (req, res) => {
        const { search } = req.body;
        try {
            res.json(await scrape(search)
                .then((res) => res)
                .catch(err => console.log(err)));
        } catch (error) {
            res.json(404, error);
        }
    });
    
    app.post('/api/v1/next-page', async (req, res) => {
        const { url } = req.body;
        try {
            res.json(await scrapeNextPage(url)
                .then((res) => res)
                .catch(err => console.log(err)));
        } catch (error) {
            res.json(404, error);
        }
    });

    app.post('/api/v1/resume-detail', async (req, res) => {
        const { id } = req.body;
        console.log(id);
        try {
            res.json(await scrapeResume(id)
                .then((res) => res)
                .catch(err => console.log(err)));
        } catch (error) {
            res.json(404, error);
        }
    });
}

module.exports = routes;
