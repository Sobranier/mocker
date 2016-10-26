import cors from 'koa-cors';

export default cors.bind(this, {
  credentials: true
});
