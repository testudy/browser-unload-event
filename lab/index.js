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
router.get('/report', (ctx, next) => {
    const reports = JSON.parse(fs.readFileSync('./data/report.json', {
        encoding: 'utf8',
    }));

    /*
    const actions = reports.map(item => item.action).reduce((accumulator, value) => {
        if (accumulator.indexOf(value) === -1) {
            accumulator.push(value);
        }
        return accumulator;
    }, []).sort();
    */
    const actions = [ "anchor", "anchor.click", "custom:", "document.write", "form.onsubmit", "form.submit", "javascript:", "location.href", "location.reload", "location.replace", "mailto:", "reload", "window.close", "window.open", "window.open_self"];

    const data = {};

    reports.forEach((item) => {
        const group = `${item.type}+${item.isAsync}+${item.isWait}`;
        if (!data[group]) {
            data[group] = {};
        }
        if (!data[group][item.userAgent]) {
            data[group][item.userAgent] = {
            };
        }
        data[group][item.userAgent][item.action] = 1;
    });

    for (let group in data) {
        for (let ua in data[group]) {
            const actionMap = data[group][ua];
            const actionArray = [];
            actions.forEach((action) => {
                actionArray.push(actionMap[action] || '');
            });
            data[group][ua] = actionArray;
        }
    }

    let html = '';
    for (const group in data) {
        html += '<h3>' + group + '</h3>';
        html += '<table>';
        html += '<tr><td></td>';
            actions.forEach((action) => {
                html += '<td>' + action + '</td>';
            });
        html += '</tr>';
        for (const row in data[group]) {
            html += '<tr>';
            html += '<td>' + row + '</td>';
            data[group][row].forEach((result) => {
                html += '<td>' + (result ? 'Y' : 'N') + '</td>';
            });
            html += '</tr>';
        }
        html += '</table>';

    }

    ctx.type = 'html';
    ctx.body = html;
});

router.post('/report/*', (ctx, next) => {
    ctx.body = 'OK';
    const reports = JSON.parse(fs.readFileSync('./data/report.json', {
        encoding: 'utf8',
    }));
    const report = JSON.parse(ctx.request.body);
    console.log(report);

    const hasReport = reports.find(item => {
        if (item.isAsync === report.isAsync &&
                item.isWait === report.isWait &&
                item.action === report.action &&
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
