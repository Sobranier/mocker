import Salt from 'koa-salt';

export default Salt()
  .load('logger')
  .load('init')
  .load('static')
  .load('cors')
  .load('forward-backend')
  .load('router')
  .load('sql');
