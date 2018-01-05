const fs = require('fs');
const Koa = require('koa');
var Router = require('koa-router');
const serve = require('koa-static');
const koaBody = require('koa-body');
const app = new Koa();
const router = new Router();

app.use(koaBody());

// $ GET /package.json
app.use(serve('./public'));

router.get('/sub', (ctx, next) => {
    ctx.body = 'Hello World';
});

router.post('/report/*', (ctx, next) => {
    ctx.body = 'OK';
    const reports = JSON.parse(fs.readFileSync('./data/report.json', {
        encoding: 'utf8',
    }));
    const report = JSON.parse(ctx.request.body);

    const hasReport = reports.find(item => {
        if (item.isAsync === report.isAsync &&
                item.isWait === report.isWait &&
                item.type === report.type &&
                item.userAgent === report.userAgent) {
            return true;
        }
        return false;
    });
    if (!hasReport) {
        reports.push(report);
        fs.writeFileSync('./data/report.json', JSON.stringify(reports), {
            encoding: 'utf8',
        });
    }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

console.log('listening on port 3000');
