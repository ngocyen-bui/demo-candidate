import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, Modal } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox"; 
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const countDown = () => {
  // let secondsToGo = 2;

  const modal = Modal.error({
    title: "Please check username or password again!",
    // content: `This modal will be destroyed after ${secondsToGo} second.`,
  });

  // const timer = setInterval(() => {
  //   secondsToGo -= 1;
  //   modal.update({
  //     content: `This modal will be destroyed after ${secondsToGo} second.`,
  //   });
  // }, 1000);

  // setTimeout(() => {
    // clearInterval(timer);
  //   modal.destroy();
  // }, secondsToGo * 1000);
};

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
    }).then((res)=> 
     {
      if(res?.response?.status === 400){
        countDown()
      }
     }
    )
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
  <>
  <Layout style={{ padding: "100px", backgroundColor: 'white' }}>
      <img src="https://nadh.lubrytics.com/icon_NADH.ico" style={{width: '100px', margin: '0 auto'}}></img>
      <h1 style={{fontSize: '50px', textAlign: 'center', fontWeight: 'bold', opacity: '0.8'}}>NADH</h1>
      <Layout style={{width: '600px',padding: '40px 40px 60px 40px', height: '320px', margin: '40px auto 0', backgroundColor: 'white',border: '1px solid #c8ced3'}}>
        
        <h2 style={{fontSize: '32px',marginBottom: 0}}>Login </h2>
        <div style={{marginBottom: '20px', color: '#73818f',fontWeight: 'bold'}}>Sign in to your account</div>
        <Form
          name="basic"
          style={{}} 
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
            style={{ marginTop: 10 }} 
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
            style={{ marginTop: '10px'}} 
            name="remember"
            valuePropName="checked" 
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item >
            <Button
            style={{ borderRadius: '6px', paddingInline: '20px',marginRight: '20px' , float: "right"  }} 
             type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </Layout>
  </>
  );
}
