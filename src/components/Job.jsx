import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Spin, Table, Tag, Tooltip, Upload } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useRef } from "react";
import { useState } from "react";import moment from 'moment';
import { useQuery } from "react-query";
import { getDefaultProp, getLocationFromCountry, getPosition, getValueFlag } from "../features/candidate";
import { getAllClients } from "../features/client";
import { deteteImage,  getAllCategory, getCategoryType, getContactPerson, getDepartment, getImage, getJobById, updateJobs } from "../features/job";
import { getAllUsers } from "../features/user";
import { useAuth } from "../hooks/useAuth";
import { getLevelJob, getStatusJob, getTypeJob, listLevel, listStatus, listType } from "../utils/job";
import { fetchUpdateJob } from "../redux/reducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { InputCkeditor } from "./InputCkeditor/InputCkeditor";




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
    const { user: auth,logout } = useAuth();
    const dispatch = useDispatch();
    const token = auth?.token;

    const [editOnly, setEditOnly] = useState(false); 
    const [key,setKey]= useState('');
    const [data,setData]= useState();
    const [picture,setPicture]= useState(); 
    const [listDataJobDescriptions,setListDataJobDescriptions]= useState({});
  
    const { data: listInfoJob , refetch} = useQuery(
        ["jobdetail", params?.id, token],
        () => getJobById(params?.id, token)
    );       
    if (listInfoJob?.status === 401) {
        logout();
        localStorage.removeItem("auth");
      }
    const { data: listAllClients } = useQuery(
        ["listAllClientsJobs", token],
        async () => await getAllClients(token)
    ); 
    const { data: listALlUsers } = useQuery(
        ["listAllUsersJobs", token],
        async () => await getAllUsers(token)
    );   
    const { data: listContactPersion } = useQuery(
        ["listAllContactPersion", token],
        async () => await getContactPerson(listInfoJob?.client_id,token),
        {enabled: Boolean(listInfoJob)}
    );   
    const { data: listCategoryByType } = useQuery(
        ["listCategoryByType", token],
        async () => await getCategoryType(token), 
    ); 
    const { data: listAllCategory} = useQuery(
        ["lisAllCategory", token],
        async () => await getAllCategory(token), 
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
    const resetData = (data) => { 
        setData(data);
    }
    const resetPic = (data) => { 
        setPicture(data);
    }
    const handleSaveJobDescription =async (data,type)=>{   
        let result = {
            [type]:data
        }
       await dispatch(fetchUpdateJob({id: params?.id,data:result,token}))
        .then(unwrapResult)
        .then((e) => {   
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else { 
                refetch();
                resetData(e);
                message.loading({ content: 'Loading...', key,duration: 0.5 });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            }  
        })  
    }

    const handleIsShowToolbar = (value,type)=>{
        let listStatus = {...listDataJobDescriptions} 
        setListDataJobDescriptions({
            ...listStatus,
            [type]: {
                ...listStatus[type],
                status: value
            },
        });
    }
    const updateLink = ()=>{
        const key = 'updatable';
        const data = {}
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)
                    message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            }  
        })  
    }

    useEffect(()=>{
        // console.log(listInfoJob);
        if(listInfoJob){
            setData(listInfoJob);
            setListDataJobDescriptions({
                responsibility: {
                    key: 'responsibility',
                    status: false,
                    value: listInfoJob['responsibility']
                },
                expectation: {
                    key: 'expectation',
                    status: false,
                    value: listInfoJob['expectation']
                },
                kpi: {
                    key: 'kpi',
                    status: false,
                    value: listInfoJob['kpi']
                },
                selling_point: {
                    key: 'selling_point',
                    status: false,
                    value: listInfoJob['selling_point']
                },
                department_structure: {
                    key: 'department_structure',
                    status: false,
                    value: listInfoJob['department_structure']
                }, 
                competency: {
                    key: 'competency',
                    status: false,
                    value: listInfoJob['competency']
                }, 
                development_opportunity: {
                    key: 'development_opportunity',
                    status: false,
                    value: listInfoJob['development_opportunity']
                },  
                fill_rate: {
                    key: 'fill_rate',
                    status: false,
                    value: listInfoJob['fill_rate']
                },  
                recruitment_process: {
                    key: 'recruitment_process',
                    status: false,
                    value: listInfoJob['recruitment_process']
                },   
            })
        } 
    },[listInfoJob]) 
    const linkFacebook = data?.social_media?.filter(e=> e?.platform === "facebook");
    const linkWebsite = data?.social_media?.filter(e=> e?.platform === "website");
    const linkLinked = data?.social_media?.filter(e=> e?.platform === "linked");
    const linkOther = data?.social_media?.filter(e=> e?.platform === "other");

    if(data) {
        return <Content
            className="site-layout-background"
            style={{ 
            paddingTop: 12,
            margin: 0, 
            minHeight: 280,   
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
                                    <div style={{lineHeight: '35px'}}>{data?.job_id}</div> 
                                </Col>  
                            </Row> 
                            {/* {Job_title} */} 
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Job Title
                                </Col>
                                <Col className="job-infomation__content-item" span={16}> 
                                    {!(editOnly && (key==="title"))?
                                        <div onClick={handlerClickRow} value={'title'} ><div value={'title'} style={{lineHeight: '35px'}}>{data?.title?.label}</div></div>
                                    :<SelectComponent resetData={resetData} id={data?.id} stop={stopEdit} type={'title'} default={data?.title?.label}></SelectComponent>} 
                                </Col> 
                            </Row> 
                            {/* {Department} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Department
                                </Col>
                            <Col className="job-infomation__content-item" span={16}> 
                                    {!(editOnly && (key==="department"))?
                                        <div onClick={handlerClickRow} value={'department'} ><div value={'department'} style={{lineHeight: '35px'}}>{data?.department?.label}</div></div>
                                    :<SelectComponent resetData={resetData} id={data?.id}  stop={stopEdit} type={'department'} default={data?.department?.label}></SelectComponent>} 
                                </Col>  
                            </Row> 
                            {/* {Quantity} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Quantity
                                </Col>
                            <Col className="job-infomation__content-item" span={16}>
                            {!(editOnly && (key ==='quantity'))?<div value={"quantity"} onClick={handlerClickRow} >
                                            <div value={"quantity"}  style={{lineHeight: '35px'}}>{data?.quantity}</div>
                                    </div>
                                    : <InputNumberComponent resetData={resetData} id={data?.id}  stop={stopEdit} type={"quantity"} data={data?.quantity}></InputNumberComponent> }
                                
                            
                                </Col>  
                            </Row> 
                            {/* {Type} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Job Type
                                </Col>
                            <Col className="job-infomation__content-item" span={16}>  
                                    {!(editOnly && (key ==='type'))?<div value={"type"} onClick={handlerClickRow} >
                                        <div value={"type"} color={getTypeJob(data?.type)[0]?.color} style={{borderRadius: '5px',lineHeight: '35px'}}>{getTypeJob(data?.type)[0]?.label}</div> 
                                    </div>
                                    :<SelectComponent resetData={resetData} id={data?.id}  stop={stopEdit} default={getTypeJob(data?.type)[0]?.label} type={'type'}/> }
                                </Col>  
                            </Row> 
                            {/* {Level} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Experience Level
                                </Col>
                            <Col className="job-infomation__content-item" span={16}>  
                                    {!(editOnly && (key ==='experience_level'))?<div value={"experience_level"} onClick={handlerClickRow} >
                                        <div value={"experience_level"} color={getLevelJob(data?.experience_level)[0]?.color} style={{borderRadius: '5px',lineHeight: '35px'}}>{getLevelJob(data?.experience_level)[0]?.label}</div> 
                                    </div>
                                    :<SelectComponent resetData={resetData} id={data?.id}  stop={stopEdit} default={getLevelJob(data?.experience_level)[0]?.label} type={'experience_level'}/> }
                                </Col>  
                            </Row> 
                            {/* {Created by} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Created By
                                </Col>
                            <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                                    <div style={{lineHeight: '35px', textTransform: 'capitalize'}}>{data?.creator?.full_name}</div> 
                                </Col>  
                            </Row> 
                            {/* {Created on} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Created On
                                </Col>
                            <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                                    <div style={{lineHeight: '35px'}}>{formatDate(data?.createdAt)}</div> 
                                    
                                </Col>  
                            </Row> 
                            {/* {Last Updated} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Last Updated
                                </Col>
                            <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                                    <div style={{lineHeight: '35px'}}>{formatDate(data?.updatedAt)}</div>
        
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
                                    {!(editOnly && (key ==='status'))?<div value={"status"} onClick={handlerClickRow} ><Tag  value={"status"} color={getStatusJob(data?.status)[0]?.color}style={{borderRadius: '5px'}}>{getStatusJob(data?.status)[0]?.label}</Tag> </div>
                                    :<SelectComponent resetData={resetData} id={data?.id}  stop={stopEdit} default={getStatusJob(data?.status)[0]?.label} type={'status'}/> }
                                </Col>  
                            </Row> 
                            {/* {Open date} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Open Date
                                </Col>
                                <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                                    <div style={{lineHeight: '35px'}}>{formatDate(data?.target_date,'date')}</div> 
                                </Col> 
                            </Row> 
                            {/* {Expire date} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Expire Date
                                </Col>
                            <Col className="job-infomation__content-item job-infomation__content-item--disabled" span={16}>
                                    <div style={{lineHeight: '35px'}}>{formatDate(data?.end_date,'date')}</div> 
                                </Col>  
                            </Row> 
                            {/* {Extend Date} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Extend Date
                                </Col>
                            <Col className="job-infomation__content-item" span={16}>  
                                    {!(editOnly && (key==="extend_date"))?
                                        <div onClick={handlerClickRow} value={'extend_date'} ><div value={'extend_date'} style={{lineHeight: '35px'}}>{formatDate(data?.extend_date,'date')|| '-' }</div></div>
                                    : <DataPickerComponent resetData={resetData} id={data?.id}  type={"extend_date"} stop={stopEdit}  default={formatDate(data?.extend_date,'date')}></DataPickerComponent>} 
                                
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
                                            <div value={'location'} style={{lineHeight: '35px'}}>{(data?.location?.city?(data?.location?.city?.label)+" ":'')+( data?.location?.country?(data?.location?.country?.label):'-')}</div></div>
                                    :<LocationSelectComponent resetData={resetData} id={data?.id}  stop={stopEdit} type={'location'} default={data?.location}></LocationSelectComponent>} 
                                </Col>  
                            </Row> 
                            {/* {Client's Name} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Client's Name
                                </Col>
                            <Col className="job-infomation__content-item" span={16}> 
                                    {!(editOnly && (key==="client"))?
                                        <div onClick={handlerClickRow} value={'client'} ><div value={'client'} style={{lineHeight: '35px'}}>{data?.client?.name}</div></div>
                                    :<SelectComponent resetData={resetData} id={data?.id}  stop={stopEdit} data={listAllClients?.data} type={'client'} default={data?.client?.name}></SelectComponent>} 
                                </Col>  
                            </Row> 
                            {/* {Client's Contact Person} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Client's Contact Person 
                                </Col>
                            <Col className="job-infomation__content-item" span={16}> 
                                    {!(editOnly && (key==="pic"))?
                                        <div onClick={handlerClickRow} value={'pic'} ><div value={'pic'} style={{lineHeight: '35px', textTransform: 'capitalize'}}>{data?.pic?.map(e=> e.label).toString()|| '-'}</div></div>
                                    :<SelectMultipleComponent resetData={resetData} id={data?.id}  stop={stopEdit} data={listContactPersion?.data} type={'pic'} default={data?.pic?.map(e=> e.id)}></SelectMultipleComponent>} 
                                </Col>  
                            </Row> 
                            {/* {Search Consultant} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                Search Consultant
                                </Col>
                            <Col className="job-infomation__content-item" span={16}> 
                                    {!(editOnly && (key==="recruiters"))?
                                        <div onClick={handlerClickRow} value={'recruiters'} ><div value={'recruiters'} style={{lineHeight: '35px', textTransform: 'capitalize'}}>{data?.recruiters?.map(e=> e.label).toString()|| '-'}</div></div>
                                    :<SelectMultipleComponent resetData={resetData} id={data?.id}  stop={stopEdit} data={listALlUsers?.data} type={'recruiters'} default={data?.recruiters?.map(e=> e.key)}></SelectMultipleComponent>} 
                                </Col>  
                            </Row> 
                            {/* {Mapping by} */}
                            <Row>
                                <Col className="job-infomation__title-item" span={8}>
                                        Mapping by
                                </Col>
                            <Col className="job-infomation__content-item" span={16}>  
                                    {!(editOnly && (key==="related_users"))?
                                        <div onClick={handlerClickRow} value={'related_users'} ><div value={'related_users'} style={{lineHeight: '35px', textTransform: 'capitalize'}}>{data?.related_users?.map(e=> e.label).toString()|| '-'}</div></div>
                                    :<SelectMultipleComponent resetData={resetData} id={data?.id}  stop={stopEdit} data={listALlUsers?.data} type={'related_users'} default={data?.related_users?.map(e=> e.key)}></SelectMultipleComponent>} 
                                </Col>  
                            </Row> 
                        </Col>
                    </Row>
                
                </div>
            </div>   
            <div  className="job-industry ant-card ant-card-bordered" style={{ backgroundColor: "white", marginTop: "24px" }}>
                <header className="header-detail-job">
                    <h3 className="header-detail-job__title">Industry</h3>
                </header>
                <IndustryComponent id={params?.id} infoJob={data} listByType={listCategoryByType} allData={listAllCategory}></IndustryComponent>
            </div>
            <div className="job-attachment ant-card ant-card-bordered" style={{backgroundColor: "white", marginTop: "24px" }}>
                <header className="header-detail-job">
                    <h3 className="header-detail-job__title">Attachment</h3>
                </header>
                <AttachmentComponent resetData={resetData}  infoJob={data}></AttachmentComponent>
            </div>
            <div className="job-description ant-card ant-card-bordered" style={{backgroundColor: "white", marginTop: "24px",paddingBottom: "20px" }}>
                <header className="header-detail-job">
                    <h3 className="header-detail-job__title"><p>Job Description</p></h3>
                </header>
                <div style={{paddingInline: "24px"}}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <h3 className="title-job-description" >{'RESPONSIBILITIES / DAILY DUTIES'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.responsibility}/>
                        </Col>
                        <Col span={12}>
                            <h3 className="title-job-description" >{'ROLE EXPECTATIONS'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.expectation}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'MEASURES of SUCCESS? KPIs'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.kpi}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'SELLING POINT of THE ROLE'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.selling_point}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'DEPARTMENT STRUCTURE'}</h3>
                            <p>(Manager - Subordinates - Team - Organisation chart? - Where do they fit in the entire company)</p>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.department_structure}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'COMPETENCIES / BEHAVIOURS'}</h3>
                            <div><p>(The client is looking for vs candidate's competencies)</p></div>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.competency}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'DEVELOPMENT OPPORTUNITIES'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.development_opportunity}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'SUCCESSFUL FILL RATE'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.fill_rate}/>
                        </Col> 
                        <Col span={12}>
                            <h3 className="title-job-description" >{'RECRUITMENT PROCESS'}</h3>
                            <InputCkeditor function={{handleIsShowToolbar, handleSaveData: handleSaveJobDescription}} data={listDataJobDescriptions.recruitment_process}/>
                        </Col> 
                    </Row>
                </div>
                <div style={{paddingInline: "24px"}}>
                    <strong><p>DISPLAY ON</p></strong>
                    <div><p>Website: <TagLink data={linkWebsite}/></p></div>
                    <div><p>Linked in: <TagLink data={linkLinked} /></p></div>
                    <div><p>Facebook: <TagLink data={linkFacebook}/></p></div>
                    <div><p>Others: <TagLink data={linkOther}/></p></div> 
                </div>
            </div>  
        </Content>
    }else{
        return (
            <Spin style={{marginTop: '200px', minHeight: "1000px"}} indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
          );
    }
}



function SelectComponent(props) { 
    const defaultValue = props.default;  
    const stop = props.stop;   
    const type = props.type; 
    const resetData= props.resetData;
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
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)
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
    const resetData= props.resetData;
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
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)
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
    const resetData = props.resetData;
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
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)
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
    const resetData = props.resetData;
    const id = props.id; 
 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token; 
    let defaultValue = props.default    
    if(defaultValue){
        defaultValue = moment(props.default, dateFormat);
    } 
    const onFinish = (e)=>{   
        let date = e[type]?.format('YYYY-MM-DD')
        const key = 'updatable';
        let data = {
            id: id+'/extend',
            data: {[type]:date},
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)
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
    const resetData = props.resetData;
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token;  
    const [form] = Form.useForm();

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
            let objLocation = form.getFieldValue()?.location; 
            delete objLocation['city']
            form.setFieldsValue({
                location: {
                    ...objLocation
                }
              }); 
            setKeyCountry(e); 
        }

        setResult({
            ...result,
             [o?.name]:o?.data
        }) 
    }  
    const onFinish = (e)=>{    
        const key = 'updatable';
        let data = {
            id: id,
            data:{[type]: result},
            token
          };
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)
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
        form={form}
        name="location" 
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
  
function IndustryComponent (props){
    const listByType = props.listByType;
    const allCategory = props.allData; 
    const infoJob = props?.infoJob;
    const [form] = Form.useForm();
    
    const [dataJob,setData]= useState(infoJob.business_line)
    const [sector, setSector]= useState();
    const [category,setCategory]= useState();  

    const [checked, setChecked] = useState(false)
     
    
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token;  
 

    const updateData= async(arr)=>{
        const key = 'updatable';
        let data = {
            id: infoJob.id,
            data:{business_line: [
                ...arr 
        ]},
            token
        }; 

        await dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {    
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {  
                setData(()=> e.business_line);
                message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            }  
        })  
    } 
    const onChangeIndustry = (e)=>{  
        const arr = listByType?.data?.filter(res => res.key === e)
        setSector(arr[0]?.sub_categories)
        setChecked(true)
        //Clear value in sector and category
        const listData = form.getFieldValue();
        delete listData['sector'];
        delete listData['category'];
        form.setFieldsValue({...listData}) 
    }
    const onChangeSector = (e)=>{ 
        const arr = allCategory?.data?.filter(res => res?.parent_categories?.key === e)
        setCategory(arr)

        //Clear value in category 
        const listData = form.getFieldValue();
        delete listData['category'];
        form.setFieldsValue({...listData}) 
    }
    const onFinish =(e)=>{ 
        if(!e.industry) return;
        let value = e;
        // let check = dataJob.find(res=>res.industry.id === e.industry.id && res?.category?.id === e?.category?.id && res?.sector?.id === e?.sector?.id) 

        let isIndustryExist =  Boolean(value.industry); 
        let isSectorExist =  Boolean(value.sector);
        let isCategoryExist =  Boolean(value.category);

          let isExists = dataJob.filter(e => { 
            let isIndustryExistData =  Boolean(e.industry.id); 
            let isSectorExistData  =  Boolean(e.sector?.id);
            let isCategoryExistData  =  Boolean(e.category?.id); 
            return (isIndustryExistData===isIndustryExist && isSectorExistData===isSectorExist && isCategoryExistData===isCategoryExist) 
            }).filter(e => { 
                let result = false;
                if(isIndustryExist){
                    result = value.industry === e.industry.id;
                }
                if(isSectorExist){
                    result = value.sector === e.sector.id; 
                }
                if(isCategoryExist){
                    result = value.sector === e.sector.id; 
                }
                return result
            }).length > 0;

        if(isExists){
            form.setFieldsValue({
                industry: null,
                sector: null,
                category: null
            })   
            setChecked(false);
            setSector(null)
            setCategory(null)
            message.error({content:'Duplicate value !',
            style: { 
              float: 'right'
            }}); 
            return;
        }
        let arr = dataJob.map(e => {
            return {
                industry_id: e?.industry?.id,
                sector_id: e?.sector?.id,
                category_id: e?.category?.id,
                primary: e.primary            
            }
        })
        const key = 'updatable';
        let data = {
            id: infoJob.id,
            data:{business_line: [
                ...arr,
                {
                industry_id:  e.industry,
                sector_id: e.sector,
                category_id: e.category,
                primary: -1
                }
        ]},
            token
          }; 
        dispatch(fetchUpdateJob(data))
        .then(unwrapResult)
        .then((e) => {   
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                message.loading({ content: 'Loading...', key }); 
                setData(e.business_line)
                form.setFieldsValue({
                    industry: null,
                    sector: null,
                    category: null
                })   
                setChecked(false); 
                setSector(null)
                setCategory(null)
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500); 
            }  
        })  

    } 
    const deleteIndustry = (value)=>{
        if(!value.industry) return; 
        let isIndustryExist =  Boolean(value.industry.id); 
        let isSectorExist =  Boolean(value.sector?.id);
        let isCategoryExist =  Boolean(value.category?.id);

           
        //get row del 

        // let arr = dataJob.filter(e => { 
        //     let isIndustryExistData =  Boolean(e.industry.id); 
        //     let isSectorExistData  =  Boolean(e.sector?.id);
        //     let isCategoryExistData  =  Boolean(e.category?.id); 
        //     return (isIndustryExistData===isIndustryExist && isSectorExistData===isSectorExist && isCategoryExistData===isCategoryExist) 
        // }).filter(e => { 
        //     let result = false;
        //     if(isIndustryExist){
        //         result = value.industry.id === e.industry.id;
        //     }
        //     if(isSectorExist){
        //         result = value.sector.id === e.sector.id; 
        //     }
        //     if(isCategoryExist){
        //         result = value.sector.id === e.sector.id; 
        //     }
        //     return result
        // })
 
        let arr = dataJob.filter(e => {
            let result = false;
            let isIndustryExistData =  Boolean(e.industry.id); 
            let isSectorExistData  =  Boolean(e.sector?.id);
            let isCategoryExistData  =  Boolean(e.category?.id); 
            result = (isIndustryExistData===isIndustryExist && isSectorExistData===isSectorExist && isCategoryExistData===isCategoryExist);
            
            if(result && isIndustryExist){
                result = value.industry.id === e.industry.id;
            }
            if(result &&isSectorExist){
                result = value.sector.id === e.sector.id; 
            }
            if(result && isCategoryExist){
                result = value.sector.id === e.sector.id; 
            }
            return !result 
        })

        let data = []
        if(arr.length > 0){
            data = arr.map(e => {
                let sector=e?.sector?{sector_id:e?.sector?.id}:null 
                let category=e?.category?{category_id:e?.category?.id}:null 
                return {
                    industry_id: e?.industry?.id,
                    ...sector,
                    ...category,
                    primary: e.primary            
                }
            })
        } 
        updateData(data);
    }

    const resetForm = ()=>{  
        form.setFieldsValue({
            industry: null,
            sector: null,
            category: null
        })   
        setChecked(false);
    }
    const handlePrimary = (value) =>{ 
        // console.log(value); 

        if(!value.industry) return; 

        let arr = dataJob.map(e => { 
            if(value.industry.id === e.industry.id){
                let sector;
                if(e?.sector){
                    sector = {sector_id: e?.sector?.id};
                }
                let category;
                if(e?.category){
                    category = {category_id:e?.category?.id};
                } 
                return {
                    industry_id: Number(e?.industry?.id),
                    ...sector,
                    ...category,
                    primary: e.primary*-1}
            }
            else {
                let sector;
                if(e?.sector){
                    sector = {sector_id: e?.sector?.id};
                }
                let category;
                if(e?.category){
                    category = {category_id:e?.category?.id};
                } 
                return {
                    industry_id: e?.industry?.id,
                    ...sector,
                    ...category,
                    primary: e.primary            
                }
            }
           
        })  
        updateData(arr);
    }
    const columns = [
        {
            title: 'Primary',
            dataIndex: 'primary',
            key: 'primary',
            render: (text,record) => {   
                return <Checkbox  defaultChecked={text===1} onClick={() => handlePrimary(record)}></Checkbox> 
            },
        },
        {
          title: 'Industry',
          dataIndex: 'industry',
          key: 'industry',
          render: (text) =><div>{text?.label}</div>,
        },
        {
          title: 'Sector',
          dataIndex: 'sector',
          key: 'sector',
          render: (text) =><div>{text?.label}</div>,
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          render: (text) =><div>{text?.label}</div>,
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          render: (text, record)=> <DeleteOutlined  style={{color: 'red',cursor: 'pointer'}} onClick={()=>deleteIndustry(record)}/>
        },
      ];  
    return (
    <div>
        <Form  
        form={form}
        name="location" 
        onFinish={onFinish}
        initialValues={{}}
        // onFinishFailed={onFinishFailed}  
         > 
         <div style={{display: 'flex', gap: '10px', padding: '10px 24px'}}> 
            <Form.Item style={{width: '100%'}} name={'industry'}>
                <Select
                    showSearch 
                    placeholder="Select your industry"
                    optionFilterProp="children"
                    onChange={onChangeIndustry}
                    // onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {listByType?.data?.map(e=>{
                        return (
                            <Select.Option key={e.key} data={e} value={e.key}>{e.label}</Select.Option>
                        )
                    })} 
                </Select>
            </Form.Item>
            <Form.Item style={{width: '100%'}} name={'sector'}>
                <Select
                    disabled={!Boolean(sector)}
                    showSearch
                    placeholder="Select your sector" 
                    onChange={onChangeSector}
                    // onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {sector?.map(e=>{
                        return (
                            <Select.Option key={e.key} data={e} value={e.key}>{e.label}</Select.Option>
                        )
                    })} 
                </Select>
            </Form.Item>
            <Form.Item style={{width: '100%'}} name={'category'}>
                <Select
                   disabled={!Boolean(category)}
                    showSearch
                    placeholder="Select your category"  
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {category?.map(e=>{
                        return (
                            <Select.Option key={e.key} data={e} value={e.key}>{e.label}</Select.Option>
                        )
                    })} 
                </Select>
            </Form.Item> 
         </div>
         {checked?<Form.Item style={{float: 'right', marginRight: '24px'}}  > 
                    <Button onClick={ ()=> resetForm()} style={{lineHeight: '24px', height: '24px', padding: '0 8px', marginRight: '10px', color: 'red', borderColor: 'red'}}  htmlType="button"  >
                        Cancel
                    </Button>  
                    <Button style={{lineHeight: '24px', height: '24px', padding: '0 8px'}} type="primary" htmlType="submit">
                        Save Industry
                    </Button> 
            </Form.Item>:<></>}
            
        </Form> 
         
      <Table  
        rowKey={obj => [obj.industry.id, obj?.sector?.id, obj?.category?.id]}
        style={{ padding: '10px 24px'}}
        columns={columns}
        dataSource={dataJob}
      />
    </div>
    )
}
 
function AttachmentComponent(props){
    const infoJob = props.infoJob; 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const resetData = props.resetData; 
    const token = auth?.token;    
    const DOMAIN = 'https://lubrytics.com:8443'; 
    const [fileList, setFileList] = useState(); 
    const formatImage = (arr)=>{
        return arr.map(e=>{ 
            return {
                uid: e.id,
                name: e.name, 
                url: `${DOMAIN}/nadh-mediafile/file/${e.id}`,
            }
        })

    } 
    const { data: listPicture, refetch } = useQuery(["listImagea",token], async() => await getImage(infoJob.id,'job',token));      

    useEffect(() => {
        let list = formatImage(listPicture?.data || [])
        setFileList(list);
    },[listPicture])
    // console.log(listPicture);

    const updateData = async (idImg) => { 
        let prevData = infoJob?.mediafiles?.files||[]; 
        let newData = {mediafiles:{
            files: [
                ...prevData,
                idImg
            ]
        }} 
        console.log(newData);
        const key = 'updatable';
        await dispatch(fetchUpdateJob({id:infoJob.id, data:newData, token}))
        .then(unwrapResult)
        .then((e) => {   
            if(e.status === 403){
                message.error('You don\'t have permission to update.');
            }else if(e.status === 400){
                message.error('Something wrong !'); 
            }
            else {
                resetData(e)  
                refetch()
                message.loading({ content: 'Loading...', key });
                setTimeout(() => {
                    message.success({ content: 'Updated success !', key, duration: 2 });
                }, 500);  
            }  
        })   
    }
   
    const uploadImage = async options => {
        const { onSuccess, onError, file } = options;
        // console.log(file);
        const fmData = new FormData();
        const config = {
          headers: { "content-type": "multipart/form-data" }, 
        };
        fmData.append("file", file); 
        fmData.append("obj_table", 'job'); 
        fmData.append("obj_uid", infoJob?.id);  
        try {
          const res = await axios.post(
            "https://lubrytics.com:8443/nadh-mediafile/file",
            fmData,
            config
          ); 
          onSuccess("Ok"); 
          updateData(res?.data?.id);

          console.log("server res: ", res);
        } catch (err) {
        //   console.log("Error: ", err);
        //   const error = new Error("Some error");
          onError({ err });
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
      
        const isLt2M = file.size / 1024 / 1024 < 2;
      
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
      
        return isJpgOrPng && isLt2M;
    };

    const onChange = (file) => {   
    };

    const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
        src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj); 
        reader.onload = () => resolve(reader.result);
        });
    } 

        let modal = document.getElementById("myModal");  
        let modalImg = document.getElementById("img");
        let captionText = document.getElementById("caption");

        modal.style.display = "block";
        modalImg.src = src; 
        captionText.innerHTML =` Name: ${file.name}`; 
 
        var span = document.getElementsByClassName("close")[0];
 
        span.onclick = function() { 
        modal.style.display = "none";
        }
    };
    const onRemove = async(file) => { 
        const key = 'updatable';
        let data = infoJob.mediafiles.files || [];
        let result = data.filter(e => e !== file.uid);    
        console.log(data);
        console.log(result); 
        await deteteImage(file.uid, token).then(res => 
        {
            if(res.status === 202){ 
                updateJobs(infoJob.id,{mediafiles:{files: result} },token);
                refetch()
                message.success({ content: 'Updated success !', key, duration: 2 });  
            }
        }) 
        return;
    }
    const onDownload = async(file)=>{
        console.log(file);
    }
    const propsUpload = { 
        listType:"picture-card",
        customRequest:uploadImage,
        onRemove: onRemove, 
        onPreview:onPreview,
        onDownload: onDownload,
        beforeUpload: beforeUpload, 
        onChange:onChange,
        fileList,
      };
     
    return (
        <div  style={{marginInline: '24px', paddingBottom: '20px'}}>
         <Upload    
            {...propsUpload}
        >
            {fileList?.length < 10 && <div>
                <p>{`+`}</p>
                <p>{`Upload`}</p>
                
                </div>}
        </Upload>   
        </div>
    )
}

function TagLink(props){ 
    const data = props.data;
    const [tags, setTags] = useState(data?.map(e=> e?.url));
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    useEffect(() => {
      if (inputVisible) {
        inputRef.current?.focus();
      }
    }, [inputVisible]);
    useEffect(() => {
      editInputRef.current?.focus();
    }, [inputValue]);
  
    const handleClose = (removedTag) => {
      const newTags = tags.filter((tag) => tag !== removedTag); 
      setTags(newTags);
    };
  
    const showInput = () => {
      setInputVisible(true);
    };
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const handleInputConfirm = () => {
      if (inputValue && tags.indexOf(inputValue) === -1) {
        setTags([...tags, inputValue]);
      }  
      setInputVisible(false);
      setInputValue('');
    };
  
    const handleEditInputChange = (e) => {
      setEditInputValue(e.target.value);
    };
  
    const handleEditInputConfirm = () => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;
      setTags(newTags);
      setEditInputIndex(-1);
      setInputValue('');
    };
    return (
        <>
          {tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={tag}
                  size="small"
                  className="tag-input"
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
    
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                className="edit-tag"
                key={tag}
                closable={true}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                      e.preventDefault(); 
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible && (
            <Input
              ref={inputRef}
              style={{display: 'inline-block', width: 100}}
              type="text"
              size="small"
              className="tag-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag className="site-tag-plus" onClick={showInput}>
              <PlusOutlined /> New Tag
            </Tag>
          )}
        </>
      );
}