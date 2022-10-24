require('dotenv').config();

const fs = require('fs');
const Datastore = require('nedb');
const bodyParser = require('yion-body-parser');
const { createApp, createServer } = require('yion');

const app = createApp();
const server = createServer(app, [bodyParser]);
const port = process.env.NODE_PORT || 8080;
const config = {
    host: process.env.HOST_ENV || ('http://localhost:' + port),
};

app.link('/svg', __dirname + '/public/svgs');
app.link('/modules', __dirname + '/node_modules');
app.link('/static', __dirname + '/build/static');
app.link('/templates', __dirname + '/public/templates');
app.link('/images', __dirname + '/public/images');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html', 'index.html', 'text/html', false);
});

app.get('/icons', (req, res) => {
    let result = {};
    const folders = fs.readdirSync(__dirname + '/public/svgs');

    folders.forEach(folder => {
        result[folder] = [];
        result[folder] = fs.readdirSync(`${__dirname}/public/svgs/${folder}`);
    });

    res.json(result);
});

const db = {
    badges: new Datastore({ filename: __dirname + '/data/badges.db', autoload: true }),
    issuers: new Datastore({ filename: __dirname + '/data/issuers.db', autoload: true })
};

require('./src/api/badges')(app, db,config);
require('./src/api/issuers')(app, db, config);

server.listen(port).on('listening', () => console.log(`🌏  Server start on port ${port}`));
