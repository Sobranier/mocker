import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Icon, Popover, Breadcrumb, Modal, Input, Button } from 'antd';

import * as listAction from 'main/actions/list';
import * as modalAction from 'main/actions/modal';
import * as infoAction from 'main/actions/info';
import ApiEditor from 'app/components/common/ApiEditor';
import ApiViewer from 'app/components/common/ApiViewer';
import './Index.scss';

const confirm = Modal.confirm;
const InputGroup = Input.Group;

class Home extends Component {

  handleChoose(id) {
    this.props.fetchSingleInfo('api', {versionId: this.props.params.id, id});
  }

  handleAdd() {
    this.props.updateFilter('api', {});
  }

  handleDelete(id) {
    this.props.deleteItem('api', {
      versionId: this.props.params.id,
      id,
      offset: this.props.api.pagination.current
    });
  }

  handleSearch() {
    this.props.fetchList('api', {
      versionId: this.props.params.id,
      key: this.props.activeInfo.query,
      offset: 0
    });
  }

  handleInputChange(event) {
    this.props.updateFilter('query', event.target.value);
  }

  handleUpdateList(number) {
    let { api } = this.props;

    let target = api.pagination.current + number * api.pagination.limit;
    if (0 <= target && target < api.pagination.total) {
      this.props.fetchList('api', {
        versionId: this.props.params.id,
        offset: target
      });
    }
  }

  handleConfirm(content) {
    this.props.confirmEditor('api', Object.assign({}, this.props.activeInfo.api, content, {
      versionId: this.props.params.id,
      offset: this.props.api.pagination.current
    }));
  }

  handlePreview(content) {
    let { project, version } = this.props.activeInfo;
    this.props.openEditor(Object.assign({}, this.props.activeInfo.api, content, {
      url: `http://localhost:8787/mock?project=${project.name}&version=${version.name}&api=${encodeURIComponent(content.name)}`
    }));
  }

  handleCancel(preview) {
    this.props.closeEditor();
  }

  componentDidMount() {
    this.props.fetchSingleInfo('project', { id: this.props.params.projectId });
    this.props.fetchSingleInfo('version', { projectId: this.props.params.projectId, id: this.props.params.id });
    this.props.fetchList('api', { versionId: this.props.params.id });
  }

  render() {
    let { api, modal, activeInfo } = this.props;
    let { pagination } = api;

    return (
      <div className="container">
        <div className="version-side">
          <h2>Api List</h2>
          <InputGroup className="ant-search-input">
            <Input value={activeInfo.query} onChange={(ev) => this.handleInputChange(ev)} onPressEnter={() => this.handleSearch()} />
            <div className="ant-input-group-wrap">
              <Button icon="search" onClick={() => this.handleSearch()} className="ant-search-btn" />
            </div>
          </InputGroup>
          <ul>
          {api.list.map((item, index) => {
            return (
              <li key={item.id} className={item.id === activeInfo.api.id ? 'active' : ''}>
                <p onClick={() => {this.handleChoose(item.id)}}>{item.name}</p>
                <Icon type="delete" onClick={() => {this.handleDelete(item.id)}}/>
              </li>
            );
          })}
          </ul>
          <div className="side-bottom-bar">
            <Icon type="arrow-left" className={pagination.current > 0 ? 'active' : ''} onClick={() => this.handleUpdateList(-1)}/>
            <Icon type="plus" onClick={() => this.handleAdd()}/>
            <Icon type="arrow-right" className={pagination.current + pagination.limit < pagination.total ? 'active' : ''} onClick={() => this.handleUpdateList(1)} />
          </div>
        </div>
        <div className="version-main">
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={`/project/${activeInfo.project.id}`}>{activeInfo.project.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{activeInfo.version.name}</Breadcrumb.Item>
          </Breadcrumb>
          <ApiEditor
            formData={activeInfo.api}
            onUpdate={(c) => this.handleConfirm(c)}
            onPreview={(c) => this.handlePreview(c)}
          />
          <ApiViewer
            info={modal.editInfo}
            show={modal.show}
            handleCancel={() => {this.handleCancel()}}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({api: state.api, activeInfo: state.activeInfo, modal: state.modal}),
  (dispatch) => bindActionCreators({ ...listAction, ...modalAction, ...infoAction }, dispatch)
)(Home);
