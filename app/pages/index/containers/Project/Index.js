import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Icon, Popover, Breadcrumb, Modal } from 'antd';

import * as listAction from 'main/actions/list';
import * as modalAction from 'main/actions/modal';
import VersionEditor from 'app/components/common/VersionEditor';
import './Index.scss';
const confirm = Modal.confirm;

class Home extends Component {

    handleClickAdd() {
      this.props.openEditor({modalTitle: 'Add Version'});
    }

    handleClickEdit(id, index) {
      this.props.openEditor(Object.assign({}, this.props.version.list[index], {modalTitle: 'Edit Version'}));
    }

    handleClickCopy(id, index) {
      this.props.copyItem('version', {
        id: id,
        projectId: this.props.params.id
      });
    }

    handleClickDelete(id) {
      let self = this;
      confirm({
        title: '删除此项目？',
        onOk() {
          self.props.deleteItem('version', {
            id: id,
            projectId: self.props.params.id
          });
        },
        onCancel() {}
      });
    }

    handleConfirm() {
      this.props.confirmEditor('version', Object.assign({}, this.props.modal.editInfo, {
        projectId: this.props.params.id
      }));
    }

    handleCancel() {
      this.props.closeEditor();
    }

    handleFormUpdate(ev) {
      this.props.updateEditor({
        name: ev.target.name,
        value: ev.target.value
      });
    }

    componentDidMount() {
      this.props.fetchSingleInfo('project', { id: this.props.params.id });
      this.props.fetchList('version', { projectId: this.props.params.id });
    }

    renderPopContent(id, index) {
      return (
        <div className="edit-pop">
          <Icon type="edit" onClick={(ev) => this.handleClickEdit(id, index, ev) }/>
          <Icon type="copy" onClick={(ev) => this.handleClickCopy(id, index, ev) } />
          <Icon type="delete" onClick={(ev) => this.handleClickDelete(id, ev) } />
        </div>
      );
    }

    render() {
      let { version, modal, activeInfo } = this.props;

      return (
        <div className="container">
          <div className="project-side">
            <h2>项目名称</h2>
            <p>{activeInfo.project.name}</p>
            <h2>项目描述</h2>
            <p>{activeInfo.project.desc}</p>
            <h2>项目API</h2>
            <p>{activeInfo.project.api}</p>
          </div>
          <div className="project-main">
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{activeInfo.project.name}</Breadcrumb.Item>
            </Breadcrumb>
            <ul className="clearfix block-list project-list">
              <li>
                <a className="block-item-plus" onClick={(ev) => this.handleClickAdd(ev)}><Icon type="plus" /></a>
              </li>
              {version.list.map((item, index) => {
                return (
                  <li key={item.id}>
                    <h2><Link to={`/project/${activeInfo.project.id}/version/${item.id}`}>{item.name}</Link></h2>
                    <p>{item.desc}</p>
                    <p>{item.api}</p>
                    <Popover content={this.renderPopContent(item.id, index)} trigger="hover">
                      <Icon type="setting" />
                    </Popover>
                    {item.enable_cache && (
                      <Popover content="已开启缓存" trigger="hover">
                        <Icon type="cloud" />
                      </Popover>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <VersionEditor
            info={modal.editInfo}
            show={modal.show}
            updateForm={(ev) => {this.handleFormUpdate(ev)}}
            handleCancel={() => {this.handleCancel()}}
            handleConfirm={() => {this.handleConfirm()}}
          />
        </div>
      );
    }
}

export default connect(
  (state) => ({version: state.version, activeInfo: state.activeInfo, modal: state.modal}),
  (dispatch) => bindActionCreators({ ...listAction, ...modalAction }, dispatch)
)(Home);
