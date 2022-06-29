import {
  EyeOutlined, 
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button, 
  Input,
  InputNumber,
  Layout,
  Select,
  Space, 
  Tag,
} from "antd";
import Table from "antd/lib/table";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  getDefaultProp,
  getKeyPageCDD,
  getLanguage,
  getListCandidate,
} from "../../features/candidate";
import {
  candidate_flow_status,
  findFlowStatus,
  findPriorityStatus,
  getlistStatus,
} from "../../utils/interface";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const formatColumn = (funcSearch, key, listProps, navigate) => { 
  let language ;  
  let degree;
  if (listProps) { 
    let a = Object.values(listProps).find((obj) => {
      return obj.name === "language";
    });
    let b = Object.values(listProps).find((obj) => {
      return obj.name === "degree";
    }); 

   language = a?.values;
    degree = b?.values;
  }
  const handlerClickRow = (data) => {
    navigate("/candidate-detail/" + data);
  };
  if (key)
    return [
      {
        title: "ID",
        dataIndex: key[0],
        key: key[0],
        width: '150px',
        fixed: 'left',
        render: (name, record) => (
          <p
            onClick={() => handlerClickRow(record.candidate_id)}
            style={{
              cursor: "pointer",
              color: "rgb(24, 144, 255)",
              fontWeight: "bold", 
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
        width: '150px',
        render: (name, record) => (
          <span
            onClick={() => handlerClickRow(record.candidate_id)}
            style={{
              cursor: "pointer",
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
        width: '150px',
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
        width: '150px',
        key: key[3] + "s",
        render: (text) => text?.map((e, i) => <p key={i}>- {e?.label}</p>),
        ...funcSearch(key[3], "multiselect", language),
      },
      {
        title: "Highest degree",
        dataIndex: key[4],
        key: key[4],
        width: '150px',
        render: (text) => <p>{text.label}</p>,
        ...funcSearch(key[4], "select", degree),
      },
      {
        title: "City",
        dataIndex: "addresses",
        width: '200px',
        key: "addresses",
        render: (text) => {
          return text?.map((e, i) => (
            <div key={i}>
              {e?.city?.label} {e?.country?.label} {e?.district?.label}
            </div>
          ));
        },
        ...funcSearch("addresses",'select',[]),
      },
      {
        title: "Industry",
        dataIndex: "business_line",
        width: '200px',
        key: "business_line",
        render: (text) =>
          text?.map((e, i) => (
            <p key={i}>* {e?.sector?.label || e?.industry?.label}</p>
          )),
        ...funcSearch("business_line",'select',[]),
      },
      {
        title: "YOB",
        dataIndex: "dob",
        width: '150px',
        key: "dob",
        render: (text) => {
          return <p>{text?.slice(0, 4)}</p>;
        },
        ...funcSearch("dob", "range"),
      },
      {
        title: "Activity",
        dataIndex: key[8],
        width: '150px',
        key: key[8],
        render: (text) => <p>{findFlowStatus(text)?.label}</p>,
        ...funcSearch(key[8],'select',candidate_flow_status),
      },
      {
        title: "Recent companies",
        dataIndex: "current_employments",
        key: "current_employments_companies",
        width: '150px',
        render: (text) =>
          text?.map((e, i) => <p key={i}>- {e?.organization?.label}</p>),
        ...funcSearch("current_company_text", "input"),
      },
      {
        title: "Recent positions",
        dataIndex: "current_employments",
        key: "current_employments_positions",
        width: '150px',
        render: (text) =>
          text?.map((e, i) => <p key={i}>- {e?.title?.label}</p>),
        ...funcSearch("current_position_text", "input"),
      },
      {
        title: "Year of services",
        dataIndex: key[11],
        key: key[11],
        width: '150px',
        ...funcSearch(key[11],'range'),
      },
      {
        title: "Year of management",
        dataIndex: key[12],
        key: key[12],
        width: '150px',
        ...funcSearch(key[12],'range'),
      },
      {
        title: "Action",
        dataIndex: "candidate_id",
        key: key[13],
        fixed: 'right', 
        width: '150px',
        render: (record) => {
          return (
            <EyeOutlined
              onClick={() => handlerClickRow(record)}
              style={{ cursor: "pointer" }}
            />
          );
        },
      },
    ];
};

export default function Candidate() {
  const navigate = useNavigate();
  const search = useLocation().search;
  const pageUrl = new URLSearchParams(search).get("page");
 
  const [page, setPage] = useState(
    JSON.parse(pageUrl || localStorage.getItem("pagination") || 1)
  );
  const [count, setCount] = useState(0);
  const [listData, setListData] = useState([]);
  const [valueLanguage, setValueLanguage] = useState(null);
  const [filters, setFilters] = useState(() => {
    return JSON.parse(localStorage.getItem("filtersCDD")) || {};
  }); 
  const { logout } = useAuth();

  //search results
  const [dob, setDob] = useState([]);
  const [dobto, setDobTo] = useState([]);
  const [checkChangeDob,setCheckChangeDob]= useState(false);
  const [convertFilter, setConvertFilter] = useState([]);  
  // console.log(convertFilter);
   useEffect(() => {
    let temp = Object.entries(filters);  
    console.log(temp);
    let arr = temp.map((e)=>{
      if(e[0] === 'full_name'){
        return {
          filter: 'full_name',
          name: 'Fullname',
          value: e[1],
          prevValue: e[1]
        }
      }
      if(e[0] === 'priority_status'){
        return {
          filter: 'priority_status',
          name: 'Primary Status',
          value: e[1]?.data?.label,
          prevValue: e[1]
        }
      }
      if(e[0] === 'candidate_id'){
        return {
          filter: 'candidate_id',
          name: 'Candidate ID',
          value: e[1],
          prevValue: e[1]
        }
      }
      if(e[0] === 'language'){
        let temp = ''
        if(e[1].length > 1){
         temp = e[1]?.map((e)=> e.children)?.reduce((previousValue, currentValue) =>  
          previousValue + ' ' + currentValue
        )
        }else{
          temp = e[1][0]?.data?.label;
        }
        return {
          filter: 'language',
          name: 'Languages',
          value: temp,
          prevValue: e[1]
        }
      }
      if(e[0] === 'highest_education'){
        return {
          filter: 'highest_education',
          name: 'Highest degree',
          value: e[1].children,
          prevValue: e[1]
        }
      }
      if(e[0] === 'flow_status'){
        return {
          filter: 'flow_status',
          name: 'Activity',
          value: e[1]?.data?.label,
          prevValue: e[1]
        }
      }
      if(e[0] === "yob"){
        return {
          filter: 'yob',
          name: "YOB",
          value: 'from '+ e[1].from+ ' to ' + e[1].to,
          prevValue: e[1]
        }
      }
      if(e[0] === "industry"){
        return {
          filter: 'industry',
          name: 'Industry',
          value: 'from '+ e[1].from+ ' to ' + e[1].to,
          prevValue: e[1]
        }
      }
      if(e[0] === "management"){
        return {
          filter: 'management',
          name: 'Management',
          value: 'from '+ e[1].from+ ' to ' + e[1].to,
          prevValue: e[1]
        }
      } 
      if(e[0] === "current_position_text"){
        return {
          filter: 'current_position_text',
          name: 'Recent positions',
          value: e[1],
          prevValue: e[1]
        }
      } 
      if(e[0] === "current_company_text"){
        return {
          filter: 'current_company_text',
          name: 'Recent companies',
          value: e[1],
          prevValue: e[1]
        }
      } 

      return {};
    }) 
    setConvertFilter(arr)
   },[filters]) 
  const { user: auth } = useAuth();
  const token = auth?.token;

  const { data: totalData, isFetching } = useQuery(
    ["listCandidate", page, filters, token],
    async () => await getListCandidate(page, filters, token),
    { keepPreviousData: true, staleTime: 5000 }
  );
  //Get data default key page
  const { data: listDefaultKeyPage } = useQuery(
    ["keyPage", token],
    async () => await getKeyPageCDD(token)
  );
  const { data: listLanguage } = useQuery(
    ["getLanguageByValue", valueLanguage,token],
    async() => await getLanguage(valueLanguage,token)
  );  
  // console.log(listLanguage);
  const { data: listDefaultProp } = useQuery(
    ["defaultProps", token],
    async () => await getDefaultProp(token)
  ); 
  useEffect(() => {
    if (totalData?.status === 401) {
      logout();
      localStorage.removeItem("auth");
    }

    if (!isFetching && totalData) {
      setListData(totalData.data);
      setCount(totalData.count);
    }
  }, [totalData, isFetching, logout]); 

  const clearAllFilter = () => {
    setFilters({});
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => { 
    let temp = { ...filters };  
    console.log(filters);
    confirm(); 
    setPage(1);
    navigate("?page=" + 1);
    localStorage.setItem("pagination", 1);
    
    if (selectedKeys.length === 2) {
      if(dataIndex === 'dob'){
        temp = {
          ...temp, 
          yob: {from: selectedKeys[0], to:selectedKeys[1]}
        };
      }
      if(dataIndex === 'industry_years'){
        temp = {
          ...temp,
          industry:  {from: selectedKeys[0], to:selectedKeys[1]}
        };
      }
      if(dataIndex === 'management_years'){
        temp = {
          ...temp, 
          management:  {from: selectedKeys[0], to:selectedKeys[1]}
        };
      }
      return setFilters(temp);
    } 
    return setFilters((data) => ({
      ...data,
      [dataIndex]: selectedKeys[0],
    }));
  };
  useEffect(() => {
    localStorage.removeItem("filtersCDD");
    localStorage.setItem("filtersCDD", JSON.stringify(filters));
  }, [filters]);


    const handleReset = (clearFilters, confirm, dataIndex) => {
    let temp = { ...filters };
    // delete temp[dataIndex];
    if(dataIndex === 'dob'){ 
      delete temp['yob'];
    }
    if(dataIndex === 'industry_years'){
      delete temp['industry']; 
    }
    if(dataIndex === 'management_years'){
      delete temp['management']; 
    }
    setFilters(temp);  
    clearFilters();
    confirm();
  };   
  const getColumnSearchProps = (dataIndex, type, listData) => (
    {filterDropdown: ({
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
            onSelect={(e,option) => setSelectedKeys(option ? [option] : [])}
            placeholder="Search to Select" 
          >
            {listData?.map((e, i) => {
              return (
                <Select.Option key={i} data={e}>
                  {e.label}
                </Select.Option>
              );
            })}
          </Select>
        ) : (
          ""
        )}
        {type === "multiselect" ? (
          <>
            <Select
              style={{
                width: "100%",
                display: "block",
                marginTop: 10,
              }}
              mode="multiple"  
              onSearch={(e)=> setValueLanguage(e)}
              onChange={(e,o) => setSelectedKeys(o ? [o] : [])}
              allowClear
              placeholder="Please select"
            >
             {listData?.map((e, i) => {
              return (
                <Select.Option key={i} data={e}>
                  {e.label}
                </Select.Option>
              );
            })}
            </Select>
          </>
        ) : (
          ""
        )}
        {type === "range" ? ( 
            <Input.Group compact style={{ marginTop: 10 }}> 
                <div className="">
                  <InputNumber
                    style={{
                      width: "150px",
                      textAlign: "center",
                      marginRight: "10px",
                    }}
                    max={dobto[0]}
                    min={0}
                    onBlur={(e) => setSelectedKeys(e ? [e.target.value] : [])}
                    // onPressEnter={() =>
                    //   handleSearch(selectedKeys, confirm, dataIndex)
                    // }
                    onChange={(e) => {setDob([e]);setCheckChangeDob(false)}}
                  
                    placeholder="From"
                  />
                  <div style={{color: 'red',fontWeight: "bold", width: '150px'}}>{dob[0] >= dobto[0]  && !checkChangeDob?"Must be lower than to's value":null}</div>
                </div>
                <div className="">
                  <InputNumber
                    className="site-input-right"
                    style={{
                      display: 'block',
                      width: 150,
                      textAlign: "center",
                    }}
                    min={dob[0]}
                    // onChange={(e) => selectedKeys[0]}
                    onBlur={(e) =>
                      setSelectedKeys(e ? [...selectedKeys, e.target.value] : [])
                    }
                    onChange={(e) => {setDobTo([e]); setCheckChangeDob(true)}}

                    onPressEnter={() =>
                      handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    placeholder="To"
                  />
                  <div style={{color: 'red',fontWeight: "bold", width: '150px'}}>{dob[0] >= dobto[0] && checkChangeDob?"Must be higher than from's value":null}</div>
                </div>

            </Input.Group> 
        ) : (
          <></>
        )}
        {type === 'manyfields'?(<>
         
        </>):<></>}
      </div>
    ),
    filterIcon: (filtered) => {
      let isActive = Object.keys(filters).filter((e)=> e === dataIndex).length > 0; 
      return (
        <SearchOutlined
          style={{
            color: isActive ? "#1890ff" : undefined,
          }}
        />
      )
    },
  });
  const handleTag = (key) => {
    let temp = { ...filters };
    delete temp[key];
    console.log(key);
    if(key === 'yob'){ 
      delete temp['yob'];
    }
    if(key === 'industry'){
      delete temp['industry']; 
    }
    if(key === 'industry'){
      delete temp['management']; 
    }
    setFilters(temp);
  };
  const columns = formatColumn(
    getColumnSearchProps,
    listDefaultKeyPage?.data,
    listDefaultProp,
    navigate,
    listLanguage
  );
 
  const handlerClickPagination = (e) => {
    localStorage.setItem("pagination", e);
    navigate("?page=" + e);
    setPage(e);
  }; 
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
                    <DownOutlined />handleTag
              </Dropdown>
            </Space> */}
          <div className="wrapper-tag-filter" style={{width: '100%', overflowX: "scroll", display: "flex"}}>
          {convertFilter ? (
            convertFilter.map( (e,i)=> {  
              // console.log(e)
              return (
                <Tag closable key={i} id={i} value={e?.filter} onClose={() => handleTag(e.filter)}>
                  {e?.name} {e?.value?':':''} {e?.value}
                </Tag>
              );
            })
          ) : (
            <></>
          )}
          </div>
          <Table
            rowKey={"id"}
            loading={isFetching}
            style={{ marginTop: 20 }}
            columns={columns}
            dataSource={listData}
            scroll={{ x: '1800px' }}  
            // onRow={(record, rowIndex) => {
            //   return {
            //     onClick: () => {
            //       handlerClickRow(record);
            //     }, // click row
            //   };
            // }}
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
