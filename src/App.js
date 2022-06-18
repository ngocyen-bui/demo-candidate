import {
  HomeOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, BackTop, Image, Layout, Menu } from "antd";
import React, { useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import Candidate from "./components/Candidate/Candidate";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AddCandidate from "./components/AddCandidate/AddCandidate"; 
import Login from "./components/Login/Login";
const { Header } = Layout;
// Create a client
const queryClient = new QueryClient();

const listTitleNavBar = [
  {
    icon: <HomeOutlined />,
    title: "Dashboard", 
    key: '1', 
  },
  {
    icon: <SolutionOutlined />,
    title: <Link to='candidates'>Candidates</Link>, 
    key: '2'
  },
  {
    icon: <ScheduleOutlined />,
    title: "Jobs",
    key: '3'
  },
  {
    icon: <UserOutlined />,
    title: "Systems Users", 
    key: '4'
  },
  {
    icon: <UserOutlined />,
    title: "Group User",
    key: '5'
  },
  {
    icon: <SearchOutlined />,
    title: "Mega Search",
    key: '6'
  },
];
const formatList = listTitleNavBar.map((e, index) => ({
  index,
  icon: e.icon,
  label: e.title,
}));
const App = () =>{ 
  
  const [token] = useState(localStorage.getItem('auth'));
  
  return ( 
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Header className="header app-header">
          <Link to="/">
          <Image
          preview={false}
            width={90}
            src="https://nadh.lubrytics.com/static/media/logo_white.0fe5940b.png"
          />
          </Link> 
          <Link to='/' onClick={()=> localStorage.removeItem('auth')} style={{ float: "right" }} >
            <Avatar
              
              src={
                "https://lubrytics.com:8443/nadh-mediafile/file/f4882323-30e2-4b48-b093-84e543a5f5f9"
              }
            />
          </Link>
        </Header> 
        <Menu
          theme="light"
          mode="horizontal"
          style={{ paddingLeft: 10 }}
          defaultSelectedKeys={[1]}
          items={formatList}
        >  
        </Menu>
         <Routes>
          <Route path="/" element={!  Boolean(token)?<Login/>:<></>} />
          <Route path="candidates" element={<Candidate/>} />
          <Route path="candidate-detail/:id" element={<AddCandidate />} />
          <Route path="add-candidate" element={<AddCandidate />} />
        </Routes>
      </Layout>
      <>
    <BackTop /> 
  </>
    </QueryClientProvider>
  </BrowserRouter>
  
)}

export default App;
