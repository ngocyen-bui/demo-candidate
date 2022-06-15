import { Breadcrumb, Steps } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { Link } from "react-router-dom";
const { Step } = Steps;

export default function AddCandidate(props) {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    console.log("onChange:", current);
    setCurrent(value);
  };
  return (
    <Layout>
      <Layout style={{ padding: "24px 24px 0 24px ", minHeight: "1000px" }}>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/candidates">Candidates List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">Create Candidate</Breadcrumb.Item>
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
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            marginTop: 20,
            minHeight: 280,
            backgroundColor: "white",
          }}
        >
            <div>PERSONAL INFORMATION</div>


        </Content>
      </Layout>
    </Layout>
  );
}
