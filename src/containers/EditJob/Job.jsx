import { Breadcrumb, Spin } from "antd";
import Layout from "antd/lib/layout/layout";
import { Link, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getJobById } from "../../features/job";
import { useAuth } from "../../hooks/useAuth";
import DetailJob from "../../components/Job";

export default function EditJob(props) {
  const params = useParams();
  const { user: auth } = useAuth();
  const token = auth?.token;

  const { loading } = useSelector((state) => state.candidate);
  const { data: listCountries } = useQuery(
    ["jobdetail", params?.id, token],
    () => getJobById(params?.id, token)
  );
  if (loading === "PENDING") {
    return (
      <Spin
        style={{ marginTop: "200px", minHeight: "1000px" }}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    );
  } else {
    return (
      <Layout>
        <Layout
          style={{ padding: "12px 24px 100px 24px ", minHeight: "1000px" }}
        >
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/jobs">Jobs List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">Detail Job</Breadcrumb.Item>
          </Breadcrumb>
          <DetailJob></DetailJob>
        </Layout>
      </Layout>
    );
  }
}
