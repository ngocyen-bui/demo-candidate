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
import { getListCandidate } from "../../core/candidate";
import {
  candidate_priority_status as statusPriority,
  findFlowStatus,
  findPriorityStatus,
  getlistStatus,
} from "../../utils/interface";
import { Link, useNavigate } from "react-router-dom";
  
const formatData = (arr) => {
  if (arr?.data) {
    return arr.data.map((e, index) => {
      return {
        key: index,
        id: e.candidate_id,
        name: e.full_name,
        primaryStatus: findPriorityStatus(e.priority_status)?.label,
        languages: e?.languages?.map((e) => e.label),
        highestDegree: e.highest_education.label || "",
        city: e.address || "",
        industry: e?.business_line?.map(
          (e) => "* " + (e?.category?.label || e.sector?.label)
        ),
        YOB: "",
        activity: findFlowStatus(e.flow_status)?.label,
        recentCompany: e.current_employments.map((e) => e?.organization?.label),
        recentPositions: [],
        yearOfServices: 0,
        yearOfManagement: 0,
      };
    });
  }
};
const formatColumn = (funcSearch,funcSelect) => {
  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      ...funcSearch("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      ...funcSearch("name"),
    },
    {
      title: "Primary Status",
      dataIndex: "primaryStatus",
      key: "primaryStatus",
      render: (text) => {
        let x = statusPriority.filter((e) => e.name === text)[0];
        return (
          <Tag
            style={{
              color: x.color,
              borderColor: x.color,
              background: "#f6ffed",
            }}
          >
            {x.label}
          </Tag>
        );
      },
      ...funcSelect("primaryStatus", getlistStatus),
    },
    {
      title: "Languages",
      dataIndex: "languages",
      key: "languages",
      render: (text) => text.map((e, i) => <p key={i}>- {e}</p>),
      ...funcSearch("languages"),
    },
    {
      title: "Highest degree",
      dataIndex: "highestDegree",
      key: "highestDegree",
      ...funcSearch("highestDegree"),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      ...funcSearch("city"),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text) => text.map((e, i) => <p key={i}>{e}</p>),
      ...funcSearch("industry"),
    },
    {
      title: "YOB",
      dataIndex: "yob",
      key: "yob",
      ...funcSearch("yob"),
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      ...funcSearch("activity"),
    },
    {
      title: "Recent companies",
      dataIndex: "recentCompany",
      key: "recentCompany",
      render: (text) => text.map((e, i) => <p key={i}>- {e}</p>),
      ...funcSearch("recentCompany"),
    },
    {
      title: "Recent positions",
      dataIndex: "recentPositions",
      key: "recentPositions",
      render: (text) => text.map((e, i) => <p key={i}>- {e}</p>),
      ...funcSearch("recentPositions"),
    },
    {
      title: "Year of services",
      dataIndex: "yearOfServices",
      key: "yearOfServices",
      ...funcSearch("yearOfServices"),
    },
    {
      title: "Year of management",
      dataIndex: "yearOfManagement",
      key: "yearOfManagement",
      ...funcSearch("yearOfManagement"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
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
  const [listData, setListData] = useState();
  const [resetFilter, setResetFilter] = useState(false);
  // const [listColumn, setListColumn] = useState([]);
  const searchInput = useRef(null);
  const { data} = useQuery(
    ["listCandidate", page],
    () => getListCandidate(page),
    { keepPreviousData: true, staleTime: 5000 }
  );
  // Prefetch the next page!
  useEffect(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery(["projects", page + 1], () =>
        getListCandidate(page + 1)
      );
    }
  }, [data, page, queryClient]);
  useEffect(() => {
    setListData(formatData(data));
  }, [data]);
  useEffect(()=>{
    if(resetFilter && data?.hasMore){
      queryClient.prefetchQuery(["projects", page], () =>
      getListCandidate(page)
    );
    }
  },[resetFilter,data?.hasMore,page,queryClient]) 

  const handlerClickRow = (data)=>{ 
    navigate("/candidate-detail/"+data.id);
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);  
  };

  const handleReset = (clearFilters) => {
    clearFilters();
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
          >
            {listData?.map((e,i)=>{
               return <Select.Option value={e.key}>{e.name}</Select.Option>
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
  const handlerChangePagination = (page) => {
    setPage(page);
  };
  const columns = formatColumn(getColumnSearchProps, getColumnSelectProps);

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
                Candidates List ({data.count})
              </div>
              <div style={{ textAlign: "end" }}>
                <Button style={{ marginRight: 10 }}>Clear all filters</Button>
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
                  onClick: event => {handlerClickRow(record)}, // click row 
                };
              }}
              pagination={{
                showSizeChanger: false,
                showQuickJumper: true,
                total: data.count,
                onChange: handlerChangePagination,
              }}
            />
          </Content>
        </Layout>
      </Layout>
    );
}
