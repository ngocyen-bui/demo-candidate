import { Breadcrumb } from "antd";
import Layout from "antd/lib/layout/layout";
import { Link, useParams } from "react-router-dom";
// import { LoadingOutlined } from "@ant-design/icons";
// import { useSelector } from "react-redux";  
import DetailJob from "../../components/Job";

export default function EditJob(props) {
  const params = useParams(); 

  // const { loading } = useSelector((state) => state.job);

  
  return (
    <Layout>
      <Layout
        style={{marginTop: '100px', padding: "12px 24px 100px 24px ", minHeight: "1000px" }}
      >
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/jobs">Jobs List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">Detail Job</Breadcrumb.Item>
        </Breadcrumb>
        <DetailJob params={params}></DetailJob>
      </Layout>
    </Layout>
  );
} 

// media, search api 
// login err trong detail 