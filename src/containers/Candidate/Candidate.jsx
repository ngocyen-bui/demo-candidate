import {  
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button, 
  Input,
  Layout, 
  Select,
  Space,
  Spin,
  Tag,
} from "antd";
import Table from "antd/lib/table";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { 
  getDefaultProp,
  getKeyPageCDD,
  getListCandidate,
} from "../../features/candidate";
import { 
  findFlowStatus,
  findPriorityStatus,
  getlistStatus,
} from "../../utils/interface";
import { Link, useLocation, useNavigate } from "react-router-dom";  
import { useDispatch, useSelector } from "react-redux";
import { addListCandidate, listCandidateSlice } from "../../redux/reducer"; 
import { getList } from "../../redux/selector";
import { candidateApi } from "../../redux-api/store";

const formatColumn = (funcSearch, key, listProps) => {
  let language;
  let degree;
  if (listProps) {
    let a = Object.values(listProps).find((obj) => {
      return obj.name === "language";
    });
    let b = Object.values(listProps).find((obj) => {
      return obj.name === "degree";
    });
   language = a?.values;
   degree = b?.values
  }  
  if (key)
    return [
      {
        title: "ID",
        dataIndex: key[0],
        key: key[0],
        render: (name) => (
          <p
            style={{
              color: "rgb(24, 144, 255)",
              fontWeight: "bold",
              width: "90px",
            }}
          >
            {name}
          </p>
        ),
        ...funcSearch(key[0], "input"),
      },
      {
        title: "Name",
        dataIndex: key[1],
        key: key[1],
        render: (name) => (
          <span
            style={{
              color: "rgb(24, 144, 255)",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {name}
          </span>
        ),
        ...funcSearch(key[1], "input"),
      },
      {
        title: "Primary Status",
        dataIndex: key[2],
        key: key[2],
        render: (text) => {
          let x = findPriorityStatus(text);
          return (
            <Tag
              style={{
                color: x?.color,
                borderColor: x?.color,
                background: "#f6ffed",
              }}
            >
              {x?.label}
            </Tag>
          );
        },
        ...funcSearch(key[2], "select", getlistStatus),
      },
      {
        title: "Languages",
        dataIndex: key[3] + "s",
        key: key[3] + "s",
        render: (text) => text?.map((e, i) => <p key={i}>- {e?.label}</p>),
        ...funcSearch(key[3],'multiselect',  language),
      },
      {
        title: "Highest degree",
        dataIndex: key[4],
        key: key[4],
        render: (text) => <p>{text.label}</p>,
        ...funcSearch(key[4],"select", degree),
      },
      {
        title: "City",
        dataIndex: "addresses",
        key: "addresses",
        render: (text) => {
          return text?.map((e, i) => (
            <div key={i}> 
              {e?.city?.label} {e?.country?.label} {e?.district?.label}
            </div>
          ));
        },
        ...funcSearch("addresses"),
      },
      {
        title: "Industry",
        dataIndex: "business_line",
        key: "business_line", 
        render: (text) =>
          text?.map((e, i) => (
            <p key={i}>* {e?.sector?.label || e?.industry?.label}</p>
          )),
        ...funcSearch("business_line"),
      },
      {
        title: "YOB",
        dataIndex: "dob",
        key: "dob",
        render: (text) => {
          return <p>{text?.slice(0, 4)}</p>;
        },
        ...funcSearch("dob"),
      },
      {
        title: "Activity",
        dataIndex: key[8],
        key: key[8],
        render: (text) => <p>{findFlowStatus(text)?.label}</p>,
        ...funcSearch(key[8]),
      },
      {
        title: "Recent companies",
        dataIndex: "current_employments",
        key: "current_employments",
        render: (text) =>
          text?.map((e, i) => <p key={i}>- {e?.organization?.label}</p>),
        ...funcSearch("current_company_text","input"),
      },
      {
        title: "Recent positions",
        dataIndex: "current_employments",
        key: "current_employments",
        render: (text) =>
          text?.map((e, i) => <p key={i}>- {e?.title?.label}</p>),
        ...funcSearch("current_position_text","input"),
      },
      {
        title: "Year of services",
        dataIndex: key[11],
        key: key[11],
        ...funcSearch(key[11]),
      },
      {
        title: "Year of management",
        dataIndex: key[12],
        key: key[12],
        ...funcSearch(key[12]),
      },
      {
        title: "Action",
        dataIndex: key[13],
        key: key[13],
        render: () => <EyeOutlined style={{ cursor: "pointer" }} />,
      },
    ];
};

export default function Candidate() { 

  const { data: todos } = candidateApi.useGetAllQuery(); 
  dispatch(addListCandidate(todos));
 
  const navigate = useNavigate();
  const search = useLocation().search;
  const pageUrl = new URLSearchParams(search).get("page");
 
  const dispatch = useDispatch();

  const [auth] = useState(localStorage.getItem("auth")); 
  const [page, setPage] = useState(JSON.parse(pageUrl||localStorage.getItem("pagination")||1));
  const [count, setCount] = useState(0);
  const [listData, setListData] = useState(); 
  const [filters, setFilters] = useState(() => {
    return (JSON.parse(localStorage.getItem("filtersCDD")) || {});
  }); 
  //search 
  const listCandidate = useSelector(getList);   

  const { data: totalData, isFetching } = useQuery(
    ["listCandidate", page, filters],
     async () => await getListCandidate(page, filters),
    { keepPreviousData: true, staleTime: 5000 }
  );
 
  useEffect(()=>{ 
    if(totalData) dispatch(listCandidateSlice.actions.addListCandidate(totalData));
  },[totalData,dispatch])  

  //Get data default key page
  const { data: listDefaultKeyPage } = useQuery("keyPage", () =>
    getKeyPageCDD()
  );

  const { data: listDefaultProp } = useQuery("defaultProps", () =>
    getDefaultProp()
  );

  useEffect(() => {  
    if (!isFetching && totalData) {
      setListData(totalData.data);
      setCount(totalData.count);
    } 
  }, [totalData,isFetching]);


  const clearAllFilter = () => {
    setFilters({});  
  };
  const handlerClickRow = (data) => {
    navigate("/candidate-detail/" + data.candidate_id);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => { 
    if (selectedKeys === []) {
      const temp = filters;
      delete temp[dataIndex];    
      setFilters(temp);
    }else{
      setFilters((data) => ({
        ...data,
        [dataIndex]: selectedKeys[0],
      })); 
    } 
   
    setPage(1)
    navigate("?page="+1);
    localStorage.setItem('pagination',1)
  };   
  useEffect(() => {
    localStorage.removeItem("filtersCDD");
    localStorage.setItem("filtersCDD", JSON.stringify(filters));
  }, [filters]);

  const handleReset = (clearFilters, confirm, dataIndex) => {  
    const temp = filters;
    delete temp[dataIndex];    
    setFilters(temp);
  };
  const getColumnSearchProps = (dataIndex,type, listData) => ({ 
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Space>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{
              background: "white",
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
        </Space>
        {type === "input" ? (
          <Input 
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              borderWidth: 1,
              marginTop: 8,
              marginBottom: 8,
              display: "block",
              outline: "none",
              paddingLeft: 8,
            }}
          />
        ) : (
          ""
        )}
        {type === "select" ? (
          <Select
            showSearch
            style={{
              width: 200,
              display: "block",
              marginTop: 10,
            }} 

            onSelect={(e) => setSelectedKeys(e ? [e] : [])}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {listData?.map((e, i) => {
              return (
                <Select.Option key={i}  value={e.key}>
                  {e.label}
                </Select.Option>
              );
            })}
          </Select>
        ) : (
          ""
        )}
        {type === 'multiselect'?
          <>
            <Select
              style={{
                width: '100%',
                display: "block",
                marginTop: 10,
              }} 
              mode="multiple"
              onSelect={(e) => setSelectedKeys(e ? [e] : [])}
              allowClear 
              placeholder="Please select" 
            >
               {listData?.map((e,i)=>{
                 return <Select.Option key={i} value={e.key}>{e.label}</Select.Option>
               })}
            </Select> 
          </>
       :('')}
       {type === "range"}
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });
  const handleTag = (key)=>{  
    // setFilters((filters) => {
    //   return  delete filters[key] || {}; 
    // }); 
    const temp = filters;
    delete temp[key];    
    setFilters(temp);

    localStorage.removeItem("filtersCDD");
    localStorage.setItem("filtersCDD", JSON.stringify(temp));
  }
  const columns = formatColumn(
    getColumnSearchProps,
    listDefaultKeyPage?.data,
    listDefaultProp
  );
  const handlerClickPagination = (e)=>{ 
    localStorage.setItem('pagination',e)
    navigate("?page="+e);
    setPage(e);
  }
  if (!auth) {
    window.location.pathname = "/";
  } 
  if (isFetching){
    return <Spin style={{marginBlock: 200}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }
    return (
      <Layout>
        <Layout style={{ padding: "24px 24px 0 24px ", minHeight: "1000px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{ color: "#465f7b", fontWeight: 600, fontSize: "16px" }}
              >
                Candidates List ({count})
              </div>
              <div style={{ textAlign: "end" }}>
                <Button style={{ marginRight: 10 }} onClick={clearAllFilter}>
                  Clear all filters
                </Button>
                <Link to="/add-candidate">
                  <Button type="primary">
                    <PlusOutlined />
                    Create candidates
                  </Button>
                </Link>
              </div>
            </div>
            {/* <Space style={{ marginBlock: "10px 16px", float: "right" }}>
              <Dropdown overlay={menu} autoFocus onVisibleChange={false}>
                <Button style={{ width: 160 }}>
                  <Space>
                    Custom Columns
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Space> */}
            {filters? 
                Object.keys(filters)?.map(function(key) {
                  return <Tag closable id={key} key={key} onClose={()=> handleTag(key)}>
                  {key} = {filters[key]} 
                </Tag>
              })
            :<></>}
            <Table
              style={{marginTop: 20}}
              columns={columns}
              dataSource={listData}
              scroll={{ x: true }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    handlerClickRow(record);
                  }, // click row
                };
              }}
              pagination={{ 
                current: page,
                showSizeChanger: false,
                showQuickJumper: true,
                total: count,
                onChange: (e) => handlerClickPagination(e),
              }}
            />
          </Content>
        </Layout>
      </Layout>
    );
}
