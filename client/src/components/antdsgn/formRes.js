import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";

import "./style.css";
import Swal from "sweetalert2";

const onFinish = (values) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const FormRegister = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const register = () => {
    var data = new URLSearchParams();
    data.append("username", username);
    data.append("userpassword", password);
    fetch("http://localhost:3000/user/register?" + data, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.check === true) {
          Toast.fire({
            icon: "success",
            title: "Đăng ký thành công",
          }).then(() => {
            window.location.replace("/login");
          });
        } else {
          Toast.fire({
            icon: "error",
            title: res.error,
          });
        }
      });
  };
  return (
    <div className="form-Register-all">
      <Form.Item
        className="form-Register"
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
          label="Username"
          name="Username"
          rules={[{ required: true, message: "Hãy nhập username!" }]}
          onChange={(e) => setUserName(e.target.value)}
        >
          <Input className="form-item-input" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="Password"
          rules={[{ required: true, message: "Hãy nhập password!" }]}
          onChange={(e) => setPassword(e.target.value)}
        >
          <Input className="form-item-input" />
        </Form.Item>
      </Form.Item>
      ;
      <Button
        type="primary"
        htmlType="submit"
        className="btn-form"
        onClick={register}
      >
        Đăng ký
      </Button>
    </div>
  );
};

export default FormRegister;
