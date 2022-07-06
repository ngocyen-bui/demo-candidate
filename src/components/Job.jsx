import { Button, Col, DatePicker, Form, InputNumber, message, Row, Select, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect } from "react";
import { useState } from "react";import moment from 'moment';
import { useQuery } from "react-query";
import { getDefaultProp, getLocationFromCountry, getPosition, getValueFlag } from "../features/candidate";
import { getAllClients } from "../features/client";
import { getDepartment, getJobById } from "../features/job";
import { getAllUsers } from "../features/user";
import { useAuth } from "../hooks/useAuth";
import { getLevelJob, getStatusJob, getTypeJob, listLevel, listStatus, listType } from "../utils/job";
import { fetchUpdateJob } from "../redux/reducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";




const formatDate = (date,type = 'datetime')=>{
    if(!date) return; 
    let m = new Date(date);
    let options = { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',     }

    if(type === 'date'){
        options = { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',  
        }
    }

    let time = m.toLocaleString('it-IT',options);
    return `${time }` 

    // return  m.getUTCFullYear() + "/" +
    // ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    // ("0" + m.getUTCDate()).slice(-2) + " " +
    // ("0" + m.getUTCHours()).slice(-2) + ":" +
    // ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    // ("0" + m.getUTCSeconds()).slice(-2);
     
}

export default function DetailJob (props){
    const params = props.params;
    const { user: auth } = useAuth();
    const token = auth?.token;
    const [editOnly, setEditOnly] = useState(false); 
    const [key,setKey]= useState('');

    const { data: listInfoJob, isFetching } = useQuery(
        ["jobdetail", params?.id, token],
        () => getJobById(params?.id, token)
    );       
    const { data: listAllClients } = useQuery(
        ["listAllClientsJobs", token],
        async () => await getAllClients(token)
    ); 
    const { data: listALlUsers } = useQuery(
        ["listAllUsersJobs", token],
        async () => await getAllUsers(token)
    );   
    const handlerClickRow = (e) => {
        if(editOnly === false) {
            setKey(e.target.getAttribute("value"));
            setEditOnly(true);
        }else return; 
    }
    const stopEdit = () => {
        setKey('');
        setEditOnly(false);
    }
    if(isFetching) return ; 
    
    return <Content
    className="site-layout-background"
    style={{
    //   padding: 24,
      paddingTop: 12,
      margin: 0,
      marginTop: 20,
      minHeight: 280,
    //   backgroundColor: "white",
    }}
  >
    <div className="job-infomation ant-card ant-card-bordered" style={{ backgroundColor: "white"}}>
        <header className="header-detail-job">
            <h3 className="header-detail-job__title">Job Information</h3>
        </header>
        <div className="" style={{ padding: '10px 24px'}}> 
            <Row>
                <Col span={12}>
                    {/* {Job_id: disabled} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job ID
                        </Col>
                       <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                            <div style={{lineHeight: '35px'}}>{listInfoJob?.job_id}</div> 
                        </Col>  
                    </Row> 
                    {/* {Job_title} */} 
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                           Job Title
                        </Col>
                        <Col className="job-infomation__content-item" span={16}> 
                            {!(editOnly && (key==="title"))?
                                <div onClick={handlerClickRow} value={'title'} ><div value={'title'} style={{lineHeight: '35px'}}>{listInfoJob?.title?.label}</div></div>
                            :<SelectComponent id={listInfoJob?.id} stop={stopEdit} type={'title'} default={listInfoJob?.title?.label}></SelectComponent>} 
                        </Col> 
                    </Row> 
                    {/* {Department} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Department
                        </Col>
                       <Col className="job-infomation__content-item" span={16}> 
                            {!(editOnly && (key==="department"))?
                                <div onClick={handlerClickRow} value={'department'} ><div value={'department'} style={{lineHeight: '35px'}}>{listInfoJob?.department?.label}</div></div>
                            :<SelectComponent id={listInfoJob?.id}  stop={stopEdit} type={'department'} default={listInfoJob?.department?.label}></SelectComponent>} 
                        </Col>  
                    </Row> 
                    {/* {Quantity} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Quantity
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>
                       {!(editOnly && (key ==='quantity'))?<div value={"quantity"} onClick={handlerClickRow} >
                                    <div value={"quantity"}  style={{lineHeight: '35px'}}>{listInfoJob?.quantity}</div>
                            </div>
                            : <InputNumberComponent id={listInfoJob?.id}  stop={stopEdit} type={"quantity"} data={listInfoJob?.quantity}></InputNumberComponent> }
                           
                       
                        </Col>  
                    </Row> 
                    {/* {Type} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Job Type
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>  
                            {!(editOnly && (key ==='type'))?<div value={"type"} onClick={handlerClickRow} >
                                <div value={"type"} color={getTypeJob(listInfoJob?.type)[0]?.color} style={{borderRadius: '5px',lineHeight: '35px'}}>{getTypeJob(listInfoJob?.type)[0]?.label}</div> 
                            </div>
                            :<SelectComponent id={listInfoJob?.id}  stop={stopEdit} default={getTypeJob(listInfoJob?.type)[0]?.label} type={'type'}/> }
                        </Col>  
                    </Row> 
                    {/* {Level} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Experience Level
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>  
                            {!(editOnly && (key ==='experience_level'))?<div value={"experience_level"} onClick={handlerClickRow} >
                                <div value={"experience_level"} color={getLevelJob(listInfoJob?.experience_level)[0]?.color} style={{borderRadius: '5px',lineHeight: '35px'}}>{getLevelJob(listInfoJob?.experience_level)[0]?.label}</div> 
                            </div>
                            :<SelectComponent id={listInfoJob?.id}  stop={stopEdit} default={getLevelJob(listInfoJob?.experience_level)[0]?.label} type={'experience_level'}/> }
                        </Col>  
                    </Row> 
                    {/* {Created by} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Created By
                        </Col>
                       <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                            <div style={{lineHeight: '35px', textTransform: 'capitalize'}}>{listInfoJob?.creator?.full_name}</div> 
                        </Col>  
                    </Row> 
                    {/* {Created on} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Created On
                        </Col>
                       <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                            <div style={{lineHeight: '35px'}}>{formatDate(listInfoJob?.createdAt)}</div> 
                            
                        </Col>  
                    </Row> 
                    {/* {Last Updated} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Last Updated
                        </Col>
                       <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                            <div style={{lineHeight: '35px'}}>{formatDate(listInfoJob?.updatedAt)}</div>
 
                        </Col>  
                    </Row> 
                </Col>
                <Col span={12} style={{paddingLeft: '24px'}}>
                    {/* {Status} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Job Status
                        </Col>
                       <Col className="job-infomation__content-item"  style={{minHeight: '35px'}} span={16}>
                            {!(editOnly && (key ==='status'))?<div value={"status"} onClick={handlerClickRow} ><Tag  value={"status"} color={getStatusJob(listInfoJob?.status)[0]?.color}style={{borderRadius: '5px'}}>{getStatusJob(listInfoJob?.status)[0]?.label}</Tag> </div>
                            :<SelectComponent id={listInfoJob?.id}  stop={stopEdit} default={getStatusJob(listInfoJob?.status)[0]?.label} type={'status'}/> }
                        </Col>  
                    </Row> 
                    {/* {Open date} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Open Date
                        </Col>
                        <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                            <div style={{lineHeight: '35px'}}>{formatDate(listInfoJob?.target_date,'date')}</div> 
                        </Col> 
                    </Row> 
                    {/* {Expire date} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Expire Date
                        </Col>
                       <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                            <div style={{lineHeight: '35px'}}>{formatDate(listInfoJob?.end_date,'date')}</div> 
                        </Col>  
                    </Row> 
                    {/* {Extend Date} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Extend Date
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>  
                            {!(editOnly && (key==="extend_date"))?
                                <div onClick={handlerClickRow} value={'extend_date'} ><div value={'extend_date'} style={{lineHeight: '35px'}}>{listInfoJob?.extend_date|| '-' }</div></div>
                            : <DataPickerComponent id={listInfoJob?.id}  type={"extend_date"} stop={stopEdit}  default={formatDate(listInfoJob?.extend_date,'date')}></DataPickerComponent>} 
                           
                        </Col>  
                    </Row> 
                    {/* {Location} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Location
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>  
                            {!(editOnly && (key==="location"))?
                                <div onClick={handlerClickRow} value={'location'} >
                                    <div value={'location'} style={{lineHeight: '35px'}}>{(listInfoJob?.location?.city?listInfoJob?.location?.city?.label+", ":'')+ listInfoJob?.location?.country?.label}</div></div>
                            :<LocationSelectComponent id={listInfoJob?.id}  stop={stopEdit} type={'location'} default={listInfoJob?.location}></LocationSelectComponent>} 
                        </Col>  
                    </Row> 
                    {/* {Client's Name} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Client's Name
                        </Col>
                       <Col className="job-infomation__content-item" span={16}> 
                            {!(editOnly && (key==="client"))?
                                <div onClick={handlerClickRow} value={'client'} ><div value={'client'} style={{lineHeight: '35px'}}>{listInfoJob?.client?.name}</div></div>
                            :<SelectComponent id={listInfoJob?.id}  stop={stopEdit} data={listAllClients?.data} type={'client'} default={listInfoJob?.client?.name}></SelectComponent>} 
                        </Col>  
                    </Row> 
                    {/* {Client's Contact Person} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Client's Contact Person 
                        </Col>
                       <Col className="job-infomation__content-item" span={16}> 
                            {!(editOnly && (key==="pic"))?
                                <div onClick={handlerClickRow} value={'pic'} ><div value={'pic'} style={{lineHeight: '35px', textTransform: 'capitalize'}}>{listInfoJob?.pic?.map(e=> e.label).toString()|| '-'}</div></div>
                            :<SelectMultipleComponent id={listInfoJob?.id}  stop={stopEdit} data={listAllClients?.data} type={'pic'} default={listInfoJob?.pic?.map(e=> e.id)}></SelectMultipleComponent>} 
                        </Col>  
                    </Row> 
                    {/* {Search Consultant} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                        Search Consultant
                        </Col>
                       <Col className="job-infomation__content-item" span={16}> 
                            {!(editOnly && (key==="recruiters"))?
                                <div onClick={handlerClickRow} value={'recruiters'} ><div value={'recruiters'} style={{lineHeight: '35px', textTransform: 'capitalize'}}>{listInfoJob?.recruiters?.map(e=> e.label).toString()|| '-'}</div></div>
                            :<SelectMultipleComponent id={listInfoJob?.id}  stop={stopEdit} data={listALlUsers?.data} type={'recruiters'} default={listInfoJob?.recruiters?.map(e=> e.key)}></SelectMultipleComponent>} 
                        </Col>  
                    </Row> 
                    {/* {Mapping by} */}
                    <Row>
                        <Col className="job-infomation__title-item" span={8}>
                                Mapping by
                        </Col>
                       <Col className="job-infomation__content-item" span={16}>  
                            {!(editOnly && (key==="related_users"))?
                                <div onClick={handlerClickRow} value={'related_users'} ><div value={'related_users'} style={{lineHeight: '35px', textTransform: 'capitalize'}}>{listInfoJob?.related_users?.map(e=> e.label).toString()|| '-'}</div></div>
                            :<SelectMultipleComponent id={listInfoJob?.id}  stop={stopEdit} data={listALlUsers?.data} type={'related_users'} default={listInfoJob?.related_users?.map(e=> e.key)}></SelectMultipleComponent>} 
                        </Col>  
                    </Row> 
                </Col>
            </Row>
        
        </div>
    </div>  
  </Content>
}



function SelectComponent(props) { 
    const defaultValue = props.default;  
    const stop = props.stop;   
    const type = props.type; 
    const id = props.id; 
    const [data, setData] = useState(props.data||[])   
    const [filter, setFilter] = useState({
        filterOption:false
    })  
    const [keyPosition, setKeyPosition] = useState('')
    const [keyDepartment, setKeyDepartment] = useState('')
 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token;

    const { data: listDefaultProp } = useQuery(
        ["defaultPropsJobs", token],
        async () => await getDefaultProp(token)
    ); 
    const [result, setResult] = useState();
    const { data: listPosition } = useQuery(["positionJobs",keyPosition,token], () => getPosition(keyPosition,token),
                            { enabled: Boolean(keyPosition) }); 
    const { data: listDepartment } = useQuery(["departmentJobs",keyDepartment,token], () => getDepartment(keyDepartment,token),
    { enabled: Boolean(keyDepartment) }); 
 
    
    useEffect(()=>{
        if(type === 'status'){
            setData(listStatus);
            setFilter({
                filterOption:(input, option) => option.children.toLowerCase().includes(input.toLowerCase())
            })
        }else if(type === 'type'){
            setData(listType);
            setFilter({
                filterOption:(input, option) => option.children.toLowerCase().includes(input.toLowerCase())
            })
        }else if(type === 'experience_level'){
            setData(listLevel);
            setFilter({
                filterOption:(input, option) => option.children.toLowerCase().includes(input.toLowerCase())
            })
        }else if(type === 'client'){
            // setData(listAllClients?.data);
            setFilter({
                filterOption:(input, option) => option.children.toLowerCase().includes(input.toLowerCase())
            })
        }else if(type === 'title'){
           if(Boolean(keyPosition) && listPosition){ 
                setData(listPosition?.data)
           }else{
                setData(listDefaultProp?.filter(e=> e.name === 'position')[0].values)
           }
        }else if(type === 'department'){
            if(Boolean(keyDepartment) && listDepartment){ 
                setData(listDepartment?.data)
           }else{
                setData(listDefaultProp?.filter(e=> e.name === 'department')[0].values)
           } 
        }
    },[type,listDefaultProp,keyPosition,listPosition,keyDepartment,listDepartment])

    const handleSearch = (e)=>{ 
        if(type === 'title'){
            setKeyPosition(e)
        }else if(type === 'department'){ 
            setKeyDepartment(e)
        }
    } 
    const handleSelect = (e,o)=>{   
        let key = o?.type;
        let value = o?.data;
        if(key === 'type'||key === 'experience_level'){
            value = o?.data?.id
        } 
        if(key === 'client'){
            key='client_id';
            value = o?.data?.id
        }
        if(key === 'status'){ 
            value = o?.data?.key
        }
        setResult({[key]:value}) 
    }
    const onFinish = (e)=>{ 
        const key = 'updatable';
        let data = {
            id: id,
            data:result,
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e === 403){
                message.error('This consultant does not have permission to change client');
            }else if(e === 400){
                message.error('Something wrong !'); 
            }
            else {
                    message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            } 
            stop()
        })  
        
    }
    return  (
        <div> 
                <Form 
                  onFinish={onFinish}
                //   onFinishFailed={onFinishFailed} 
                    initialValues={ {[type] : defaultValue}}
            >
                    <Form.Item  name={type} >
                        <Select style={{width: '100%', height: '35px'}} showSearch
                        {...filter}
                         onSearch={handleSearch}
                         onSelect={handleSelect}
                        >
                            {data?.map(e => {
                            return <Select.Option key={e.id || e.key} type={type} data={e} value={e.key} style={{textTransform: 'capitalize'}}>
                                    {e.label|| e.name }
                                </Select.Option>
                            })} 
                        </Select>
                    </Form.Item> 
                    <Form.Item style={{float: 'right'}}> 
                        <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px', marginRight: '10px'}}  htmlType="button" onClick={stop} >
                            Cancel
                        </Button> 

                        <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px'}} type="primary" htmlType="submit">
                            Save
                        </Button>
                       
                </Form.Item>
            </Form>
        </div>
    
    )
}

function InputNumberComponent(props){
    const data = props.data || 0; 
    const stop = props.stop;   
    const type = props.type;
    const id = props.id; 
 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token; 
    const onFinish = (e) => { 
        const key = 'updatable';
        let data = {
            id: id,
            data:e,
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e === 403){
                message.error('This consultant does not have permission to change client');
            }else if(e === 400){
                message.error('Something wrong !'); 
            }
            else {
                    message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            } 
            stop()
        })  
    }
    return (
        <Form
        name="basic" 
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed} 
        initialValues={{[type]: data}}
    >
        <Form.Item name={type} >
            <InputNumber style={{width: '100%'}} min={0}/>
        </Form.Item> 
        <Form.Item style={{float: 'right'}}> 
            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px', marginRight: '10px'}}  htmlType="button" onClick={stop}  >
                Cancel
            </Button> 

            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px'}} type="primary" htmlType="submit">
                Save
            </Button>
                
        </Form.Item>
    </Form>
    )
}

function SelectMultipleComponent(props) { 
    const data = props.data|| []; 
    const stop = props.stop;   
    const type = props.type;
    const defaultValue = props.default; 
    const id = props.id; 
 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token; 


    const onFinish = (e)=>{  
        const key = 'updatable';
        let data = {
            id: id,
            data:e,
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e === 403){
                message.error('This consultant does not have permission to change client');
            }else if(e === 400){
                message.error('Something wrong !'); 
            }
            else {
                    message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            } 
            stop()
        })  
        
    }

    return (
        <Form
        name="basic" 
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}  
        initialValues={ {[type] : [...defaultValue]}}
    >
        <Form.Item name={type} >
        <Select
            mode="tags" 
            placeholder="Please select" 
            style={{ width: '100%' }}
            >
              {data?.map(e => {
                return <Select.Option key={e.id || e.key} style={{textTransform: 'capitalize'}}>
                        {e.label    || e.name || e.full_name}
                    </Select.Option>
                })} 
        </Select>
        </Form.Item> 
        <Form.Item style={{float: 'right'}}> 
            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px', marginRight: '10px'}}  htmlType="button" onClick={stop}  >
                Cancel
            </Button> 

            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px'}} type="primary" htmlType="submit">
                Save
            </Button>
                
        </Form.Item>
    </Form>
    )
}

function DataPickerComponent (props) {  
    const stop = props.stop;   
    const type = props.type;
    const dateFormat = 'DD/MM/YYYY';
    const id = props.id; 
 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token; 
    let defaultValue = props.default    
    if(defaultValue){
        defaultValue = moment(props.default, dateFormat);
    } 
    const onFinish = (e)=>{   
        let date = e[type].format('YYYY-MM-DD')
        const key = 'updatable';
        let data = {
            id: id+'/extend',
            data: {[type]:date},
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e === 403){
                message.error('This consultant does not have permission to change client');
            }else if(e === 400){
                message.error('Something wrong !'); 
            }
            else {
                    message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            } 
            stop()
        })  
        
    }
    return (
        <Form
        name="basic" 
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}  
        initialValues={ {[type] : defaultValue}}
    >
        <Form.Item name={type} >
            <DatePicker format={dateFormat}  style={{width: '100%'}} />
        </Form.Item> 
        <Form.Item style={{float: 'right'}}> 
            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px', marginRight: '10px'}}  htmlType="button" onClick={stop}  >
                Cancel
            </Button>  
            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px'}} type="primary" htmlType="submit">
                Save
            </Button>
                
        </Form.Item>
    </Form>
    )
}

function LocationSelectComponent(props){
    const stop = props.stop;   
    const type = props.type; 
    let defaultValue = props.default   
    const id = props.id;  
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token;  

    const [result,setResult]= useState()

    const [keyCountry, setKeyCountry] = useState('')

    const { data: listCountry } = useQuery(["listCountry",token], async() => await getValueFlag(token)); 
    const { data: dataFromCountry } = useQuery(
        ["listCity", keyCountry,token],
        () => getLocationFromCountry(keyCountry,token),
        { enabled: Boolean(keyCountry) }
      );
      const handleSelect = (e,o)=>{       
        if(o?.name === 'country'){
            setKeyCountry(e); 
        }
        setResult({
            ...result,
             [o?.name]:o?.data
        }) 
    }  
    const onFinish = (e)=>{   
        console.log(result);
        const key = 'updatable';
        let data = {
            id: id,
            data:{[type]: result},
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e === 403){
                message.error('This consultant does not have permission to change client');
            }else if(e === 400){
                message.error('Something wrong !'); 
            }
            else {
                    message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            } 
            stop()
        })  
        
    }

    return (
        <Form
        name="basic" 
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}  
        initialValues={ {[type] : defaultValue}}
    >
            <div  style={{display: 'flex', gap: '10px'}}>
        <Form.Item name={[type,'country']}  style={{width: '50%'}}>
                <Select  
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    placeholder="Country"  
                    onSelect={handleSelect} 
                   
                > 
                {listCountry?.data?.map((e)=>{
                    return <Select.Option name={"country"} data={e} key={e.key}>{e.label}</Select.Option>
                })} 
                </Select>  

            </Form.Item>

            <Form.Item name={[type,'city']} style={{width: '50%'}}>
                <Select 
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    placeholder="City"  
                    onSelect={handleSelect} 
                > 
                {dataFromCountry?.data?.map((e)=>{
                    return <Select.Option name={"city"} data={e} key={e.key.toString()}>{e.label}</Select.Option>
                })} 

                </Select>
            </Form.Item> 
            </div>
        <Form.Item style={{float: 'right'}} > 
            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px', marginRight: '10px'}}  htmlType="button" onClick={stop}  >
                Cancel
            </Button>  
            <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px'}} type="primary" htmlType="submit">
                Save
            </Button>
                
        </Form.Item>
    </Form>
    )
}