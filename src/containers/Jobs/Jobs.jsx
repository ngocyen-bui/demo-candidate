import { EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Layout, Space, Table, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useRef, useState } from "react"; 
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getValueFlag } from "../../features/candidate";
import { getListClients } from "../../features/client";
import { getExchangeCurrencies, getKeyJobs, getListJob } from "../../features/job";
import { getListUser } from "../../features/user";
import { useAuth } from "../../hooks/useAuth";
import { getMoneyStatus, getStatusJob } from "../../utils/job";

 



export default function Jobs() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    
    const navigate = useNavigate();
    const search = useLocation().search;
    const pageUrl = new URLSearchParams(search).get("page");
    const [page, setPage] = useState(
      JSON.parse(pageUrl || JSON.parse(localStorage.getItem("filtersJob"))?.page || 1)
    );
    const [filters, setFilters] = useState(() => {
        return JSON.parse(localStorage.getItem("filtersJob")) || {};
      }); 
    const { user: auth } = useAuth();
    const { logout } = useAuth();
    const token = auth?.token;
    
    const { data: totalData, isFetching } = useQuery(
        ["listCandidate", filters, token],
        async () => await getListJob(filters, token), 
    );
    if (totalData?.status === 401) { 
      logout();
      localStorage.removeItem("auth");
    }  
    const { data: listKeyJob } = useQuery(
    ["getListKeyJob", token],
    async () => await getKeyJobs(token)
    ); 
    const { data: getExCurrencies } = useQuery(
        ["listExCurrencies", token],
        async () => await getExchangeCurrencies(token), 
    );
    const { data: getValueDefault } = useQuery(
        ["listValueDefault", token],
        async () => await getValueFlag(token), 
    );
    const { data: listUser } = useQuery(
        ["listUser", token],
        async () => await getListUser(token), 
    );
    const { data: listClient } = useQuery(
        ["listClient", token],
        async () => await getListClients(token), 
    ); 

    useEffect(() => {
        localStorage.setItem("filtersJob", JSON.stringify(filters));
    },[filters]); 
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    }; 
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
    const handlerClickPagination = (e) => { 
      filters.page = e;
      localStorage.setItem("filtersJob", JSON.stringify(filters));
      navigate("?page=" + e);
      setPage(e);
    }; 
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
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
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1890ff' : undefined,
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
    const formatColumn = (listKeyJob) => {
        if(listKeyJob) {
            return [
                {
                    dataIndex: listKeyJob.data[0],
                    title: 'ID',
                    fixed: "left",
                    key: listKeyJob.data[0],
                    width: '120px',
                    render: (id, record) => (
                        <p
                        //   onClick={() => handlerClickRow(record.candidate_id)}
                          style={{
                            cursor: "pointer",
                            color: "rgb(24, 144, 255)",
                            fontWeight: "bold",
                          }}
                        >
                          {id}
                        </p>
                      ),
                    ...getColumnSearchProps(listKeyJob.data[0]),
                },
                {
                    dataIndex: listKeyJob.data[1], 
                    title: 'Title',
                    fixed: "left",
                    key: listKeyJob.data[1],
                    width: '160px',
                    render: (name, record) => (
                        <p
                        //   onClick={() => handlerClickRow(record.candidate_id)}
                          style={{
                            cursor: "pointer",
                            color: "rgb(24, 144, 255)",
                            fontWeight: "bold",
                          }}
                        >
                          {name.label}
                        </p>
                      ),
                    ...getColumnSearchProps(listKeyJob.data[1]),
                },
                {
                    dataIndex: listKeyJob.data[2], 
                    title: 'Status',
                    width: '150px',
                    key:  listKeyJob.data[2], 
                    render: (text) => {
                        let status = getStatusJob(text); 
                        return <Tag 
                        color= {status[0]?.color}
                        style={{ 
                            fontWeight: 'bold',
                            cursor: 'default',  
                          }}
                        >{status[0].label}</Tag>
                    },
                    ...getColumnSearchProps(listKeyJob.data[2]),
                },
                {
                    dataIndex: listKeyJob.data[3], 
                    title: 'Client',
                    width: '180px',
                    key: listKeyJob.data[3],
                    render: (text) => <p style={{textTransform: 'uppercase'}}>{text.name}</p>,
                    ...getColumnSearchProps(listKeyJob.data[3]),
                },
                {
                    dataIndex: 'recruiters', 
                    title: 'Search Consultant',
                    width: '200px',
                    key:  listKeyJob.data[4],
                    render: (text) => { 
                        const color = '#2f54eb'
                        return <Tag 
                        color={'geekblue'}
                        style={{ 
                            fontWeight: 'bold',
                            opacity: '0.8',
                            cursor: 'default', 
                            borderRadius: '4px',
                            textTransform: 'capitalize', 
                          }}
                        >{text[0]?.label}</Tag>
                    },
                    ...getColumnSearchProps(listKeyJob.data[4]),
                },
                {
                    dataIndex: listKeyJob.data[5], 
                    title: 'City',
                    width: '200px',
                    key:listKeyJob.data[5],
                    render: (text) => { 
                        let city = '';
                        let country = '';
                        if(text.city){
                            city= ' - '+text.city.label
                        }
                        if(text.country){
                            country = text.country.label
                        }
                        return <p>{(country + city)}</p>
                    },
                    ...getColumnSearchProps(listKeyJob.data[5]),
                }, 
                {
                    dataIndex: 'remuneration', 
                    title: 'Salary Range',
                    width: '180px',
                    key: listKeyJob.data[6],
                    render: (text) => {   
                        if(!text.salary.from && !text.salary.to){
                            return <Tag color={'orange'} style={{textTransform: 'capitalize', fontWeight: 'bold'}}>Negotiation</Tag>
                        }
                        else{
                            let from = (new Intl.NumberFormat('de-DE', { style: 'currency', currency: text.currency.name }).format(text.salary.from));
                            let to = (new Intl.NumberFormat('de-DE', { style: 'currency', currency: text.currency.name }).format(text.salary.to));
                            const color = getMoneyStatus(text.currency.id); 
                            return <div style={{display: "flex",height: '22px'}}>
                                    <Tag color={color[0].color} style={{fontWeight: 'bold'}}>{text.currency.name}</Tag>
                                    <p>{(from)+" - "+(to)}</p>
                            </div>
                        }
                    },
                    ...getColumnSearchProps(listKeyJob.data[6]),
                },  
                {
                    title: "Action",
                    dataIndex: listKeyJob.data[7],
                    key: listKeyJob.data[7],
                    fixed: "right",
                    width: "150px",
                    render: (record) => {
                      return (
                        <EyeOutlined
                        //   onClick={() => handlerClickRow(record)}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    },
                  },
                ]
        }else{
            return []
        }
         
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
            Jobs List ({totalData?.count||0})
          </div>
          <div style={{ textAlign: "end" }}>
            <Button style={{ marginRight: 10 }} >
              Clear all filters
            </Button>
            <Link to="/add-job">
              <Button type="primary">
                <PlusOutlined />
                Create Job
              </Button>
            </Link>
          </div>
        </div> 
        <div
          className="wrapper-tag-filter"
          style={{ width: "100%", overflowX: "scroll", display: "flex" }}
        > 
          {/* {tagChild} */}
        </div>
        <Table 
            style={{ marginTop: 20 }}
            columns={formatColumn(listKeyJob)} 
            dataSource={totalData?.data} 
            loading={isFetching}
            scroll={{ x: "1340px" }}  
            pagination={{
                current: page,
                showSizeChanger: false,
                showQuickJumper: true,
                total: totalData?.count,
                onChange: (e) => handlerClickPagination(e),
            }}
        />;
        {/* <Table
          rowKey={"id"}
          loading={isFetching}
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={listData}
          scroll={{ x: "1800px" }}  
          pagination={{
            current: page,
            showSizeChanger: false,
            showQuickJumper: true,
            total: count,
            onChange: (e) => handlerClickPagination(e),
          }}
        /> */}
      </Content>
    </Layout>
  </Layout>
  )
}