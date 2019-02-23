const cors = require('cors');
const run = require('../service/scraping');

const routes = app => {
    
    // app.use(cors());
    // app.options('*', cors());

    app.get('/', (req, res) => {       
        res.render('index.html');
    });

    app.post('/api/v1/search', async (req, res) => {
        const { search } = req.body;
        try {
            res.json(await run.scrape(search)
                .then((res) => {
                    return res;
                })
                .catch(err => console.log(err)));
        } catch (error) {
            res.status(404).json(error);
        }
    });
    
    app.post('/api/v1/next-page', async (req, res) => {
        const { url } = req.body;
        try {
            res.json(await run.scrapeNextPage(url)
                .then((res) => res)
                .catch(err => console.log(err)));
        } catch (error) {
            res.status(404).json(error);
        }
    });

    app.post('/api/v1/resume-detail', async (req, res) => {
        const { id } = req.body;
        console.log(id);
        try {
            res.json(await run.scrapeResume(id)
                .then((res) => res)
                .catch(err => console.log(err)));
        } catch (error) {
            res.status(404).json(error);
        }
    });
    
}

module.exports = routes;
