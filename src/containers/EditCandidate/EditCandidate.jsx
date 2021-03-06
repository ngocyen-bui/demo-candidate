import {
    Breadcrumb, Spin, 
  } from "antd";
  import Layout from "antd/lib/layout/layout";
  import { useEffect, useState } from "react"; 
  import { Link, useParams } from "react-router-dom"; 
  import {
    getCandidate, 
  } from "../../features/candidate"; 
  import TextArea from "antd/lib/input/TextArea";
  import { DetailCandidate } from "../../components/Candidate";
import { LoadingOutlined } from "@ant-design/icons";
  
  
  export default function AddCandidate(props) { 
  
    const params = useParams();
    // const [current, setCurrent] = useState(0);
    const [checkInfo, setCheckInfo]= useState(); 
    const [disabled, setDisabled] = useState(() => {
      return (Boolean(localStorage.getItem('personal-infomation')))  
    }); 
    const [prevData, setPrevData] = useState()  
   
  useEffect(()=>{
    if(params.id){ 
       getCandidate(params.id).then(dataCandidate =>{  
        const dob = dataCandidate?.dob?.split("-") || []; 
        const x =({
          id: dataCandidate?.id,
          addresses:  dataCandidate?.addresses|| [""],
          date: dob[2], 
          emails: dataCandidate?.emails?.map((e,i) =>({key: i,email: e})) || [""],
          firstName: dataCandidate?.first_name|| null,
          gender: dataCandidate?.gender,
          lastName: dataCandidate?.last_name|| null,
          maritalStatus: dataCandidate?.extra?.martial_status,
          middleName: dataCandidate?.middle_name || null,
          month: dob[1],
          highest_education: dataCandidate?.highest_education,
          readyToMove: dataCandidate?.readyToMove || 1,
          nationality: dataCandidate?.nationality,
          phones: dataCandidate?.phones?.map((e) =>({ countryCode: "+"+e.phone_code.key, phone: e.number}))|| [""],
          positionApplied: dataCandidate?.prefer_position?.positions,
          primaryStatus: dataCandidate?.priority_status,
          source: dataCandidate?.source,
          year: dob[0],
          yearOfManagement: dataCandidate?.management_years,
          yearOfServices: dataCandidate?.industry_years,
          directReports: dataCandidate?.direct_reports
        }); 
        setPrevData(x)
      });
    }else{
      setPrevData(JSON.parse(localStorage.getItem('personal-infomation')))
    }
  },[params.id]) 
  
  useEffect(()=>{
    if(params.id)setDisabled(false);
  },[params.id])
  useEffect(()=>{
    if(prevData || !params.id) setCheckInfo(true) 
  },[prevData,params.id])
  if(checkInfo) {
    return (
      <Layout>
        <Layout
          style={{ padding: "12px 24px 100px 24px ", minHeight: "1000px" }}
        >
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/candidates">Candidates List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">Detail Candidate</Breadcrumb.Item>
          </Breadcrumb>
    
          {params?.id?  <Layout style={{padding: '10px 20px', background: '#fff', marginTop: 20, }}>
            <h4 style={{ fontSize: 16, color: '#465f7b', fontWeight: 600}}> Overview</h4>
            <TextArea placeholder="Overview" rows={4} />
          </Layout>:
          <></>}
          <DetailCandidate disabled={disabled} prevData={prevData} params={params} edit={true} />
        </Layout>
      </Layout>
    ); 
  }else{
    return <Spin style={{marginBlock: 200}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }
  }
  