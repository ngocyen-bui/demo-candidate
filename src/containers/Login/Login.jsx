import { Button, Form, Input, Modal } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox"; 
import { login } from "../../core/login";


const countDown = () => {
  let secondsToGo = 2;

  const modal = Modal.error({
    title: 'Please check username or password again!',
    content: `This modal will be destroyed after ${secondsToGo} second.`,
  });

  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `This modal will be destroyed after ${secondsToGo} second.`,
    });
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
  }, secondsToGo * 1000);
};

export default function Login(){
  // const [info, setInfo] = useState({})
  // const navigate = useNavigate(); 
  
  const onFinish = (values) => {
   login({user_name:values.username,password: values.password}).then(res =>{
    console.log(res);
    if(res.status === 200){ 
      localStorage.removeItem('auth')
      localStorage.setItem('auth', res.data.token); 
       window.location.pathname = "/candidates"
    }else {
      countDown();
    }

   });  
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


