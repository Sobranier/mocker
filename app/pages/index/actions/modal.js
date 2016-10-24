import request from 'app/vendor/request';
import { fetchProjectList } from './list';
import { message } from 'antd';

export function openEditor(info) {
  return dispatch => {
    dispatch({
      type: 'OPEN_EDITOR',
      data: {
        editInfo: info,
        show: true
      }
    })
  }
}

export function closeEditor(info) {
  return dispatch => {
    dispatch({
      type: 'OPEN_EDITOR',
      data: {
        editInfo: {},
        show: false
      }
    });
  }
}

export function updateEditor(info) {
  return dispatch => {
    dispatch({
      type: 'UPDATE_EDITOR',
      data: info
    });
  }
}

export function confirmEditor(modelType, info) {
  let method = 'post';
  let url = `/end${modelType}`;
  if (info.id) {
    method = 'put';
    url = `${url}/${info.id}`
  };
  return dispatch => {
      request[method](url)
      .query(info)
      .promiseify()
      .then((res) => {
        if (res.body.errors) {
          message.warning(res.body.message);
          return;
        }
        fetchProjectList()(dispatch);
        closeEditor()(dispatch);
      }, (err) => {
        console.log(err);
        closeEditor();
      });
  }
}
