import request from 'app/vendor/request';
import { message } from 'antd';

export const createUrl = (modelType, info, isList) => {
  let url = '/end/project';
  let lastParam = isList ? '/list' :
      info.id ? `/${info.id}` :
          '';

  switch (modelType) {
    case 'project':
      url = `${url}${lastParam}`;
      break;
    case 'version':
      url = `${url}/${info.projectId}/version${lastParam}`;
      break;
    case 'api':
      url = `${url}/version/${info.versionId}/api${lastParam}`;
      break;
  }

  return url;
}

/**
 *  获取各种列表
 */
export function fetchList(modelType, info) {
  let url = createUrl(modelType, info, true);
  let type = `GET_${modelType.toUpperCase()}_LIST`;

  return dispatch => {
    request.get(url)
      .query(info)
      .promiseify()
      .then((res) => {
        dispatch({
          type,
          data: JSON.parse(res.text).data,
          pagination: JSON.parse(res.text).pagination
        });
      }, (err) => {
        console.log(err);
      })
  }
}


/**
 *  获取单个条目信息
 */
export function fetchSingleInfo(modelType, info) {
  let url = createUrl(modelType, info, false);

  return dispatch => {
    request.get(url)
      .promiseify()
      .then((res) => {
        dispatch({
          type: 'GET_ACTIVE',
          data: {
            name: modelType,
            value: JSON.parse(res.text).data
          }
        });
      }, (err) => {
        console.log(err);
      });
  }
}


/**
 *  删除单个条目
 */
export function deleteItem(modelType, info) {
  let url = createUrl(modelType, info, false);

  return dispatch => {
    request.del(url)
      .promiseify()
      .then((res) => {
        if (res.body.errors) {
          message.warning(res.body.message);
          return;
        }
        fetchList(modelType, info)(dispatch);
      }, (err) => {
        console.log(err);
      });
  }
}

/**
 *  拷贝单个条目
 */
export function copyItem(modelType, info) {
  let url = createUrl(modelType, info, false);

  return dispatch => {
    request.post(url)
      .promiseify()
      .then((res) => {
        if (res.body.errors) {
          message.warning(res.body.message);
          return;
        }
        fetchList(modelType, info)(dispatch);
      }, (err) => {
        console.log(err);
      });
  }
}
