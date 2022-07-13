import {
    Breadcrumb, Button, Col, Collapse, message, Row, Spin, Upload, Steps,Timeline
  } from "antd";
  import Layout from "antd/lib/layout/layout";
  import { useEffect, useState } from "react"; 
  import { Link, useParams } from "react-router-dom"; 
  import {
    getCandidate 
  } from "../../features/candidate"; 
  import TextArea from "antd/lib/input/TextArea";
  import { DetailCandidate } from "../../components/Candidate";
import { LoadingOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons"; 
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { fetchUpdateCandidate } from "../../redux/reducer";
import { unwrapResult } from "@reduxjs/toolkit";
import { useQuery } from "react-query";
import { deteteImage, getImage } from "../../features/job";
  
  
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
          style={{ padding: "0 24px 100px 24px ", minHeight: "800px" }}
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

  //https://ant.design/components/steps/
  function InterviewLoop(props){
    const id = props.id;
    const { Panel } = Collapse; 

    const { user: auth } = useAuth(); 
    const token = auth?.token; 

    const { data: totalDataJobs } = useQuery(
      ["infoInterviewsJobs" , id, token],
      async () => await getCandidate(  id, token), 
    ); 
    const text = `
      A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.
    `;
    const genExtra = () => (
      <MoreOutlined 
        onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          console.log(event);
          event.stopPropagation();
        }}
      />
    );
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
          <Button style={{ color: '#1890ff', borderColor: '#1890ff'}}><PlusOutlined/>Pick Job</Button>
        </div>
        <Collapse accordion>
          {totalDataJobs?.flows?.map((e,i)=>{
            let primaryTitle = e?.job;
           return <Panel header={header(primaryTitle)} key={i+1} extra={genExtra()}>
                  <Timeline>
                      <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                      <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                  </Timeline> 
            </Panel> 
          })} 
        </Collapse>
      </div>
    );
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