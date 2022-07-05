import { Button, Checkbox, Col, Form, Input, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";


export default function DetailJob (){
    return <Content
    className="site-layout-background"
    style={{
      padding: 24,
      paddingTop: 12,
      margin: 0,
      marginTop: 20,
      minHeight: 280,
    //   backgroundColor: "white",
    }}
  >
     <Form
      name="basic"
      initialValues={{ remember: true }}
    //   onFinish={onFinish}
    //   onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
    <div className="job-infomation ant-card ant-card-bordered" style={{ backgroundColor: "white"}}>
        <header className="header-detail-job">
            <h3 className="header-detail-job__title">Job Information</h3>
        </header>
        <div className="" style={{ padding: '10px 24px'}}> 
            <Row>
                <Col span={12}>
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job ID
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job Title
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}> Master Chef</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                </Col>
                <Col span={12}>
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job ID
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job Title
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}> Master Chef</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <Form.Item name=''>
                                <Input/>
                            </Form.Item> 
                        </Col> 
                    </Row> 
                </Col>
            </Row>
        
        </div>
    </div>



      
    </Form>

  </Content>
}