import { 
  SolutionOutlined, 
} from "@ant-design/icons";
import { Avatar, BackTop, Dropdown, Image, Layout, Menu } from "antd";
import React, { useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import Candidate from "./containers/Candidate/Candidate";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import Login from "./containers/Login/Login";
import AddCandidate from "./containers/AddCandidate/AddCandidate";
import EditCandidate from "./containers/EditCandidate/EditCandidate";
import { logout } from "./features/candidate";
const { Header } = Layout;
// Create a client
const queryClient = new QueryClient();

const listTitleNavBar = [
  // {
  //   icon: <HomeOutlined />,
  //   title: "Dashboard",
  //   key: '1',
  // },
  {
    icon: <SolutionOutlined />,
    title: <Link to="candidates">Candidates</Link>,
    key: "2",
  },
  // {
  //   icon: <ScheduleOutlined />,
  //   title: "Jobs",
  //   key: '3'
  // },
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
  index,
  icon: e.icon,
  label: e.title,
}));

const App = () => { 
  const authSettings = (localStorage.getItem("auth") && localStorage.getItem("auth").length > 0);
  const [auth] = useState(authSettings);
  const menu = (
    <Menu
      items={[ 
        {
          label: (
            <a 
              href="/"
              onClick={() => {logout();localStorage.removeItem("auth")}} >
                Logout
            </a>
          ), 
        }, 
      ]}
    />
  );
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Layout>
          {auth ? (
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
                        <Avatar
                        src={
                          "https://lubrytics.com:8443/nadh-mediafile/file/f4882323-30e2-4b48-b093-84e543a5f5f9"
                        }
                      />
                    </div>
                </Dropdown> 
              </Header>
              <Menu
                theme="light"
                mode="horizontal"
                style={{ paddingLeft: 10 }}
                defaultSelectedKeys={[1]}
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
                Boolean(auth) ? <Navigate to="/candidates" /> : <Login />
              }
            />
            <Route exact path="/candidates" element={<Candidate />} />
            <Route 
              path="/candidate-detail/:id"
              element={<EditCandidate />}
            />
            <Route exact path="/add-candidate" element={<AddCandidate />} />
            <Route path="*" element={<Navigate to="/login" />}/>
          </Routes>
        </Layout>
        <>
          <BackTop />
        </>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
