import { Button, Checkbox, Col, Form, Input, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useQuery } from "react-query";
import { getJobById } from "../features/job";
import { useAuth } from "../hooks/useAuth";


export default function DetailJob (props){
    const params = props.params;
    const { user: auth } = useAuth();
    const token = auth?.token;
    const { data: listInfoJob, isFetching } = useQuery(
        ["jobdetail", params?.id, token],
        () => getJobById(params?.id, token)
      ); 
    if(isFetching) return ;

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
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.job_id}</div> 

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job Title
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.title?.label}</div> 

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
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.department?.label}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Quantity
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.quantity}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Job Type
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.title?.label}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Experience Level
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.experience_level}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Created By
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px', textTransform: 'capitalize'}}>{listInfoJob?.creator?.full_name}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Created On
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{Date(listInfoJob?.createdAt)}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Last Updated
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.updatedAt}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                </Col>
                <Col span={12} style={{paddingLeft: '24px'}}>
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Job Status
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.status}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Open Date
                        </Col>
                        <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.target_date}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col> 
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Expire Date
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.end_date}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Extend Date
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.extend_date || '-'}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Location
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{(listInfoJob?.location?.city?listInfoJob?.location?.city?.label+", ":'')+ listInfoJob?.location?.country?.label}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Client's Name
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.client?.name}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Client's Contact Person
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.title?.label}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Search Consultant
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.title?.label}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                                Mapping by
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.title?.label}</div>

                            {/* <Form.Item name=''>
                                <Input/>
                            </Form.Item>  */}
                        </Col>  
                    </Row> 
                </Col>
            </Row>
        
        </div>
    </div>



      
    </Form>

  </Content>
}