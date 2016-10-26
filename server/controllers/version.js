import config from 'config';
import uuid from 'node-uuid';
import Controller from '../controller';
import Version from '../db/models/version';
import Api from '../db/models/api';
import sequelize from '../db/index';
import queryString from 'query-string';

export default class Main extends Controller {
    *list(projectId) {
      let list = yield Version.findAll({where: {
        project_id: projectId
      }});
      this.podata({
        data: list
      });
    }

    *get(projectId, versionId) {
      let version = yield Version.findOne({where: {
        id: versionId,
        project_id: projectId
      }})
      this.podata({data: version});
    }

    *create(projectId) {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);
      query.uid = uuid.v1();
      query.project_id = projectId - 0;

      try {
        let action = yield Version.create(query);
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }

    *update(projectId, versionId) {
      let query = queryString.parse(this.ctx.request.url.split('?')[1]);

      try {
        let action = yield Version.update(query, { where: {
          id: versionId,
          project_id: projectId
        }});
        this.podata({data: action});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }

    *copy(projectId, versionId) {
      let version = yield Version.findOne({where: {id: versionId}});
      let apis = yield Api.findAll({where: {version_id: versionId}});
      let newObj = version.toJSON();

      newObj.uid = uuid.v1();
      newObj.name = newObj.name + '_bac';
      delete(newObj.id);
      delete(newObj.createdAt);
      delete(newObj.updatedAt);

      let newVersion;
      try {
         newVersion = yield Version.create(newObj);
      } catch (ex) {
        this.podata(ex);
        return;
      }
      let newVersionId = newVersion.toJSON().id;

      for (let i = 0, len = apis.length; i < len; i ++) {
        let newObj = apis[i].toJSON();
        newObj.uid = uuid.v1();
        newObj.version_id = newVersionId;
        delete(newObj.id);
        delete(newObj.createdAt);
        delete(newObj.updatedAt);

        let newApi = yield Api.create(newObj);
      }

      this.podata({data: newVersion});
    }

    *delete(projectId, versionId) {
      try {
        let v = yield Version.destroy({ where: {
          id: versionId,
          project_id: projectId
        }});
        let a = yield Api.destroy({where: {
          version_id: versionId
        }});
        this.podata({data: {v, a}});
      } catch(ex) {
        console.log(ex);
        this.podata(ex);
      }
    }
}
