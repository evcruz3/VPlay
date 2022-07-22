const config = require('./common/config/env.config.js');
const https = require('https');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const app = express();

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');
const EventsRouter = require('./events/routes.config')

app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});


app.use(express.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
EventsRouter.routesConfig(app);

const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
  }

https.createServer(httpsOptions, app).listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
