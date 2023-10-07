import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

import "./style.css"

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


const FormLogin = () => (
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    layout="vertical"
  >
    <Form.Item
      label="Email"
      name="Email"
      rules={[{ required: true, message: 'Hãy nhập email!' }]}
    >
      <Input className='form-item-input' />
    </Form.Item>

    <Form.Item
      
      label="Password "
      name="password"
      rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
    >
      <Input.Password className="form-item-input"/>
    </Form.Item>

    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{ offset: 8, span: 16 }}
    >
      <Checkbox>Lưu mật khẩu</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default FormLogin;