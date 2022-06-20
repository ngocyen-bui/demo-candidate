import { Button, Form, Input } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { DOMAIN } from "../../core/candidate";
import { login } from "../../core/login";



export default function Login(){
  const [info, setInfo] = useState({})
  const navigate = useNavigate();

  
  const onFinish = (values) => {
   const ac = login({user_name:values.username,password: values.password});  
  };
  
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    return (
        <Form
          style={{marginTop: 100, minHeight: 700}}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input style={{maxWidth: 500}}/>
          </Form.Item>
    
          <Form.Item
           style={{ marginTop: 20}}
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password  style={{maxWidth: 500}}/>
          </Form.Item>
    
          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
    
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        
      );
}


