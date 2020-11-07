import Router from '@koa/router';

const router = new Router();

router.get('/health', (ctx, next) => {
    ctx.body = 'OK:demo-http-server';
});

router.post('/echo/body', async (ctx, next) => {
    ctx.body = ctx.request.body;
});

export { router };
