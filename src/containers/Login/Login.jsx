import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox"; 
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

// const countDown = () => {
//   let secondsToGo = 2;

//   const modal = Modal.error({
//     title: "Please check username or password again!",
//     content: `This modal will be destroyed after ${secondsToGo} second.`,
//   });

//   const timer = setInterval(() => {
//     secondsToGo -= 1;
//     modal.update({
//       content: `This modal will be destroyed after ${secondsToGo} second.`,
//     });
//   }, 1000);

//   setTimeout(() => {
//     clearInterval(timer);
//     modal.destroy();
//   }, secondsToGo * 1000);
// };

export default function Login() { 
  const [acc] = useState((JSON.parse(localStorage.getItem("a"))|| {}));
  const { login } = useAuth(); 
  const onFinish = (event) => {    
   
    let username = event.username;
    let password = event.password;
    login({
      remember: event.remember,
      user_name: username,
      password: password
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Layout style={{ marginTop: "100px", minHeight: "900px" }}>
      <Layout>
        {/* <h2>Login </h2>
        <div>Login your account</div> */}
        <Form
          name="basic"
          style={{textAlign: "center"}} 
          initialValues={{ remember: acc.remember, username: acc.user_name}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item 
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
              <Input style={{ maxWidth: 500 }} prefix={<UserOutlined style={{paddingRight: "8px"}} className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            style={{ marginTop: 20 }} 
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          > 
            <Input
                style={{ maxWidth: 500 }}
                prefix={<LockOutlined style={{paddingRight: "8px"}}  className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked" 
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </Layout>
  );
}
