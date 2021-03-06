const express        = require('express'),
      bodyParser     = require('body-parser'),
      MostWatchedDao = require('./most_watched/MostWatchedDao'),

      app            = express(),
      port           = process.env.PORT || 3000;

//basic setup
app.use(bodyParser.urlencoded({extended: true}));   //For parsing POST requests
app.use('/assets', express.static(`${__dirname}/public`));
app.use(express.static(__dirname + '/public'));


app.use(
    (req,res,next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");
        res.set("Content-Type", "application/json");
        next();
    });

//Define routes and behaviour of the WS
//===========================================================
app.all('/', (req, res) => res.sendFile(`assets/`));

app.get('/getAllMostWatched', (req, res) => {
    console.log('GET request: /getAllMostWatched');
    MostWatchedDao.getAllMostWatched()
                  .then(  docs => res.json(docs))
});

app.post('/getMostWatchedById', (req, res) => {
    console.log('POST request: /getMostWatchedById');
    MostWatchedDao.getMostWatchedById(+req.body.id)
                  .then( doc => res.json(doc));
});

app.get('/getMostWatchedByLimit', (req, res) => {
    console.log('GET request: /getMostWatchedByLimit');
    let min = req.query.min === undefined ? 0 : +req.query.min,
        max = req.query.max === undefined ? Number.MAX_SAFE_INTEGER : +req.query.max;
    MostWatchedDao.getMostWatchedByLimit(min, max)
                  .then( docs => res.json(docs));
});

app.get('/getMostWatchedByLanguage', (req, res) => {
    console.log('GET request: /getMostWatchedByLanguage');
    MostWatchedDao.getMostWatchedByLanguage(req.query.lang)
                  .then( docs => res.json(docs));
});

app.all('*', (req, res) => res.redirect('/assets/error.html'));
//===========================================================


app.listen(port, () => console.log(`Server is listening on ${port}`));