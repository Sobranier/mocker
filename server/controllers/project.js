import config from 'config';
import uuid from 'node-uuid';
import Controller from '../controller';
import Project from '../db/models/project';
import sequelize from '../db/index';
import queryString from 'query-string';

export default class Main extends Controller {
    *list(name) {
      let list = yield Project.findAll({where: {
        is_deleted: false
      }});
      this.podata({
        data: list
      });
    }

    *get(id) {
      let project = yield Project.findOne({where: {
        id
      }})
      this.podata({data: project});
    }

    *create() {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);
      query.uid = uuid.v1();

      try {
        let action = yield Project.create(query);
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }

    *update(id) {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);

      try {
        let action = yield Project.update(query, { where: {
          id
        }});
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }

    *delete(id) {
      try {
        let action = yield Project.update({is_deleted: true}, { where: {
          id
        }});
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }
}
