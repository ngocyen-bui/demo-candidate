import {
    Breadcrumb,
    Steps,
  } from "antd";
  import Layout from "antd/lib/layout/layout";
  import { useEffect, useState } from "react"; 
  import { Link, useParams } from "react-router-dom"; 
  import {
    getCandidate, 
  } from "../../features/candidate"; 
  import TextArea from "antd/lib/input/TextArea";
  import { DetailCandidate } from "../../components/Candidate";
  const { Step } = Steps;
  
  
  export default function AddCandidate(props) { 
  
    const params = useParams();
    const [current, setCurrent] = useState(0);
    const [checkInfo, setCheckInfo]= useState(); 
    const [disabled, setDisabled] = useState(() => {
      if (Boolean(localStorage.getItem('personal-infomation'))) return true;
      return false;
    }); 
    const [prevData, setPrevData] = useState() 
  
   
  useEffect(()=>{
    if(params.id){
       getCandidate(params.id).then(dataCandidate =>{
        const x =({
          id: dataCandidate?.id,
          address:  dataCandidate?.addresses,
          date: null,
          directReports: 2,
          emails: dataCandidate?.emails?.map((e,i) =>({key: i,email: e})) || [],
          firstName: dataCandidate?.first_name,
          gender: dataCandidate?.gender,
          lastName: dataCandidate?.last_name,
          maritalStatus: null,
          middleName: dataCandidate?.middle_name,
          month: null,
          nationality: dataCandidate?.nationality,
          phones: dataCandidate?.phones?.map((e,i) =>({key: i, phone: e.number}))|| [],
          positionApplied: 544,
          primaryStatus: null,
          source: null,
          year: null,
          yearOfManagement: dataCandidate?.management_years,
          yearOfServices: 1, 
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
  
  const onChange = (value) => {
    setCurrent(value);
  };
  
  useEffect(()=>{
    if(prevData || !params.id) setCheckInfo(true) 
  },[prevData,params.id])
  if(checkInfo) return (
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
        <DetailCandidate disabled={disabled} prevData={prevData} params={params} edit={true} onChange={onChange}/>
      </Layout>
    </Layout>
  ); 
  }
  