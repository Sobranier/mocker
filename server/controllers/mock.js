import config from 'config';
import uuid from 'node-uuid';
import Controller from '../controller';
import Project from '../db/models/project';
import Version from '../db/models/version';
import Api from '../db/models/api';
import sequelize from '../db/index';
import queryString from 'query-string';
import Mock from 'mockjs';

export default class Main extends Controller {
  *index() {
    let query = queryString.parse(this.ctx.request.url.split('?')[1]);

    let project = yield Project.findOne({
      where: {
        name: query.project
      }
    });

    if (!project) {
      console.log('无对应项目');
      // !!!
      this.ctx.set('x-powered-by', 'redirect');
      return;
    }

    let version = yield Version.findOne({
      where: {
        project_id: project.toJSON().id,
        name: query.version
      }
    });

    if (!version) {
      console.log('无对应版本');
      // !!!
      this.ctx.set('x-powered-by', 'redirect');
      return;
    }

    let api = yield Api.findOne({
      where: {
        version_id: version.toJSON().id,
        name: query.api
      }
    });

    if (!api) {
      console.log('无对应 api');
      // !!!
      this.ctx.set('x-powered-by', 'redirect');
      return;
    } else {
      let content = api.toJSON().content;

      console.log(content);
      console.log(typeof content);

      if (/^\{.*\}$/.test(content.replace(/(\s|\t|\r|\n)/g, ''))) {
        this.ctx.type = "application/json; charset=UTF-8";
        content = Mock.mock(content);
      } else {
        this.ctx.type = "text/html; charset=UTF-8";
        content = content.replace(/"/g, '').replace(/'/g, '"');
      }

      this.ctx.set('x-powered-by', 'mock');
      this.podata(content);
    } 
  }
}
