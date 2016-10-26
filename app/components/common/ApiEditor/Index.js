import React, { Component } from 'react';
import { Form, Input, Button, Icon, Select } from 'antd';

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import './Index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const FORMDATA = {
  name: '',
  method: 'GET',
  desc: '',
  content: '{}'
}

export default class Index extends Component {

  state = {
    formData: Object.assign({}, FORMDATA)
  }

  handleSave() {
    this.props.onUpdate(this.state.formData);
  }

  handleReload() {
    this.setState({
      formData: Object.assign({}, FORMDATA)
    });
  }

  handlePreview() {
    this.props.onPreview(this.state.formData);
  }

  handleAceChange(newValue) {
    console.log(typeof newValue);
    this.onFormChange('content', newValue);
  }

  onFormChange(key, value) {
    let { formData } = this.state;
    console.log(formData);
    formData[key] = value;
    this.setState({
      formData
    });
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.formData.content) {
      newProps.formData.content = '{}';
    }
    this.setState({
      formData: newProps.formData
    });
  }

  render() {
    let { formData } = this.state;

    return (
      <div className="api-editor">
        <Form horizontal>
          <FormItem {...formItemLayout} label="Api" style={{height: 32}}>
            <Input addonBefore="/" value={formData.name} onChange={(ev) => this.onFormChange('name', ev.target.value)} />
          </FormItem>
          <FormItem {...formItemLayout} label="Method" style={{height: 32}}>
            <Select value={formData.method} onChange={(value) => this.onFormChange('method', value)}>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="DELETE">DELETE</Option>
              <Option value="PUT">PUT</Option>
              <Option value="UPDATE">UPDATE</Option>
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="描述" style={{height: 32}}>
            <Input value={formData.desc} onChange={(ev) => this.onFormChange('desc', ev.target.value)} />
          </FormItem>
        </Form>

        <div className="ace-editor">
          <AceEditor
            mode="json"
            theme="github"
            onChange={(newValue) => this.handleAceChange(newValue)}
            name="mocaker_test"
            editorProps={{$blockScrolling: true}}
            width="100%"
            value={formData.content}
          />
        </div>

        <div className="api-editor-buttons">
          <Button type="primary" icon="save" onClick={() => this.handleSave()}>保存</Button>
          <Button type="primary" icon="reload" onClick={() => this.handleReload()}>重置</Button>
          <Button type="primary" icon="eye-o" onClick={() => this.handlePreview()}>预览</Button>
          <Button icon="question-circle-o" onClick={() => window.open('http://mockjs.com/examples.html')}>Mock预发标准文档</Button>
        
        </div>
      </div>
    );
  }
}
