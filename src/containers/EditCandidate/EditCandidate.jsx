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
import { useSelector } from "react-redux";
  
  
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
          <DetailCandidate disabled={false} params={params} edit={true}/>
        </Layout>
      </Layout>
    ); 
  } 
  }
  