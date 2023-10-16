import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

import "./style.css"

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


const FormRegister = () => (
  <div className='form-Register-all'>
  <Form
    className='form-Register'
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
  
  </Form>;
      <Button type="primary" htmlType="submit" className='btn-form'>
        Đăng nhập bằng email
      </Button>
  </div>)


export default FormRegister;
