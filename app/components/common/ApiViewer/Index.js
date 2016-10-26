import React, { Component } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 }
};

const Dialog = (props) => {
  return (
    <Modal title="Preview Api" visible={props.show} width={860} style={{ top: 20 }}
      onCancel={props.handleCancel}
      footer={[
        <Button key="back" type="ghost" size="large" onClick={props.handleCancel}>确认</Button>
      ]}
    >
      <Form horizontal>
        <FormItem {...formItemLayout} label="Api">
          <Input value={props.info.name} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="接口地址">
          <Input value={props.info.url} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="请求方式">
          <Input value={props.info.method} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="接口内容">
          <Input type="textarea" value={props.info.content} disabled rows="20" />
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Dialog
