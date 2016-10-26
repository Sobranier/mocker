import config from 'config';
import uuid from 'node-uuid';
import Controller from '../controller';
import Api from '../db/models/api';
import sequelize from '../db/index';
import queryString from 'query-string';

export default class Main extends Controller {
    *list(versionId) {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);
      query.offset = query.offset ? query.offset - 0 : 0;
      query.limit = query.limit ? query.limit - 0 : 10;
      let sqlQuery = {
        version_id: versionId
      };
      if (query.key && query.key !== '') {
        sqlQuery.name = {
          $like: `%${query.key}%`
        };
      }

      let total = yield Api.count({
        where: sqlQuery
      });

      let list = yield Api.findAll({
        where: sqlQuery,
        limit: query.limit,
        offset: query.offset
      });

      this.podata({
        data: list,
        pagination: {
          current: query.offset,
          total,
          pages: Math.floor(total/query.limit),
          limit: query.limit
        }
      });
    }

    *get(versionId, apiId) {
      let version = yield Api.findOne({where: {
        id: apiId,
        version_id: versionId
      }})
      this.podata({data: version});
    }

    *create(versionId) {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);
      query.uid = uuid.v1();
      query.version_id = versionId - 0;

      try {
        let action = yield Api.create(query);
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }

    *update(versionId, apiId) {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);

      try {
        let action = yield Api.update(query, { where: {
          id: apiId,
          version_id: versionId
        }});
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }

    *delete(versionId, apiId) {
      try {
        let action = yield Api.destroy({ where: {
          id: apiId,
          version_id: versionId
        }});
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }
}
