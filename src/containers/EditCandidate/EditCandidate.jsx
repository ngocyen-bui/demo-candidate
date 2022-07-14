import {
    Breadcrumb, Button, Col, Collapse, message, Row, Spin, Upload, Timeline, Modal, DatePicker, Select, Input, Comment, Menu, Dropdown
  } from "antd";
  import Layout from "antd/lib/layout/layout";
  import { useEffect, useState } from "react"; 
  import { Link, useParams } from "react-router-dom"; 
  import StringToReact from 'string-to-react'
  import {
    compareCDDWithJob,
    getCandidate 
  } from "../../features/candidate"; 
  import TextArea from "antd/lib/input/TextArea";
  import { DetailCandidate } from "../../components/Candidate";
import { LoadingOutlined, MoreOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons"; 
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { fetchUpdateCandidate } from "../../redux/reducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { useQuery } from "react-query";
import { deteteImage, getImage, getJob, getJobAdvance } from "../../features/job";
import { candidate_flow_status, findFlowStatus } from "../../utils/interface";
import { formatDate } from "../../utils/formatDate";
import { getStatusJob } from "../../utils/job";
import { getAllUsers } from "../../features/user"; 
import { InputCkeditor } from "../../components/InputCkeditor/InputCkeditor";
  
  
  export default function AddCandidate(props) {  
    const params = useParams();
 
    const { loading} = useSelector((state) => state.candidate) 
    
  
 
if (loading === 'PENDING') { 
  return (
    <Spin style={{marginTop: '200px', minHeight: "1000px"}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  );
} else {
    return (
      <Layout>
        <Layout
          style={{ marginTop: '100px',padding: "0 24px 100px 24px ", minHeight: "800px" }}
        >
          <Breadcrumb separator="/" style={{ position: "fixed", paddingLeft: '24px', right: 0, left: 0, backgroundColor: "#F0F2F5" ,zIndex:2, lineHeight: '44px'}}>
            <Breadcrumb.Item>
              <Link to="/candidates">Candidates List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">Detail Candidate</Breadcrumb.Item>
          </Breadcrumb>
    
        <Row gutter={16} style={{ marginTop: 44}}>
          <Col span={16}>
            <Layout style={{padding: '10px 20px', background: '#fff'}}>
              <h4 style={{ fontSize: 16, color: '#465f7b', fontWeight: 600}}> Overview</h4>
              <TextArea placeholder="Overview" rows={4} />
            </Layout>
            <DetailCandidate disabled={false} params={params} edit={true}/>
            <div className="candidate-attachment ant-card ant-card-bordered" style={{backgroundColor: "white", marginTop: "24px" }}>
                  <header className="header-detail-candidate">
                      <h3 className="header-detail-candidate__title">Attachment</h3>
                  </header>
                  <AttachmentComponent params={params}></AttachmentComponent>
              </div>
          </Col>
          <Col span={8} style={{position: 'fixed', right: 0, width: '100%'}}>
             <InterviewLoop id={params.id}/>
          </Col>
        </Row>
        </Layout>
      </Layout>
    ); 
  } 
  }

 
  function InterviewLoop(props){
    const id = props.id;
    const { Panel } = Collapse; 

    const { user: auth } = useAuth(); 
    const token = auth?.token; 

    const { data: totalDataCDD } = useQuery(
      ["infoInterviewsJobs" , id, token],
      async () => await getCandidate(  id, token), 
    );   
    const [showModal,setShowModal] = useState({});
    const [showModalAssessment,setShowModalAssessment] = useState({});
    const [showModalPickJob,setShowModalPickJob] = useState({});
    const handleCancelModal = () => {
      setShowModal({ 
        visible: false
      })
      setShowModalAssessment({visible: false})
      setShowModalPickJob({visible: false})
    };
    const handleShowModal = ({handleCancelModal,dataFlow,data,date,status,visible,location}) => {
      setShowModal({
        handleCancelModal: handleCancelModal,
        dataFlow: dataFlow,
        data: data,
        date: date,
        status: status,
        visible: visible,
        location: location
      })
    } 
    const handlePickJob = ({visible,dataCDD,handleCancelModal}) => {
      setShowModalPickJob({ 
        visible,dataCDD,handleCancelModal
      })
    } 
    const handleShowModalAssessment = ({handleCancelModal,dataCDD,dataJob,visible,idCDD,idJob})=>{
      setShowModalAssessment({
        handleCancelModal,
        visible,
        idCDD,
        idJob,
        dataCDD: dataCDD,
        dataJob
      })
    }
    const menu = (e)=>{ 
      return (
        <Menu
          onClick={()=>handleShowModalAssessment({handleCancelModal,dataCDD:totalDataCDD, dataJob: e ,visible: true, idCDD: totalDataCDD?.id, idJob: e?.job_id})}
          items={[
            {
              label: 'Candidate Assessment',
              key: '1', 
            }, 
          ]}
        />
      )
    };
    const genExtra = (e) => { 
      return (
        <Dropdown overlay={menu(e)} trigger={['click']}>
          <MoreOutlined/>
      </Dropdown>
        
      );
    }
    const header = (data)=>{  
      return <div>
        <div style={{fontWeight: 600, fontSize: '16px'}}>{`${data?.job_id} - ${data?.title?.label}`}</div>
        <div style={{fontWeight: 600, opacity: 0.6, fontSize: '14px'}}>{`${data?.client?.name} - ${data?.client?.client_id}`}</div>
      </div>
    } 
    return (
      <div style={{width: '100%', backgroundColor: "red" }}>
         <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#fff'}}>
          <h4 style={{ fontSize: 16, color: '#465f7b', fontWeight: 600}}> Interview Loop</h4> 
          <Button style={{ color: '#1890ff', borderColor: '#1890ff'}} onClick={()=>handlePickJob({handleCancelModal, dataCDD: totalDataCDD,visible: true})}><PlusOutlined/>Pick Job</Button>
        </div>
        <Collapse accordion >
          {totalDataCDD?.flows?.map((e,i)=>{
          let dataFlow = e;
           let primaryTitle = e?.job; 
           let flow = e?.flow;
           let idFlow=e.id;
           return <Panel header={header(primaryTitle)} key={idFlow} extra={genExtra(e)}>
                  <Timeline>
                      {
                        flow?.map((e,i)=>{
                          let status = findFlowStatus(e?.current_status); 
                          let date = e?.info?.time || formatDate(e?.createdAt);
                          let countComment = e?.comments?.length; 
                          return (
                            <div key={i} >
                              <Timeline.Item style={{cursor: 'pointer'}} color="green" onClick={()=> handleShowModal({handleCancelModal, dataFlow:dataFlow, data:e,date,status, visible:true, location: i})}>
                                <strong>{status?.label}</strong>
                                <p style={{marginBottom: 0, fontWeight: 600, opacity: 0.7}} >{date}</p>
                                <p style={{marginBottom: 0, fontWeight: 600, opacity: 0.7}} >{`${countComment} comments`}</p>
                              </Timeline.Item>   
                            </div>
                          )
                        })
                      } 
                  </Timeline> 
            </Panel> 
          })} 
        </Collapse>
        <ModalFlow {...showModal}/>
        <CandidateAssessment {...showModalAssessment}/>
        <PickJob {...showModalPickJob}/>
      </div>
    );
  }
  
function ItemAssessment(props){
  const title = props.title || "-";
  const dataCDD = props.dataCDD !== "" ?props.dataCDD : "-";
  const dataJob = props.dataJob !== "" ?props.dataJob : "-";
  if(Array.isArray(dataJob)||Array.isArray(dataCDD)){
    return <Row>
        <Col span={6}><p><strong>{title}</strong></p></Col>
        <Col span={8}>{dataCDD?.map(e => {
          let sector = e?.sector? "/"+ e?.sector?.label: "";
          let category = e?.category? "/"+ e?.category?.label: "";
          return <p>{e?.industry?.label + sector + category}</p>
        })}</Col>
        <Col span={2}><p>Vs.</p></Col>
        <Col span={8}>{dataJob?.map(e => {
          let sector = e?.sector? " / "+ e?.sector?.label: "";
          let category = e?.category? " / "+ e?.category?.label: "";
          return <p>{e?.industry?.label + sector + category}</p>
        })}</Col>
      </Row>
  }

  return <Row>
    <Col span={6}><p><strong>{title}</strong></p></Col>
    <Col span={8}><p>{dataCDD}</p></Col>
    <Col span={2}><p>Vs.</p></Col>
    <Col span={8}>{dataJob}</Col> 
  </Row>
} 
function CandidateAssessment(props){
  const { user: auth } = useAuth();
  const token = auth?.token;  
  const visible = props.visible;
  const handleCancelModal = props.handleCancelModal;
  const idCDD = props.idCDD;
  const idJob = props.idJob;
  const dataCDD = props.dataCDD;
  const dataJob = props.dataJob;
 
  const { data: dataCompare } = useQuery(
    ["dataCompare", idCDD,idJob,token],
    async () => await compareCDDWithJob(idCDD,idJob,token),
    {enabled: (Boolean(idCDD) && Boolean(idJob))}
  );   
   
  const CDD = dataCompare?.candidate;
  const JOB = dataCompare?.job;
  return (
    <Modal
    visible={visible}
    title={<strong>Candidate Assessment</strong>}
    // onOk={handleOk}
    onCancel={handleCancelModal}
    width={900}
    footer={false}
  >
    <Row>
      <Col span={6}></Col>
      <Col span={8}><strong style={{opacity: 0.8}}>{`CANDIDATE: ${dataCDD?.candidate_id} - ${dataCDD?.full_name}`}</strong></Col>
      <Col span={2}><p>Or</p></Col>
      <Col span={8}><strong style={{opacity: 0.8}}>{`JOB: ${dataJob?.job?.job_id} - ${dataJob?.job?.title?.label}`}</strong></Col> 
    </Row> 
    <ItemAssessment title={"Year of Management"} dataCDD={CDD?.industry_experience} dataJob={JOB?.industry_experience}/>
    <ItemAssessment title={"Industry Year of Services"} dataCDD={CDD?.role_experience} dataJob={JOB?.role_experience}/> 
    <ItemAssessment title={"Industry"} dataCDD={CDD?.industry} dataJob={JOB?.industry}/> 
    <ItemAssessment title={"Appearance"} dataCDD={CDD?.appearance} dataJob={JOB?.appearance}/> 
    <ItemAssessment title={"Attitude"} dataCDD={CDD?.attitude} dataJob={JOB?.attitude}/> 
    <ItemAssessment title={"Communication"} dataCDD={CDD?.communication} dataJob={JOB?.communication}/> 
    <ItemAssessment title={"Job Competencies"} dataCDD={CDD?.competency} dataJob={JOB?.competency}/> 
    <ItemAssessment title={"Strengths"} dataCDD={CDD?.strength} dataJob={JOB?.strength}/> 
    <ItemAssessment title={"Others"} dataCDD={CDD?.other} dataJob={JOB?.other}/> 
    
  </Modal>
  )
}
function ModalFlow(props){ 
  const { user: auth } = useAuth();
  const token = auth?.token;  

  // const { Panel } = Collapse; 
  const visible = props.visible;
  const handleCancelModal = props.handleCancelModal;
  const status = props.status; 
  const dataFlow = props.dataFlow;
  const data = props.data;
  const date = props.date;   ;
  const location = props.location; 
 
  const statusJob = dataFlow?.job?.status;

  const [isShowBtnConsultant, setIsShowBtnConsultant] = useState(false); 
  const [isShowActionBtn, setIsShowActionBtn] = useState(false); 
  const [isEnable, setIsEnable] = useState(false);

  const [comment,setComment] = useState({
    key: 'comment_interview',
    status: false,
    value: "",
  })

  const { data: listALlUsers } = useQuery(
    ["listAllUsersInterviews", token],
    async () => await getAllUsers(token)
  );   
  useEffect(() =>{
    setIsEnable(statusJob < 0)
    },[statusJob]
  )
  const onChangeAction = ()=>{
    setIsShowActionBtn(true)
  }
  const onChangeConsultant = () => {
    setIsShowBtnConsultant(true)
  }
  const genExtra = () => (
    <MoreOutlined 
      onClick={event => {
        // If you don't want click extra trigger collapse, you can prevent this:
        console.log(event);
        event.stopPropagation();
      }}
    />
  ); 
  const handleIsShowToolbar = (data,type)=>{
    let result = {...comment}
    result.status = data;

    setComment(result)
  }
  const handleSaveData = (value,type)=>{ 
    let result = {...comment}
    result.value = ""; 
    setComment(result);

    let dataSave = {
      content: value,
      source_uuid: dataFlow?.id,
      source:  {
        module: "candidate_flow", 
        section: "flow_status", 
        id: data?.id
      }
    }
    console.log(dataSave);


  }
  return (
    <> 
    <Modal
      visible={visible}
      title={<strong>{`${status?.label} - ${date}`}</strong>}
      // onOk={handleOk}
      onCancel={handleCancelModal}
      width={900}
      footer={false}
    >
      <Row gutter={8}>
          <Col span={12}>
          {/* {Creator} */}
          <Row>
            <Col span={8}>
                <strong> Creator</strong>
            </Col>
            <Col span={16}>
              <p>{`${data?.creator?.full_name} - ${data?.creator?.role?.name}`}</p>
            </Col>
          </Row>
          {/* {Job} */}
          <Row>
            <Col span={8}>
                <strong>Job</strong>
            </Col>
            <Col span={16}>
              <p>{`${dataFlow?.job?.title?.label||"-"}`}</p>
            </Col>
          </Row>
          {/* {Job-code} */}
          <Row>
            <Col span={8}>
                <strong>Job-code</strong>
            </Col>
            <Col span={16}>
              <p>{`${dataFlow?.job?.job_id||"-"}`}</p>
            </Col>
          </Row>
           {/* {Job-status} */}
           <Row>
            <Col span={8}>
                <strong>Job-status</strong>
            </Col>
            <Col span={16}>
              <p>{`${getStatusJob(dataFlow?.job?.status)[0]?.label|| "-"}`}</p>
            </Col>
          </Row>
          {/* {Action} */}
          {location === 0?
           <Row  style={{marginBottom: '8px'}}>
            <Col span={8}>
                <strong>Action</strong>
            </Col>
            <Col span={16}>
              <Select
                  disabled={isEnable}
                  showSearch
                  mode="multiple"
                  placeholder="Please select flow status"
                  optionFilterProp="children"
                  onChange={onChangeAction}
                  // onSearch={onSearch}
                  style={{width: '100%'}}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {candidate_flow_status?.map(e=>{
                    return <Select.Option key={e?.id} style={{textTransform: 'capitalize'}} value={e?.id}>{e?.label}</Select.Option>
                  })} 
                </Select>
            {isShowActionBtn?<Button type="primary" style={{float: 'right'}} className="interview-btn" onClick={()=>setIsShowActionBtn(false)} >Save</Button>:<></>}
            </Col>
          </Row>:
          <></>}
           
           {/* {Date} */}
           <Row>
            <Col span={8}>
                <strong>Date</strong>
            </Col>
            <Col span={16}>
              <DatePicker disabled={isEnable} showTime style={{width: '100%'}} showToday={false} onOk={e=> console.log(e)}/>
            </Col>
          </Row>
          {/* {Consultant} */}
          <Row style={{marginTop: '8px'}}>
            <Col span={8}>
                <strong>Consultant</strong>
            </Col>
            <Col span={16} >
              <Select
                  disabled={isEnable}
                  showSearch
                  mode="multiple"
                  placeholder="Please select interviewer"
                  optionFilterProp="children"
                  onChange={onChangeConsultant}
                  // onSearch={onSearch}
                  style={{width: '100%'}}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {listALlUsers?.data?.map(e=>{
                    return <Select.Option key={e?.id} style={{textTransform: 'capitalize'}} value={e?.id}>{e?.full_name}</Select.Option>
                  })} 
                </Select>
                {isShowBtnConsultant?<Button type="primary" style={{float: 'right'}} className="interview-btn" onClick={()=>setIsShowBtnConsultant(false)} >Save</Button>:<></>}
                
            </Col>
          </Row>
           </Col> 
           <Col span={12}> 
              {/* {Comments} */}
              <div style={{borderLeft: '1px solid rgb(221, 221, 221)', paddingLeft: '10px'}}> 
                  <p><strong>Comments</strong></p> 
                  {isEnable?<Input placeholder="Add content..." disabled={isEnable}/>:
                  <InputCkeditor function={{handleIsShowToolbar,handleSaveData}} data={comment} isClear={true}/>}
                  
                  <p style={{paddingTop: "6px"}}>{data?.comments?.length} comments</p>
              </div> 
              
              {data?.comments?.length > 0? dataFlow?.flow_comments?.map(e=>{
                return <Comment 
                  style={{marginLeft: '16px', borderBottom: "1px solid rgb(0 0 0 / 20%)" }}
                  key={e?.id}
                  actions={genExtra()}
                  author={<strong style={{textTransform: 'capitalize'}}>{e?.user?.full_name}</strong>}
                  avatar={`https://lubrytics.com:8443/nadh-mediafile/file/${e?.user?.mediafiles?.avatar}`}
                  content={StringToReact(e?.content)}
                  datetime={formatDate(e?.createdAt)}
                /> 
              }): null}
              
             
        </Col> 
      </Row>
    </Modal>
  </>
  )
}
function PickJob(props){
  const { user: auth } = useAuth();
  const token = auth?.token;  
  const visible = props.visible;
  const dataCDD = props.dataCDD;
  const handleCancelModal = props.handleCancelModal;
  const creator_id = dataCDD?.creator?.id;
 

  const [oldData,setOldData] = useState([])
  const [value,setValue] = useState("");
  const [resetData, setResetData] = useState([])
  const [data,setData] = useState();

  const { data: dataJobPick } = useQuery(
    ["dataJobPick", creator_id,token],
    async () => await getJob(creator_id,token), 
    {enabled: Boolean(creator_id)}
  );   
  const { data: dataJobPickAdvance } = useQuery(
    ["dataJobPickAdvance", value,token],
    async () => await getJobAdvance(value,token), 
    {enabled: Boolean(value)}
  );    
  const handleSelectJob = (e)=>{
    let result = [...oldData];
    result.push(e);
    setOldData(result);
    setResetData([])
  } 
  useEffect(() => {
    const jobExists = dataCDD?.flows?.map(e=>e.job_id); 
    setOldData(jobExists)
  } 
  ,[dataCDD])
  useEffect(() => {
    if(value){
      setData(dataJobPickAdvance) 
    }else{
      setData(dataJobPick)
    }
  },[dataJobPick,dataJobPickAdvance,value]) 
 
  if(dataCDD)return (
    <Modal 
    visible={visible}
    title={<strong>Pick Job</strong>}
    // onOk={handleOk}
    onCancel={handleCancelModal}
    width={700}
    footer={
      <>
        <Button onClick={()=>handleCancelModal()}>Cancel</Button>
        <Button type="primary" disabled={true}>Pick</Button>
      </>
    }
  >
    <Row>
      <Col span={8}><p><strong style={{opacity: 0.85}}>Full name</strong></p></Col>
      <Col span={16}><p><strong style={{opacity: 0.65}}>{dataCDD?.full_name}</strong></p></Col>

      <Col span={8}><p><strong style={{opacity: 0.85}}>Position Applied</strong></p></Col>
      <Col span={16}><p><strong style={{opacity: 0.65}}>
      {dataCDD?.prefer_position?.positions?.map(e=>{
        return e.label
      }).toString()} 
        </strong></p></Col>

      <Col span={8}><p><strong style={{opacity: 0.85}}>Industry</strong></p></Col>
      <Col span={16}><p><strong style={{opacity: 0.65}}> 
        {dataCDD?.business_line?.map(e => {
          let sector = e?.sector? " / "+ e?.sector?.label: "";
          let category = e?.category? " / "+ e?.category?.label: "";
          return e?.industry?.label + sector + category
        })}
        </strong></p></Col>
      <Col span={24}>
        <div>
            <Select
              mode="multiple"
              style={{ width: '70%' }}
              placeholder="Please select job"
              value={resetData}
              // onChange={handleChange}
              autoClearSearchValue={false}
              onSelect={handleSelectJob}
              onSearch={(e)=> setValue(e)}
              filterOption={false}
              optionLabelProp="label"
            >
              {data?.data?.map(e=>{
                const disable = oldData?.filter(value => value === e?.id).length;
                return (<Select.Option disabled={disable} key={e?.id} value={e?.id} >
                  <div>
                  <p><strong>{`${e?.job_id} - ${e?.title?.label} - ${e?.end_date}`}</strong></p>
                  <p><strong>{`Client name:`}</strong> {e?.client?.name}</p>
                  <strong>INDUSTRY:</strong>
                  <p>
                  {e?.business_line?.map(e => {
                    let sector = e?.sector? " / "+ e?.sector?.label: "";
                    let category = e?.category? " / "+ e?.category?.label: "";
                    return e?.industry?.label + sector + category
                  })}
                  </p>
                  </div>
              </Select.Option>)
              })}
            </Select>
        </div>
      </Col>
      <Col span={24}>

      </Col>
    </Row>

  </Modal>
  )
}

  function AttachmentComponent(props){
    const params = props.params; 
    const dispatch = useDispatch();
    const { user: auth } = useAuth();
    const token = auth?.token;   
    const DOMAIN = 'https://lubrytics.com:8443';
    const [fileList, setFileList] = useState([]);

 
    const formatImage = (arr)=>{ 
          return arr?.map(e=>{ 
            return {
                uid: e.id,
                name: e.name, 
                url: `${DOMAIN}/nadh-mediafile/file/${e.id}`,
            }
        })  

    }

    const { data: infoCandidate } = useQuery(
      ["infoCandidateAt", params?.id,token],
      async () => await getCandidate(params?.id,token)
  );  
    const { data: listPicture,refetch } = useQuery(["listImage",token], async() => await getImage(infoCandidate.id,'candidates',token),{enabled: Boolean(infoCandidate)});    
    useEffect(() => {
      if(listPicture){
        let arr = formatImage(listPicture?.data);
        setFileList(arr)
      }
    },[listPicture])
  

    const updateData = async (idImg) => {
        let prevData = infoCandidate?.mediafiles?.files|| []; 
        let newData = {mediafiles:{
            files: [
              idImg,...prevData
            ]
        }}

        const key = 'updatable';
        await dispatch(fetchUpdateCandidate({id:infoCandidate.id, data:newData, token}))
        .then(unwrapResult)
        .then((e) => {   
            if(e === 403){
                message.error('This consultant does not have permission to change client');
            }else if(e === 400){
                message.error('Something wrong !'); 
            }
            else {
                message.loading({ content: 'Loading...', key });
                refetch()
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
        fmData.append("obj_table", 'candidates'); 
        fmData.append("obj_uid", infoCandidate?.id);  
        try {
          const res = await axios.post(
            "https://lubrytics.com:8443/nadh-mediafile/file",
            fmData,
            config
          ); 
          onSuccess("Ok"); 
          updateData(res?.data?.id);

          // console.log("server res: ", res);
        } catch (err) {
          console.log("Error: ", err);
          // const error = new Error("Some error");
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
        setFileList(file.fileList);  
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
        // const image = new Image();

        let modal = document.getElementById("myModal");  
        let modalImg = document.getElementById("img");
        let captionText = document.getElementById("caption");

        modal.style.display = "block";
        modalImg.src = src; 
        captionText.innerHTML =` Name: ${file.name}`;

        // image.src = src;
        // const imgWindow = window.open(src);
        // imgWindow?.document.write(image.outerHTML);
 
        var span = document.getElementsByClassName("close")[0];
 
        span.onclick = function() { 
        modal.style.display = "none";
        }
    };
    const onRemove = async(file) => {
        const key = 'updatable';
        // let data = infoCandidate?.mediafiles?.files || [];
        let result = fileList.filter(e => e === file.uid);  
        await deteteImage(file.uid, token).then(res => 
        {
            if(res.status === 202){  
                // updateCandidate(infoCandidate.id,{mediafiles:{files: result}},token)
                refetch()
                message.success({ content: 'Updated success !', key, duration: 2 }); 
            }
        }) 
    }
    const onDownload = async(file) => {
      console.log(file);
      // let a = document.createElement('a');
      // a.href = "img.png";
      // a.download = "output.png";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    }
    const propsUpload = { 
        listType:"picture-card",
        customRequest:uploadImage, 
        onDownload:onDownload,
        onRemove: onRemove, 
        onPreview:onPreview,
        beforeUpload: beforeUpload, 
        onChange:onChange,  
        fileList,
      };
     
      if(listPicture)
    return (
        <div  style={{marginInline: '24px', paddingBottom: '20px'}}>
         <Upload    
            {...propsUpload}
        > 
             <div>
                <p>{`+`}</p>
                <p>{`Upload`}</p>
                
                </div>
        </Upload>   
        </div>
    )
}