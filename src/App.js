import { 
  ScheduleOutlined,
  SolutionOutlined, 
} from "@ant-design/icons";
import { Avatar, BackTop, Dropdown, Image, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import Candidate from "./containers/Candidate/Candidate"; 
import {  Link, Route, Routes, Navigate } from "react-router-dom";
import Login from "./containers/Login/Login";
import AddCandidate from "./containers/AddCandidate/AddCandidate";
import EditCandidate from "./containers/EditCandidate/EditCandidate";  
import { useAuth } from "./hooks/useAuth"; 
import Jobs from "./containers/Jobs/Jobs";
const { Header } = Layout;
// Create a client

const listTitleNavBar = [
  // {
  //   icon: <HomeOutlined />,
  //   title: "Dashboard",
  //   key: '1',
  // },
  {
    
    icon: <SolutionOutlined />,
    title: <Link to="/candidates">Candidates</Link>,
    key: "2", 
  },
  {
    icon: <ScheduleOutlined />,
    title:<Link to="/jobs"> Jobs</Link>,
    key: '3'
  },
  // {
  //   icon: <UserOutlined />,
  //   title: "Systems Users",
  //   key: '4'
  // },
  // {
  //   icon: <UserOutlined />,
  //   title: "Group User",
  //   key: '5'
  // },
  // {
  //   icon: <SearchOutlined />,
  //   title: "Mega Search",
  //   key: '6'
  // },
];
const formatList = listTitleNavBar.map((e, index) => ({
  key: e.key,
  icon: e.icon,
  label: e.title,
}));

const App = () => {   
  const { user: auth,logout } = useAuth();  
  
  const [current, setCurrent] = useState(()=>{
    if(window.location.pathname === '/jobs'){
      return '3'
    }
    return '2'
  });

  const menu = (
    <Menu
      items={[ 
        {
          label: (
            <div  
              onClick={logout} >
                Logout
            </div>
          ), 
        }, 
      ]}
    />
  );
     
  const onClick = (e) => {
    // console.log('click ', e);
    setCurrent(e.key);

  };
  return (
       <>
       <Layout>
          {!!auth ? (
            <>
              <Header className="header app-header">
                <Link to="/">
                  <Image
                    preview={false}
                    width={90}
                    src="https://nadh.lubrytics.com/static/media/logo_white.0fe5940b.png"
                  />
                </Link> 
                  <Dropdown overlay={menu}>
                    <div onClick={e => e.preventDefault()} style={{ float: "right", cursor: 'pointer' }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{marginRight: '10px', color: 'white', textTransform: 'uppercase', fontWeight: 'bold'}}>{auth?.user_sent?.full_name}</div>
                            <Avatar
                            src={
                              "https://lubrytics.com:8443/nadh-mediafile/file/f4882323-30e2-4b48-b093-84e543a5f5f9"
                            }
                          />
                        </div>
                    </div>
                </Dropdown> 
              </Header>
              <Menu
                onClick={onClick}
                theme="light"
                mode="horizontal"
                style={{ paddingLeft: 10 }}
                defaultSelectedKeys={current}
                items={formatList}
              ></Menu>
            </>
          ) : (
            <></>
          )}

          <Routes>
            <Route
              exact
              path="/"
              element={
                <Navigate to="/login" />
              }
            />
            <Route
              exact
              path="/login"
              element={
                !!auth ? <Navigate to="/candidates" /> : <Login />
              }
            />
            <Route exact path="/candidates" element={<Candidate />} />
            <Route exact path="/jobs" element={<Jobs />} />
            <Route 
              path="/candidate-detail/:id"
              element={<EditCandidate />}
            />
            <Route exact path="/add-candidate" element={<AddCandidate />} />
            <Route path="*" element={auth ? <div> Not found: 404</div> :  <Navigate to="/login" /> }/>
          </Routes>
        </Layout>
        <>
          <BackTop />
        </> 
       </> 
  );
};

export default App;
