import express from 'express';
import ew from 'express-ws';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { log, getRecordJson } from './log.js';

const app = express();
const expressWs = ew(app);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.ws('/log', (ws, req) => {
    console.log("connected");
    ws.send(getRecordJson());

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
});

app.use((req, res, next) => {
    if (!req.url.startsWith('/socket.io')) {
        const records = log(req);
       // console.log(expressWs.getWss().clients.size);
        setTimeout(() => expressWs.getWss().clients.forEach(o => o.send(records)));
    }
    next();
});

app.use((req, res, next) => {
    res.set('Set-Cookie', ['strict=1; SameSite=Strict', 'lax=1; SameSite=Lax',
        'default=1', 'none=1; SameSite=None; Secure']);
    res.set('Access-Control-Allow-Origin','*');    
    next();
});
const baseDir = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(baseDir, 'public')));
app.set('views', join(baseDir, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//app.use(logger(':method :url'))


 
app.all('/fetch', (req, res) => {
    res.send({ data: 'ok' });
});

app.all('/', (req, res) => {

    res.render('index', {
        body: JSON.stringify(req.body ?? ''),
        cookies: JSON.stringify(req.cookies ?? ''),

    });
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})