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

  const [current, setCurrent] = useState(0);
  // const [checkInfo, setCheckInfo]= useState(); 
  const [disabled, setDisabled] = useState(() => {
   return (Boolean(localStorage.getItem('personal-infomation')))  
  }); 
  const [prevData, setPrevData] = useState([]) 

 
useEffect(()=>{ 
    setPrevData(JSON.parse(localStorage.getItem('personal-infomation'))) 
},[]) 
 

// useEffect(()=>{
//   if(prevData) setCheckInfo(true) 
// },[prevData])

return (
  <Layout>
    <Layout
      style={{ padding: "12px 24px 100px 24px ", minHeight: "1000px" }}
    > 
      <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/candidates">Candidates List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">Create Candidate</Breadcrumb.Item>
        </Breadcrumb>
        <strong style={{ fontWeight: 600, fontSize: 24, paddingBlock: 10 }}>
          Create Candidate
        </strong>
        <Steps current={current} >
          <Step title="Personal Information" /> 
        </Steps> 
      <DetailCandidate disabled={disabled} prevData={prevData}/>
    </Layout>
  </Layout>
); 
}
