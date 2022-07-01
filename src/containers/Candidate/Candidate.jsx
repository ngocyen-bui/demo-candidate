import { EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Layout, Select, Space, Tag } from "antd";
import Table from "antd/lib/table";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  getDefaultProp,
  getKeyPageCDD,
  getLanguage,
  getListCandidate, 
  getLocationFromCountry,
  getValueFlag,
} from "../../features/candidate";
import {
  candidate_flow_status,
  findFlowStatus,
  findPriorityStatus,
  getlistStatus,
} from "../../utils/interface";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const formatColumn = (funcSearch, key, listProps, navigate, listLanguage) => {
  let language = listLanguage?.data;
  let degree;
  if (listProps) {
    // let a = Object.values(listProps).find((obj) => {
    //   return obj.name === "language";
    // });
    let b = Object.values(listProps).find((obj) => {
      return obj.name === "degree";
    });

    //  language = a?.values;
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
        width: "150px",
        fixed: "left",
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
        fixed: "left",
        width: "150px",
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
        width: "150px",
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
        width: "150px",
        key: key[3] + "s",
        render: (text) => text?.map((e, i) => <p key={i}>- {e?.label}</p>),
        ...funcSearch(key[3], "multiselect", language),
      },
      {
        title: "Highest degree",
        dataIndex: key[4],
        key: key[4],
        width: "150px",
        render: (text) => <p>{text.label}</p>,
        ...funcSearch(key[4], "select", degree),
      },
      {
        title: "City",
        dataIndex: "addresses",
        width: "200px",
        key: "addresses",
        render: (text) => {
          return text?.map((e, i) => (
            <div key={i}>
              {e?.city?.label} {e?.country?.label} {e?.district?.label}
            </div>
          ));
        },
        ...funcSearch("addresses", "manyfieldsCity", []),
      },
      // {
      //   title: "Industry",
      //   dataIndex: "business_line",
      //   width: "200px",
      //   key: "business_line",
      //   render: (text) =>
      //     text?.map((e, i) => (
      //       <p key={i}>* {e?.sector?.label || e?.industry?.label}</p>
      //     )),
      //   ...funcSearch("business_line", "manyfieldsIndustry", []),
      // },
      {
        title: "YOB",
        dataIndex: "dob",
        width: "150px",
        key: "dob",
        render: (text) => {
          return <p>{text?.slice(0, 4)}</p>;
        },
        ...funcSearch("dob", "range"),
      },
      {
        title: "Activity",
        dataIndex: key[8],
        width: "150px",
        key: key[8],
        render: (text) => <p>{findFlowStatus(text)?.label}</p>,
        ...funcSearch(key[8], "select", candidate_flow_status),
      },
      {
        title: "Recent companies",
        dataIndex: "current_employments",
        key: "current_employments_companies",
        width: "150px",
        render: (text) =>
          text?.map((e, i) => <p key={i}>- {e?.organization?.label}</p>),
        ...funcSearch("current_company_text", "input"),
      },
      {
        title: "Recent positions",
        dataIndex: "current_employments",
        key: "current_employments_positions",
        width: "150px",
        render: (text) =>
          text?.map((e, i) => <p key={i}>- {e?.title?.label}</p>),
        ...funcSearch("current_position_text", "input"),
      },
      {
        title: "Year of services",
        dataIndex: key[11],
        key: key[11],
        width: "150px",
        ...funcSearch(key[11], "range"),
      },
      {
        title: "Year of management",
        dataIndex: key[12],
        key: key[12],
        width: "150px",
        ...funcSearch(key[12], "range"),
      },
      {
        title: "Action",
        dataIndex: "candidate_id",
        key: key[13],
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

  const [country, setCountry] = useState(); 
  //search results
  const [dob, setDob] = useState({});
  const [dobto, setDobTo] = useState({});
  const [checkChangeDob, setCheckChangeDob] = useState(false);
  const [convertFilter, setConvertFilter] = useState([]); 
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
    ["getLanguageByValue", valueLanguage, token],
    async () => await getLanguage(valueLanguage, token)
  );

  const { data: listCountries } = useQuery(["repoData",token], () => getValueFlag(token));

  const { data: dataFromCountry } = useQuery(
    ["locationFromCountry", country,token],
    () => getLocationFromCountry(country,token),
    { enabled: Boolean(country) }
  );  
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
    setPage(1);
    navigate("?page=" + 1);
    confirm();
    localStorage.setItem("pagination", 1); 
    if (selectedKeys.length === 0 ) return; 
    if(dataIndex === 'addresses'){
      temp = {
        ...temp,
        addresses: { country: {key:selectedKeys[0].data.key, label: selectedKeys[0].data.label}, city: {key: selectedKeys[1]?.data?.key, label: selectedKeys[1]?.data?.label}},
      }; 
      return setFilters(temp);
    } 
    if (selectedKeys?.from && selectedKeys?.to) { 
      if(selectedKeys?.from >= selectedKeys?.to) return;
      if (dataIndex === "yob") {
        temp = {
          ...temp,
          yob: { yob_from: selectedKeys?.from, yob_to: selectedKeys?.to },
        };
      }
      if (dataIndex === "industry_years") {
        temp = {
          ...temp,
          industry_years: { industry_years_from: selectedKeys?.from, industry_years_to: selectedKeys?.to },
        };
      }
      if (dataIndex === "management_years") {
        temp = {
          ...temp,
          management_years: { management_years_from: selectedKeys?.from, management_years_to: selectedKeys?.to },
        };
      } 
      return setFilters(temp);
    } 
    if(typeof(selectedKeys[0]) === 'string' || Array.isArray(selectedKeys)) {

      return setFilters((data) => ({
        ...data,
        [dataIndex]: selectedKeys[0],
      }));
    }
    
  }; 
  useEffect(() => { 
    localStorage.setItem("filtersCDD", JSON.stringify(filters));
    let temp = Object.entries(filters);  
    let arr = temp.map((e) => {
      // console.log(e);
      if (e[0] === "full_name") {
        return {
          filter: "full_name",
          name: "Name",
          value: e[1],
          prevValue: e[1],
        };
      }
      if (e[0] === "priority_status") {
        return {
          filter: "priority_status",
          name: "Primary Status",
          value: e[1]?.data?.label,
          prevValue: e[1],
        };
      }
      if (e[0] === "candidate_id") {
        return {
          filter: "candidate_id",
          name: "ID",
          value: e[1],
          prevValue: e[1],
        };
      }
      if (e[0] === "language") {
        let temp = "";
        if (e[1].length > 1) {
          temp = e[1]?.map((e) => e.children)?.toString();
        } else {
          temp = e[1][0]?.data?.label;
        }
        return {
          filter: "language",
          name: "Languages",
          value: temp,
          prevValue: e[1],
        };
      }
      if (e[0] === "highest_education") {
        return {
          filter: "highest_education",
          name: "Highest degree",
          value: e[1].children,
          prevValue: e[1],
        };
      }
      if (e[0] === "flow_status") {
        return {
          filter: "flow_status",
          name: "Activity",
          value: e[1]?.data?.label,
          prevValue: e[1],
        };
      } 
      if (e[0] === "addresses") {
        return {
          filter: "addresses",
          name: "Location",
          value: e[1].country.label + ( e[1].city.label?" - "+e[1].city.label:''),
          prevValue: e[1],
        };
      }
      if (e[0] === "yob") {
        return {
          filter: "yob",
          name: "YOB",
          value: "from " + e[1].yob_from + " to " + e[1].yob_to,
          prevValue: e[1],
        };
      }
      if (e[0] === "industry_years") {
        return {
          filter: "industry_years",
          name: "Year of services",
          value: "from " + e[1].industry_years_from + " to " + e[1].industry_years_to,
          prevValue: e[1],
        };
      }
      if (e[0] === "management_years") {
        return {
          filter: "management_years",
          name: "Management",
          value: "from " + e[1].management_years_from + " to " + e[1].management_years_to,
          prevValue: e[1],
        };
      }
      if (e[0] === "current_position_text") {
        return {
          filter: "current_position_text",
          name: "Recent positions",
          value: e[1],
          prevValue: e[1],
        };
      }
      if (e[0] === "current_company_text") {
        return {
          filter: "current_company_text",
          name: "Recent companies",
          value: e[1],
          prevValue: e[1],
        };
      }

      return {};
    }); 
    setConvertFilter(arr);
  }, [filters]);

  const handleReset = (clearFilters, confirm, dataIndex) => { 
    clearFilters();
    confirm();
    let temp = { ...filters };
    delete temp[dataIndex];
    if (dataIndex === "dob") {
      delete temp["yob"];
      setDob([]);
      setDobTo([]);
    }
    setFilters(temp);
  };
  const handleSearchCountry = (e,o)=>{ 
    setCountry(o.data.key)
  }
  const handleCloseTag = (e) => { 
    let key = e.filter; 
    let temp = { ...filters }; 
    delete temp[key]; 
    setFilters(temp);
  }; 
  const getColumnSearchProps = (dataIndex, type, listData) => ({
    onFilterDropdownVisibleChange: (e)=>{
      // console.log({[dataIndex]: e}); 
    },
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm, 
      clearFilters,
    }) => {
      const getLisValue = (e)=>{
        if(e === 'language'){
          return  filters[e]?.map(e =>
          e?.data?.label
         ) 
        }
      }
      let data = {}
      if(type === 'input'){ 
        data = { value: 
          filters?.[dataIndex]
         };   
      }
      if(type === 'select'){
        data = { value: 
          filters[dataIndex]?.data?.label
        };  
      }
      if(type === 'multiselect'){
        data = { value: 
          getLisValue(dataIndex)
        };  
      }
      if(type === 'range'){
        data.from = { value: 
          filters[dataIndex]?.[dataIndex+'_from']
        };  
        data.to = { value: 
          filters[dataIndex]?.[dataIndex+'_to']
        };  
      }
      if(type === 'manyfieldsCity'){
        data.country = { value: 
          filters[dataIndex]?.country?.label
        };  
        data.city = { value: 
          filters[dataIndex]?.city?.label
        };  
      }
      return (
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
              disabled={type === 'range' && dob?.[dataIndex] >= dobto?.[dataIndex]}
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
             {...data}
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
              {...data}
              // defaultValue={filters[dataIndex]?.data?.label|| null}
              onSelect={(e, option) => setSelectedKeys(option ? [option] : [])}
              placeholder={dataIndex}
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
                onSearch={(e) => setValueLanguage(e)}
                onChange={(e, o) => setSelectedKeys(o ? [o] : [])}
                allowClear
                {...data}
                // defaultValue={getLisValue(dataIndex)}
                placeholder="Please select"
              >
                {listData?.map((e, i) => { 
                  return (
                    <Select.Option key={i} value={e.key} data={e}>
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
                  // onBlur={(e) => setSelectedKeys(e ? {...selectedKeys,from: e.target.value} : {})}
                  // onPressEnter={() =>
                  //   handleSearch(selectedKeys, confirm, dataIndex)
                  // }
                  // defaultValue={filters[dataIndex]?.[dataIndex+'_from']}
                  {...data.from}
                  onChange={(e) => {
                    setDob({[dataIndex]: e});
                    setCheckChangeDob(false);
                    setSelectedKeys(e ? {...selectedKeys,from: e} : {})
                  }}
                  placeholder="From"
                />
                <div style={{ color: "red", fontWeight: "bold", width: "150px" }}>
                  {dob?.[dataIndex] >= dobto?.[dataIndex] && !checkChangeDob
                    ? "Must be lower than to's value"
                    : null}
                </div>
              </div>
              <div className="">
                <InputNumber
                  className="site-input-right"
                  style={{
                    display: "block",
                    width: 150,
                    textAlign: "center",
                  }}
                  min={dob?.[dataIndex]} 
                  // onBlur={(e) =>
                  //   setSelectedKeys(e ? {...selectedKeys,to: e.target.value} : {})
                  // }
                  onChange={(e) => {
                    setSelectedKeys(e ? {...selectedKeys,to: e} : {}) 
                    setDobTo({[dataIndex]: e});
                    setCheckChangeDob(true);
                  }}
                  // defaultValue={filters[dataIndex]?.[dataIndex+'_to']}
                  {...data.to} 
                  onPressEnter={() =>
                    handleSearch(selectedKeys, confirm, dataIndex)
                  }
                  placeholder="To"
                />
                <div style={{ color: "red", fontWeight: "bold", width: "150px" }}>
                  {dob?.[dataIndex] >= dobto?.[dataIndex] && checkChangeDob
                    ? "Must be higher than from's value"
                    : null}
                </div>
              </div>
            </Input.Group>
          ) : (
            <></>
          )} 
          {type === "manyfieldsCity" ? <> 
            <Select
              showSearch
              style={{
                width: 200,
                display: "block",
                marginTop: 10,
              }}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              onSelect={(e, option) => {
                handleSearchCountry(e,option)
                setSelectedKeys(option ? [option] : [])
              }} 
              {...data.country}
              // defaultValue={filters[dataIndex]?.country?.label}
              placeholder="Country"
            >
              {listCountries?.data?.map((e, i) => {
                return (
                  <Select.Option  values={e.key} key={e.key} data={e}>
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
              disabled={Boolean(!dataFromCountry?.data) && !filters[dataIndex]?.city?.label}
              onSelect={(e, option) => { 
                setSelectedKeys(option ? [...selectedKeys,option] : [])
              }} 
              placeholder="City"
              {...data.city}
              // defaultValue={filters[dataIndex]?.city?.label}
            >
              {dataFromCountry?.data?.map((e) => {
                return (
                  <Select.Option key={e.key} values={e.key} data={e}>
                    {e.label}
                  </Select.Option>
                );
              })}
            </Select>
          
          </> : <></>} 
        </div>
      )
    },
    filterIcon: (filtered) => {
      if (dataIndex === "dob") {
        dataIndex = "yob";
      } 
      let color = filters?.[dataIndex] ? "#1890ff" : "#ddd";
      return (
        <SearchOutlined
          style={{
            // color: filters?.[dataIndex] ? "#1890ff" : undefined,
            color: color,
          }}
        />
      );
    },
  });
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
  const forMap = (tag) => {  
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleCloseTag(tag);
        }}
      >
        {tag.name}{':'} {tag.value}
      </Tag>
    );
    return (
      <span
        key={tag.filter}
        style={{
          display: 'inline-block',
        }}
      >
        {tagElem}
      </span>
    );
  }; 
  const tagChild = convertFilter?.map(forMap);
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
          <div
            className="wrapper-tag-filter"
            style={{ width: "100%", overflowX: "scroll", display: "flex" }}
          > 
            {tagChild}
          </div>
          <Table
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
          />
        </Content>
      </Layout>
    </Layout>
  );
}
