import { EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Layout, Select, Space, Table, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useRef, useState } from "react"; 
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLocationFromCountry, getValueFlag } from "../../features/candidate";
import { getListClients } from "../../features/client";
import { getExchangeCurrencies, getKeyJobs, getListJob } from "../../features/job";
import { getListUser } from "../../features/user";
import { useAuth } from "../../hooks/useAuth";
import { getMoneyStatus, getStatusJob, listStatus } from "../../utils/job";
  
export default function Jobs() { 
    const searchInput = useRef(null);
    
    const navigate = useNavigate();
    const search = useLocation().search;
    const pageUrl = new URLSearchParams(search).get("page");
    const [page, setPage] = useState(
      JSON.parse(pageUrl || JSON.parse(localStorage.getItem("filtersJob"))?.page || 1)
    );
    const [stringFilter, setStringFilter] = useState('')
    const [country, setCountry] = useState(); 
    const [rangeDefaults, setRangeDefaults] = useState({
      from: null,
      to: null
    })   
    const [checkErr,setCheckErr] = useState()
    const [filters, setFilters] = useState(JSON.parse(localStorage.getItem("filtersJob")) || {}); 

    const { user: auth } = useAuth();
    const { logout } = useAuth();
    const token = auth?.token; 

    const { data: totalDataJobs, isFetching } = useQuery(
        ["listJobs", stringFilter, token],
        async () => await getListJob(stringFilter, token), 
    );
    const convertStringFilter = (filters)=>{
      const listFilter = filters;
      let str = '?page='+(page || 1)+'&perPage='+(listFilter['perPage']|| 10);
      for (const f in listFilter) {  
        if(f === 'location'){
          let city = ''; 
          if(Boolean(listFilter[f].city.key)) {
            city = '&city='+listFilter[f]?.city?.key
          }
          str +=`&country=${listFilter[f].country.key}${city}`
        } 
        else if(f === 'page'|| f=== 'perPage'){
          continue;
        } 
        else if (f === 'salary'){
            console.log(listFilter[f]);
            str+= `&currency=${listFilter[f]?.rule?.key}&salary_from=${listFilter[f]?.from}&salary_to=${listFilter[f]?.to}`
        } 
        else if(Array.isArray(listFilter[f])){
            let arr = listFilter[f]?.map(e => e?.id);
            str +='&'+f+'='+arr.toString();
        } else{
            str +='&'+f+'='+listFilter[f];
  
        }
      }
      return str;
    }
    if (totalDataJobs?.status === 401) { 
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
        ["listVlDefault", token],
        async () => await getValueFlag(token), 
    );
    const { data: listUser } = useQuery(
        ["listUser", token],
        async () => await getListUser(token), 
    );
    const { data: listClient } = useQuery(
        ["listClients", token],
        async () => await getListClients(token), 
    );   
    const { data: dataFromCountry } = useQuery(
      ["listFromCountry", country,token],
      () => getLocationFromCountry(country,token),
      { enabled: Boolean(country) }
    );   
    useEffect(() => { 
        localStorage.setItem("filtersJob",JSON.stringify({...filters,page: page, perPage: 10}));   
        setPage(page)
        setStringFilter(convertStringFilter(filters));
        navigate(convertStringFilter(filters));
    },[filters,page,navigate]);  

    const handleSearchCountry = (e,o)=>{ 
      setCountry(o.data.key)
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {    
      let temp = [];   
      if(dataIndex === 'location'){
        let city ={}
        if(selectedKeys?.city?.data){
          city = {
            key: selectedKeys.city.data.key,
            label: selectedKeys.city.data.label,
          }
        } 
        temp = {
          country: {
            key: selectedKeys.country.data.key,
            label: selectedKeys.country.data.label,
          },
          city:city
        }
      } 
      else if(dataIndex === 'salary' ){
        temp = {  from: selectedKeys.from || filters[dataIndex]?.from, 
                  to: selectedKeys.to || filters[dataIndex]?.to,
                  rule: (selectedKeys.rule || {key: 2, label: 'VND'})}
      }
      else if(!selectedKeys[0] || selectedKeys[0]?.length === 0) {
        let fake = { ...filters};
        delete fake[dataIndex]; 
        confirm();
        return setFilters(fake) 
      }
      else if(Array.isArray(selectedKeys[0])){  
          temp = selectedKeys[0].map((e)=>{
            return {id:e?.data?.id, key: e?.data?.key||e?.data?.id, name: e?.data?.name || e?.data?.full_name || e?.data?.label , }
          }) 
        }
      else{
        temp = selectedKeys[0]
      }
      setFilters({
        ...filters,
        [dataIndex]: temp
      })  

      setStringFilter(convertStringFilter(filters)); 
      setPage(1)
      confirm();   
    };   
    const handleReset = (clearFilters,confirm,dataIndex) => {
      let temp = { ...filters }; 
      delete temp[dataIndex]; 
      setFilters(temp);
      clearFilters(); 
      confirm()
    };
    const handlerClickPagination = (e) => { 
      filters.page = e;
      localStorage.setItem("filtersJob", JSON.stringify(filters));
      navigate("?page=" + e);
      setPage(e);
    }; 
    const clearAllFilter = () => {
      setFilters({page: 1, perPage: 10});
      setPage(1)
    }; 
    const getColumnSearchProps = (dataIndex,type) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          let dataMultiSelect = [];
          if(dataIndex === 'status'){
            dataMultiSelect = listStatus;
          }
          else if(dataIndex === 'client'){
            dataMultiSelect = listClient?.data;
          } 
          else if(dataIndex === 'search_consultants'){
            dataMultiSelect = listUser?.data;
          } 
          const getLisValue = (e)=>{  
              if(e === 'status'){
                return filters[e]?.map(e =>
                  e?.id)  
              }else  if(e === 'client'){
                return filters[e]?.map(e =>
                  e?.id)  
              }else  if(e === 'search_consultants'){
                return filters[e]?.map(e =>
                  e?.id)  
              }
          }
          
          let data = {}
          if(type === 'input'){ 
            data = { defaultValue: 
              filters?.[dataIndex],
              key: filters[dataIndex]
             };   
          }
          else if(type === 'select'){
            data.country = { 
              defaultValue: filters[dataIndex]?.country?.label, 
              key: filters[dataIndex]?.country?.label
            };  
            data.city = { value: 
              filters[dataIndex]?.city?.label
            };  
          }
          else if(type === 'multiselect'){  
            data = { defaultValue: 
              getLisValue(dataIndex), 
              key: getLisValue(dataIndex)
            };  
          }  
          else if(type === 'range'){  
           if(filters[dataIndex]){
            data.from = { value: 
              filters[dataIndex]?.from
            };  
            data.to = { value: 
              filters[dataIndex]?.to
            }; 
            data.rule = { defaultValue: 
              filters[dataIndex]?.rule?.key
            };   
           } 
          }  
          return (
            <div
              style={{
                padding: 8,
              }}
            > 
              <Space>
              <Button
                  onClick={() => clearFilters && handleReset(clearFilters, confirm,dataIndex)}
                  size="small"
                  style={{
                    width: '95px',
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
                    width: '100px',
                  }}
                >
                  Search
                </Button>
               
              </Space>
              {type === 'multiselect'?
              <>
               <Select
                  style={{
                    width: "100%",
                    display: "block",
                    marginTop: '8px',
                  }} 
                  {...data}
                  mode="multiple" 
                  onSearch={e => console.log(e)}
                  onChange={(e, o) =>{ setSelectedKeys(o ? [o] : [])}}
                  allowClear  
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  placeholder={`Please select ${dataIndex}`}
                >
                  {dataMultiSelect?.map((e, i) => { 
                    return (
                      <Select.Option key={i} value={e.id} data={e} style={{textTransform: 'capitalize'}}>
                        {e.label || e.name || e.full_name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </>
              :<></>}
               {type=== 'input'?
                <Input
                ref={searchInput}
                {...data}
                placeholder={`Search ${dataIndex}`} 
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{
                  marginTop: '8px',
                  display: 'block',
                }}
              />:<></>}
              {type=== 'select'?
               <>
               <Select
              showSearch
              style={{
                width: 200,
                display: "block",
                marginTop: 10,
              }}
              {...data.country}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              onSelect={(e, option) => {
                handleSearchCountry(e,option)
                setSelectedKeys(option ? {...selectedKeys,country: option} : {})
              }}  
              placeholder="Country"
            >
              {getValueDefault?.data?.map((e, i) => {
                return (
                  <Select.Option values={e.key} key={e.key} data={e}>
                    {e.label}
                  </Select.Option>
                );
              })}
            </Select>
            <Select
              showSearch
              style={{
                width: 200,
                display: "block",
                marginTop: 10,
              }}
              {...data.city}
              disabled={Boolean(!dataFromCountry?.data) && !filters[dataIndex]?.city?.label}
              onSelect={(e, option) => { 
                setSelectedKeys(option ? {...selectedKeys,city: option} : {})
              }} 
              placeholder="City"
            >
              {dataFromCountry?.data?.map((e) => {
                return (
                  <Select.Option key={e.key} values={e.key} data={e}>
                    {e.label}
                  </Select.Option>
                );
              })}
            </Select>
               </>
              :<></>}
              {type==='range'?<>
              <Input.Group compact style={{ marginTop: 10 }}>
              <div>
                <InputNumber
                  style={{
                    width: "150px",
                    textAlign: "center",
                    marginRight: "10px",
                  }}
                  max={rangeDefaults.to}
                  min={0} 
                  {...data.from}
                  onChange={(e) => {
                     setRangeDefaults({...rangeDefaults, from: e});
                     setCheckErr(false);
                     setSelectedKeys(e ? {...selectedKeys,from: e} : selectedKeys)
                  }}
                  placeholder="From"
                />
                <div style={{ color: "red", fontWeight: "bold", width: "150px" }}>
                  {rangeDefaults.from > rangeDefaults.to && !checkErr
                    ? "Must be lower than to's value"
                    : null}
                </div>
              </div>
              <div>
                <InputNumber
                  className="site-input-right"
                  style={{
                    display: "block",
                    width: 150,
                    textAlign: "center",
                  }}
                  min={rangeDefaults.from}  
                  onChange={(e) => {
                    setSelectedKeys(e ? {...selectedKeys,to: e} : selectedKeys) 
                    setRangeDefaults({...rangeDefaults, to: e});
                    setCheckErr(true);
                  }} 
                  {...data.to} 
                  onPressEnter={(e) =>
                  {  
                    handleSearch(selectedKeys, confirm, dataIndex)}
                  }
                  placeholder="To"
                />
                <div style={{ color: "red", fontWeight: "bold", width: "150px" }}>
                  {rangeDefaults.from >= rangeDefaults.to && checkErr
                    ? "Must be higher than from's value"
                    : null}
                </div>
              </div>
                <Select {...data.rule} defaultValue={"VND"} style={{ width: '80px', marginLeft: '10px' }} onChange={(e,o) => {
                  setSelectedKeys(e ? {...selectedKeys,rule: o?.data} : selectedKeys) 
                }}>
                {getExCurrencies?.map((e) => {
                return (
                  <Select.Option value={e.key} key={e.key} data={e}>
                    {e.label}
                  </Select.Option>
                );
              })}
              </Select>
            </Input.Group>
              </>:<></>}
            </div>
          )
        },
        filterIcon: (filtered) => {
          let color = filters?.[dataIndex] ? "#1890ff" : "#ddd";
          return (
            <SearchOutlined
              style={{
                color: color,
              }}
            />
          )
        }, 
        // onFilterDropdownVisibleChange: (visible) => {
        //   if (visible) {
        //     setTimeout(() => searchInput.current?.select(), 100);
        //   }
        // },
         
    });
    const handlerClickRow = (data) => {
      navigate("/job-detail/" + data);
    };
    const formatColumn = (listKeyJob) => {
      const type = {
        input: 'input',
        multiselect: 'multiselect',
        select: 'select',
        range: 'range',
      }
        if(listKeyJob) {
            return [
                {
                    dataIndex: listKeyJob.data[0],
                    title: 'ID',
                    fixed: "left",
                    key: listKeyJob.data[0],
                    width: '150px',
                    render: (id, record) => (
                        <p
                          onClick={() => handlerClickRow(record.job_id)}
                          style={{
                            cursor: "pointer",
                            color: "rgb(24, 144, 255)",
                            fontWeight: "bold",
                          }}
                        >
                          {id}
                        </p>
                      ),
                    ...getColumnSearchProps(listKeyJob.data[0],type.input),
                },
                {
                    dataIndex: listKeyJob.data[1], 
                    title: 'Title',
                    fixed: "left",
                    key: listKeyJob.data[1],
                    width: '160px',
                    render: (name, record) => (
                        <p
                        onClick={() => handlerClickRow(record.job_id)}
                          style={{
                            cursor: "pointer",
                            color: "rgb(24, 144, 255)",
                            fontWeight: "bold",
                          }}
                        >
                          {name?.label}
                        </p>
                      ),
                    ...getColumnSearchProps('title_text',type.input),
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
                        >{status[0]?.label}</Tag>
                    },
                    ...getColumnSearchProps(listKeyJob.data[2],type.multiselect),
                },
                {
                    dataIndex: listKeyJob.data[3], 
                    title: 'Client',
                    width: '180px',
                    key: listKeyJob.data[3],
                    render: (text) => <p style={{textTransform: 'uppercase'}}>{text?.name}</p>,
                    ...getColumnSearchProps(listKeyJob.data[3],type.multiselect),
                },
                {
                    dataIndex: 'recruiters', 
                    title: 'Search Consultant',
                    width: '200px',
                    key:  listKeyJob.data[4],
                    render: (text) => {  
                        return <Tag 
                        color={'geekblue'}
                        style={{ 
                            fontWeight: 'bold',
                            opacity: '0.8',
                            cursor: 'default', 
                            borderRadius: '4px',
                            textTransform: 'capitalize', 
                          }}
                        >{text?.[0]?.label}</Tag>
                    },
                    ...getColumnSearchProps(listKeyJob.data[4],type.multiselect),
                },
                {
                    dataIndex: listKeyJob.data[5], 
                    title: 'City',
                    width: '200px',
                    key:listKeyJob.data[5],
                    render: (text) => { 
                        let city = '';
                        let country = '';
                        if(text?.city){
                            city= ' - '+text.city.label
                        }
                        if(text?.country){
                            country = text.country.label
                        }
                        return <p>{(country + city)}</p>
                    },
                    ...getColumnSearchProps(listKeyJob.data[5],type.select),
                }, 
                {
                    dataIndex: 'remuneration', 
                    title: 'Salary Range',
                    width: '180px',
                    key: listKeyJob.data[6],
                    render: (text) => {   
                        if(!text?.salary?.from && !text?.salary?.to){
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
                    ...getColumnSearchProps(listKeyJob.data[6],type.range),
                },  
                {
                    title: "Action",
                    dataIndex: listKeyJob.data[0],
                    key: listKeyJob.data[7],
                    fixed: "right",
                    width: "150px",
                    render: (record) => {
                      return (
                        <EyeOutlined
                          onClick={() => handlerClickRow(record)}
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
    const handleCloseTag = (e) => {   
      let temp = { ...filters }; 
      delete temp[e]; 
      setFilters(temp);
    };  
    const forMap = (tag) => { 
      let name =  '';
      let label = '';
      if(tag[0] === 'job_id'){
        name =  'ID:'
      }
      else if(tag[0] === 'title_text'){
        name =  'Title:'
      }
      else if(tag[0] === 'status'){
        name =  'Status:'
      }
      else if(tag[0] === 'client'){
        name =  'Client:'
      }
      else if(tag[0] === 'search_consultants'){
        name =  'Search Consultants:'
      }   

      
      if(tag[0] === 'page' || tag[0] === 'perPage'){
        return ;
      }
      else if (tag[0]=== 'salary'){
        name = 'Salary:'
        label = `from ${tag[1]?.from} to ${tag[1]?.to} ${tag[1]?.rule?.label}`
      }
      else if(Array.isArray(tag[1])){  
        label =` ${(tag[1]?.map(e => e.name)).toString()}`;
      } 
      else if(tag[0]=== 'location'){ 
        name =  'City:' 
        label = `${tag[1]?.country?.label}  ${tag[1]?.city?.label|| ''}`;
      } 
      else { 
        label = tag[1]
      }

      const tagElem = (
        <Tag
          closable
          onClose={(e) => {
            // e.preventDefault();
            handleCloseTag(tag[0]);
          }}
        >
          {name} {label}
        </Tag>
      );
      return (
        <span
          key={name}
          style={{
            display: 'inline-block',
          }}
        >
          {tagElem}
        </span>
      );
    }; 

    let temp = Object.entries(filters);    
    const tagChild = temp?.map(forMap);
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
            Jobs List ({totalDataJobs?.count||0})
          </div>
          <div style={{ textAlign: "end" }}>
            <Button style={{ marginRight: 10 }} onClick={clearAllFilter} >
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
          style={{ width: "100%", overflowX: "scroll", display: "flex" , paddingTop: '10px'}}
        > 
          {tagChild}
        </div>
        <Table 
            rowKey={"id"}
            style={{ marginTop: 20 }}
            columns={formatColumn(listKeyJob)} 
            dataSource={totalDataJobs?.data} 
            loading={isFetching}
            scroll={{ x: "1370px" }}  
            pagination={{
                current: page,
                showSizeChanger: false,
                showQuickJumper: true,
                total: totalDataJobs?.count,
                onChange: (e) => handlerClickPagination(e),
            }}
        />; 
      </Content>
    </Layout>
  </Layout>
  )
}