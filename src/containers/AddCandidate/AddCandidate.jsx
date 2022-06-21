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
    setPrevData(JSON.parse(localStorage.getItem('personal-infomation'))) 
},[]) 
 

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
 
        <strong style={{ fontWeight: 600, fontSize: 24, paddingBlock: 10 }}>
          Create Candidate
        </strong>
        <Steps current={current} onChange={onChange}>
          <Step title="Personal Information" />
          <Step title="Skills and Industry" />
          <Step title="Education and Certificate" />
          <Step title="Working History" />
          <Step title="Remunertion and Rewards" />
          <Step title="Finish" />
        </Steps> 
      <DetailCandidate disabled={disabled} prevData={prevData} params={params} onChange={onChange}/>
    </Layout>
  </Layout>
); 
}
