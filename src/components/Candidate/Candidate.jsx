import {
  DownOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Layout,
  Menu,
  Select,
  Space,
  Tag,
} from "antd";
import Table from "antd/lib/table";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getCandidateByPriorityStatus, getDefaultProp, getKeyPageCDD, getListCandidate } from "../../core/candidate";
import {
  candidate_priority_status as statusPriority,
  findFlowStatus,
  findPriorityStatus,
  getlistStatus,
} from "../../utils/interface";
import { Link, useNavigate } from "react-router-dom";   
 
const formatColumn = (funcSearch,funcSelect,key) => {
  // console.log(key);
  if(key)
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
      ...funcSearch(key[0]),
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
      ...funcSearch(key[1]),
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
      ...funcSelect(key[2], getlistStatus),
    },
    {
      title: "Languages",
      dataIndex: key[3]+'s',
      key: key[3]+'s',
      render: (text) => text?.map((e, i) => <p key={i}>- {e?.label}</p>),
      ...funcSearch(key[3]),
    },
    {
      title: "Highest degree",
      dataIndex: key[4],
      key: key[4],
      render: text => <p>{text.label}</p>,
      ...funcSearch(key[4]),
    },
    {
      title: "City",
      dataIndex: 'addresses',
      key: 'addresses',
      render: text => {
        return text?.map((e, i)=> <div key={i}> {e?.city?.label} {e?.country?.label} {e?.district?.label}</div>)
      },
      ...funcSearch('addresses'),
    },
    {
      title: "Industry",
      dataIndex: 'business_line',
      key: 'business_line',
      render: (text) => text?.map((e, i) => <p key={i}>* {e?.sector?.label || e?.industry?.label}</p>),
      ...funcSearch('business_line'),
    },
    {
      title: "YOB",
      dataIndex: 'dob',
      key: 'dob',
      render: text => {return <p>{text?.slice(0,4)}</p>},
      ...funcSearch('dob'),
    },
    {
      title: "Activity",
      dataIndex: key[8],
      key: key[8],
      render: (text) => <p >{findFlowStatus(text)?.label}</p>,
      ...funcSearch(key[8]),
    },
    {
      title: "Recent companies",
      dataIndex: 'current_employments',
      key: 'current_employments',
      render: (text) => text?.map((e, i) => <p key={i}>- {e?.organization?.label}</p>),
      ...funcSearch('current_employments'),
    },
    {
      title: "Recent positions",
      dataIndex: 'current_employments',
      key: 'current_employments',
      render: (text) => text?.map((e, i) => <p key={i}>- {e?.title?.label}</p>),
      ...funcSearch('current_employments'),
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

const menu = (
  <Menu 
    items={[
      {
        label: "ID",
        key: "1",
        icon: <Checkbox />,
        disabled: true,
      },
      {
        label: "Name",
        key: "2",
        icon: <Checkbox />,
        disabled: true,
      },
      {
        label: "Primary Status",
        key: "3",
        icon: <Checkbox />,
      },
      {
        label: "Languages",
        key: "4",
        icon: <Checkbox />,
      },
      {
        label: "Highest degree",
        key: "5",
        icon: <Checkbox />,
      },
      {
        label: "City",
        key: "6",
        icon: <Checkbox />,
      },
      {
        label: "Industry",
        key: "7",
        icon: <Checkbox />,
      },
      {
        label: "YOB",
        key: "8",
        icon: <Checkbox />,
      },
      {
        label: "Activity",
        key: "9",
        icon: <Checkbox />,
      },
      {
        label: "Recent companies",
        key: "10",
        icon: <Checkbox />,
      },
      {
        label: "Recent positions",
        key: "11",
        icon: <Checkbox />,
      },
      {
        label: "Year of services",
        key: "12",
        icon: <Checkbox />,
      },
      {
        label: "Year of management",
        key: "13",
        icon: <Checkbox />,
      },
      {
        label: "Action",
        key: "14",
        icon: <Checkbox />,
        disabled: true,
      },
    ]}
  />
);
export default function Candidate() {
 
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState(''); 

  const navigate = useNavigate(); 
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [count, setCount] =useState(0)
  const [listData, setListData] = useState();
  const [resetFilter, setResetFilter] = useState(false);
  const [listSearch, setListSearch] = useState({}) 
  const [filters,setFilters] = useState( () => {
    return JSON.parse(localStorage.getItem('filtersCDD'))|| [];
  })
  

  //search    
    
  const searchInput = useRef(null);
  const { data: totalData } = useQuery(
    ["listCandidate", page],
    () => getListCandidate(page),
    { keepPreviousData: true, staleTime: 5000 }
  ); 
    //Get data default key page 
  const { data: listDefaultKeyPage } = useQuery("keyPage", () => getKeyPageCDD());
  const { data: listDefaultProp } = useQuery("defaultProps", () => getDefaultProp());   
 
  console.log(totalData);
  useEffect(() => { 
    if(totalData){ 
      setListData(totalData.data);
      setCount(totalData.count);
    }
  }, [totalData]); 
  
  const clearAllFilter = ()=>{ 
    localStorage.removeItem('filtersCDD')

    // queryClient.prefetchQuery(["listCandidate", page], () =>
    //   getListCandidate(page)
    // );

    // setListData(totalData);
    // setCount(totalData?.count)
  }
  const handlerClickRow = (data)=>{ 
    navigate("/candidate-detail/"+data.candidate_id);
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    setFilters((data)=>({
      ...data,
      [dataIndex]: selectedKeys[0],
    }))
    localStorage.removeItem('filtersCDD');
    localStorage.setItem('filtersCDD', JSON.stringify(filters));
    confirm(); 
  }; 
  console.log(filters?.reduce((e,r)=>{
    return e+r;
  }));
  const handleReset = (clearFilters,confirm) => {
    clearFilters();
    confirm(); 
    setSearchText('');
  };  

  const getColumnSearchProps = (dataIndex) => ({
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
            onClick={() => clearFilters && handleReset(clearFilters,confirm)}
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
        <Input
          ref={searchInput}
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
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const getColumnSelectProps = (dataIndex,listData) => ({
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
            onClick={() => clearFilters && handleReset(clearFilters)}
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
        <Select
            showSearch
            style={{
              width: 200,
              display: 'block',
              marginTop: 10
            }}    
            defaultValue={listSearch?.dataIndex}
            onSelect={(e) => setSelectedKeys(e? [e] : [])}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
          >
            {listData?.map((e,i)=>{
               return <Select.Option key={i} value={e.key}>{e.name}</Select.Option>
            })}c
          </Select>  
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  
  
  const columns = formatColumn(getColumnSearchProps, getColumnSelectProps,listDefaultKeyPage?.data); 
  if (listData)
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
                <Button style={{ marginRight: 10 }} onClick={clearAllFilter} >Clear all filters</Button>
                <Link to="/add-candidate">
                  <Button type="primary">
                    <PlusOutlined />
                    Create candidates
                  </Button>
                </Link>
              </div>
            </div>
            <Space style={{ marginBlock: "10px 16px", float: "right" }}>
              <Dropdown overlay={menu} autoFocus onVisibleChange={false}>
                <Button style={{ width: 160 }}>
                  <Space>
                    Custom Columns
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Space>

            <Table  
              columns={columns}
              dataSource={listData}
              scroll={{ x: true }} 
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => { handlerClickRow(record)}, // click row 
                };
              }}
              pagination={{
                showSizeChanger: false,
                showQuickJumper: true,
                total: count,
                onChange: () =>  setPage(page),
              }}
            />
          </Content>
        </Layout>
      </Layout>
    );
}
