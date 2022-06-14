import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Layout, Space, Table } from "antd";
import { Content } from "antd/lib/layout/layout";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getListCandidate } from "../../core/candidate";
import { findFlowStatus, findPriorityStatus } from "../../utils/interface";

const dataConst = [
  {
    key: "1",
    email: "Bx",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    email: "Bx",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    email: "Bx",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    email: "Bx",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];
const formatData = (arr)=>{ 
    console.log(arr?.data);
    const result = []; 
    if(arr?.data) {
        arr.data.forEach(e => {
            result.push({
                id: e.candidate_id,
                name: e.full_name,
                primaryStatus: findPriorityStatus(e.priority_status),
                languages: e.languages,
                highestDegree: e.highest_education.label || '',
                city: '',
                industry: e.business_line,
                YOB: '',
                activity: findFlowStatus(e.flow_status)?.label,
                recentCompany: e.current_employments,
                recentPositions: [],
                yearOfServices: 0,
                yearOfManagement: 0, 
            })
        });
    }
    
    console.log(result);

}

export default function Candidate() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [listData, setListData] = useState([]);
  const searchInput = useRef(null);

  //   const queryClient = useQueryClient();

  const { status, data, error, isFetching } = useQuery("repoData", async () => {
    return await getListCandidate(3);
  }); 
  formatData(data);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const handlerChangePagination = (page) => {
    console.log(page);
  }
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: "20%",
      ...getColumnSearchProps("age"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
  ];
  return status === "loading" ? (
    "Loading..."
  ) : status === "error" ? (
    <span>Error: {error.message}</span>
  ) : (
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
          <Table columns={columns} dataSource={dataConst}  pagination={{ showSizeChanger: false, showQuickJumper: true, total: data.count, onChange: handlerChangePagination }}/> 
        </Content>
      </Layout>
    </Layout>
  );
}
