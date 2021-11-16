/**
 * server index
 */
import path from 'path';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../client/App';

const app = new Koa();

app.use(KoaStatic(path.join(__dirname, '..', 'client')))

app.use(async ctx => {
  if (ctx.request.url === '/') {
    ctx.body = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div id="root">${ReactDOMServer.renderToString(<App />)}</div>
        <script src="index.js"></script>
      </body>
    </html>
    `;
  }
});

app.listen(8080);

