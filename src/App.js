import {
  HomeOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Image, Layout, Menu } from "antd";
import React from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import Candidate from "./components/Candidate/Candidate";
import { QueryClient, QueryClientProvider } from "react-query";
const { Header } = Layout;
// Create a client
const queryClient = new QueryClient();

const listTitleNavBar = [
  {
    icon: <HomeOutlined />,
    title: "Dashboard",
  },
  {
    icon: <SolutionOutlined />,
    title: "Candicates",
  },
  {
    icon: <ScheduleOutlined />,
    title: "Jobs",
  },
  {
    icon: <UserOutlined />,
    title: "Systems Users",
  },
  {
    icon: <UserOutlined />,
    title: "Group User",
  },
  {
    icon: <SearchOutlined />,
    title: "Mega Search",
  },
];

const formatList = listTitleNavBar.map((e, index) => ({
  index,
  icon: e.icon,
  label: e.title,
}));
const App = () => (
  // Provide the client to your App
  <QueryClientProvider client={queryClient}>
    <Layout>
      <Header className="header app-header">
        <Image
          width={90}
          src="https://nadh.lubrytics.com/static/media/logo_white.0fe5940b.png"
        />

        <Avatar
          style={{ float: "right", transform: "translateY(50%)" }}
          src={
            "https://lubrytics.com:8443/nadh-mediafile/file/f4882323-30e2-4b48-b093-84e543a5f5f9"
          }
        />
      </Header>
      <Menu
        theme="light"
        mode="horizontal"
        style={{ paddingLeft: 10 }}
        defaultSelectedKeys={[1]}
        items={formatList}
      />
      <Candidate></Candidate>
    </Layout>
  </QueryClientProvider>
);

export default App;
