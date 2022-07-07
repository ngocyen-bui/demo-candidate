import { DeleteOutlined } from "@ant-design/icons"; 
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Form, 
  InputNumber, 
  Row,
  Select,
  Table,
} from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import { useQuery } from "react-query"; 
import { Link } from "react-router-dom";
import {
  getDefaultProp,
  getLocationFromCountry,
  getPosition,
  getValueFlag,
} from "../../features/candidate";
import { getAllClients } from "../../features/client";
import {
  getAllCategory,
  getCategoryType,
  getDepartment,
} from "../../features/job";
import { getAllUsers } from "../../features/user";
import { useAuth } from "../../hooks/useAuth"; 
import { listLevel, listType } from "../../utils/job";

function StarRequireComponent() {
  return <span style={{ color: "red" }}>*</span>;
}
const day = () => {
  let arr = [];
  for (let index = 1; index <= 31; index++) {
    arr.push(index);
  }
  return arr;
};
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const year = () => {
  const d = new Date();
  let arr = [];
  for (let index = 1960; index <= d.getFullYear(); index++) {
    arr.push(index);
  }
  return arr;
};
export default function AddJob(props) {
  const { user: auth } = useAuth();
  const token = auth?.token;
  const [form] = Form.useForm();

  const [keyPosition, setKeyPosition] = useState("");
  const [keyDepartment, setKeyDepartment] = useState("");
  const [dataTitle, setDataTitle] = useState([]);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [keyCountry, setKeyCountry] = useState("");
  const [sector, setSector] = useState();
  const [category, setCategory] = useState();
  const [isShowBtnIndustry, setIsShowBtnIndustry] = useState(false);
  const [listIndustry, setListIndustry] = useState([])

  const [extraListIndustry, setExtraListIndustry] = useState({})

  const { data: listDefaultProp } = useQuery(
    ["defaultPropsJobs", token],
    async () => await getDefaultProp(token)
  );
  const { data: listPosition } = useQuery(
    ["positionJobs", keyPosition, token],
    () => getPosition(keyPosition, token),
    { enabled: Boolean(keyPosition) }
  );
  const { data: listDepartment } = useQuery(
    ["departmentJobs", keyDepartment, token],
    () => getDepartment(keyDepartment, token),
    { enabled: Boolean(keyDepartment) }
  );
  const { data: listAllClients } = useQuery(
    ["listAllClientsJobs", token],
    async () => await getAllClients(token)
  );
  const { data: listALlUsers } = useQuery(
    ["listAllUsersJobs", token],
    async () => await getAllUsers(token)
  );
  const { data: listCategoryByType } = useQuery(
    ["listCategoryByType", token],
    async () => await getCategoryType(token)
  );
  const { data: listAllCategory } = useQuery(
    ["lisAllCategory", token],
    async () => await getAllCategory(token)
  );
  const { data: listCountry } = useQuery(
    ["listCountry", token],
    async () => await getValueFlag(token)
  );
  const { data: dataFromCountry } = useQuery(
    ["listCity", keyCountry, token],
    () => getLocationFromCountry(keyCountry, token),
    { enabled: Boolean(keyCountry) }
  );
  const handleSelectCountry = (e, o) => {
      let objLocation = form.getFieldValue()?.location;
      delete objLocation['city']
      form.setFieldsValue({
        //    ...form.getFieldValue(),
          location: {
              ...objLocation
          }
        });
    setKeyCountry(e);
  };
  useEffect(() => {
    if (Boolean(keyPosition) && listPosition) {
      setDataTitle(listPosition?.data);
    } else {
      setDataTitle(
        listDefaultProp?.filter((e) => e.name === "position")[0].values
      );
    }
  }, [keyPosition, listPosition, listDefaultProp]);

  useEffect(() => {
    if (Boolean(keyDepartment) && listDepartment) {
      setDataDepartment(listDepartment?.data);
    } else {
      setDataDepartment(
        listDefaultProp?.filter((e) => e.name === "department")[0].values
      );
    }
  }, [keyDepartment, listDepartment, listDefaultProp]);

  const handleSearchTitle = (e) => {
    setKeyPosition(e);
  };
  const handleSearchDepartment = (e) => {
    setKeyDepartment(e);
  };
  const onChangeIndustry = (e,record) => {
    console.log(record);
    const arr = listCategoryByType?.data?.filter((res) => res.key === e);
    setSector(arr[0]?.sub_categories);

    //Clear value in sector and category
    const listData = form.getFieldValue()?.business_line;
    delete listData['sector'];
    delete listData['category'];
    form.setFieldsValue({
        business_line: {
            ...listData
        }
    })
    setExtraListIndustry({
        industry: record.data
    })
    setIsShowBtnIndustry(true);
  };
  const onChangeSector = (e) => {
    const arr = listAllCategory?.data?.filter(
      (res) => res?.parent_categories?.key === e
    );
    setCategory(arr);

    //Clear value in category
    const listData = form.getFieldValue()?.business_line; 
    delete listData['category'];
    form.setFieldsValue({
        business_line: {
            ...listData
        }
    })
  };
  const saveDataIndustry = ()=>{
    const listData = form.getFieldValue()?.business_line;
    setListIndustry([
        ...listIndustry,
        listData])
  }
//   console.log(listIndustry);
  const resetForm = ()=>{  
    form.setFieldsValue({
        business_line:{
            industry: null,
            sector: null,
            category: null
        }
    })    
    setIsShowBtnIndustry(false);
}
  const onFinish = (e) => {
    console.log(e);
  };
  const columns = [
    {
        title: 'Primary',
        dataIndex: 'primary',
        key: 'primary',
        render: (text,record) => {   
            return <Checkbox  defaultChecked={text===1} ></Checkbox> 
        },
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
      render: (text) =><div>{text?.label}</div>,
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      render: (text) =><div>{text?.label}</div>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) =><div>{text?.label}</div>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record)=> <DeleteOutlined  style={{color: 'red',cursor: 'pointer'}}/>
    },
  ]; 
  return (
    <Layout>
      <Layout style={{ padding: "12px 24px 100px 24px " }}>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/candidates">Jobs List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">Create Job</Breadcrumb.Item>
        </Breadcrumb>
        <strong style={{ fontWeight: 600, fontSize: 24, paddingBlock: 10 }}>
          Create Job
        </strong>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            paddingTop: 12,
            margin: 0,
            backgroundColor: "white",
          }}
        >
          <Form
            form={form}
            style={{ paddingBlock: "20px" }}
            name="create-job"
            //  initialValues={{ remember: true }}
            onFinish={onFinish}
            //  onFinishFailed={onFinishFailed}
            // autoComplete="off"
          >
            <Row gutter={16}>
              {/* {Title} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label htmlFor="title-add-job">
                  Title <StarRequireComponent />:{" "}
                </label>
                <div className="form-item-value-add-job">
                  <Form.Item
                    name="title"
                    rules={[
                      { required: true, message: "Please select your title!" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%", height: "35px" }}
                      showSearch
                      onSearch={handleSearchTitle}
                      filterOption={false}
                      placeholder="Add or select title"
                      // onSelect={handleSelect}
                    >
                      {dataTitle?.map((e) => {
                        return (
                          <Select.Option
                            key={e.id || e.key}
                            data={e}
                            value={e.key}
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.label || e.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* {Department} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Department <StarRequireComponent />:{" "}
                </label>
                <div className="form-item-value-add-job">
                  <Form.Item
                    name="department"
                    rules={[
                      {
                        required: true,
                        message: "Please select your department!",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%", height: "35px" }}
                      showSearch
                        onSearch={handleSearchDepartment}
                      filterOption={false}
                      placeholder="Add or select department"
                      // onSelect={handleSelect}
                    >
                      {dataDepartment?.map((e) => {
                        return (
                          <Select.Option
                            key={e.id || e.key}
                            data={e}
                            value={e.key}
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.label || e.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* {Quantity} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Quantity <StarRequireComponent />:{" "}
                </label>
                <div className="form-item-value-add-job">
                  <Form.Item name="quantity" rules={[
                      { required: true, message: "Please enter quantity" },
                    ]}>
                    <InputNumber
                      placeholder="Please enter quantity"
                      min={0}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </Col>
              {/* {Type} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Type <StarRequireComponent />:{" "}
                </label>
                <div className="form-item-value-add-job">
                  <Form.Item name="type"
                  rules={[
                    { required: true, message: "Please select type" },
                  ]}
                  >
                    <Select
                      style={{ width: "100%", height: "35px" }}
                      showSearch
                      filterOption={(input, option) => option.children.includes(input)}
                      placeholder="Please select type"
                      // onSelect={handleSelect}
                    >
                      {listType?.map((e) => {
                        return (
                          <Select.Option
                            key={e.id}
                            data={e}
                            value={e.id}
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* {Experience Level} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Experience Level <StarRequireComponent />:{" "}
                </label>
                <div className="form-item-value-add-job">
                  <Form.Item name="experience_level"
                  rules={[
                    { required: true, message: "Please select experience level" },
                  ]}
                  >
                    <Select
                      style={{ width: "100%", height: "35px" }}
                      showSearch
                      onSearch={handleSearchTitle}
                      filterOption={(input, option) => option.children.includes(input)}
                      placeholder="Please select experience level"
                      // onSelect={handleSelect}
                    >
                      {listLevel?.map((e) => {
                        return (
                          <Select.Option
                            key={e.id}
                            data={e}
                            value={e.id}
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* {Client's Name} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Client's Name <StarRequireComponent />:{" "}
                </label>
                <div className="form-item-value-add-job">
                  <Form.Item name="client_id"
                   rules={[
                    { required: true, message: "Please select client name" },
                  ]}
                  >
                    <Select
                      style={{ width: "100%", height: "35px" }}
                      showSearch 
                      filterOption={(input, option) => option.children.includes(input)}
                      placeholder="Add or select department"
                      // onSelect={handleSelect}
                    >
                      {listAllClients?.data?.map((e) => {
                        return (
                          <Select.Option
                            key={e.id || e.key}
                            data={e}
                            value={e.key}
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.label || e.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {/* {Opening date} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Opening Date:
                </label>
                <div className="form-item-value-add-job">
                <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          style={{ width: "100%" }}
                          name={["target_date", "date"]}
                        >
                          <Select
                            showSearch
                            placeholder="Date"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {day()?.map((e, i) => {
                              return (
                                <Select.Option key={i} value={i}>
                                  {e}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          style={{ width: "100%" }}
                          name={["target_date", "month"]}
                        >
                          <Select
                            showSearch
                            placeholder="Month"
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {month?.map((e, i) => {
                              return (
                                <Select.Option key={i} value={i}>
                                  {e}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          style={{ width: "100%" }}
                          name={["target_date", "year"]}
                        >
                          <Select
                            showSearch
                            placeholder="Year"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          >
                            {year().map((e, i) => {
                              return (
                                <Select.Option key={i} value={i + 1}>
                                  {e}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                </div>
              </Col>
              {/* {Location} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Location:
                </label>
                <div className="form-item-value-add-job">
                <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={["location", "country"]}
                          style={{ width: "100%" }}
                        >
                          <Select 
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            showSearch
                            placeholder="Country"
                            onSelect={handleSelectCountry}
                          >
                            {listCountry?.data?.map((e) => {
                              return (
                                <Select.Option 
                                  data={e}
                                  key={e.key}
                                >
                                  {e.label}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={["location", "city"]} 
                        >
                          <Select
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            showSearch
                            placeholder="City"
                            // onSelect={handleSelect}
                          >
                            {dataFromCountry?.data?.map((e) => {
                              return (
                                <Select.Option 
                                  data={e}
                                  key={e.key}
                                >
                                  {e.label}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                </div>
              </Col>
              {/* {Search Consultant} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Search Consultant <StarRequireComponent />:{" "}
                </label>
                <Form.Item name="recruiters"
                 rules={[
                    { required: true, message: "Please select search consultant" },
                  ]}
                >
                  <Select
                    style={{ width: "100%", height: "35px" }}
                    showSearch 
                    filterOption={(input, option) => option.children.includes(input)}
                    placeholder="Add or select department"
                    // onSelect={handleSelect}
                  >
                    {listALlUsers?.data?.map((e) => {
                      return (
                        <Select.Option
                          key={e.id || e.key}
                          data={e}
                          value={e.key}
                          style={{ textTransform: "capitalize" }}
                        >
                          {e.full_name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              {/* {Mapping by} */}
              <Col className="col-custom-add-job gutter-row" span={12}>
                <label>
                  Mapping by:
                </label>
                <Form.Item name="related_users">
                  <Select
                    mode="multiple"
                    style={{ width: "100%", height: "35px" }}
                    showSearch 
                    filterOption={(input, option) => option.children.includes(input)}
                    placeholder="Add or select department"
                    // onSelect={handleSelect}
                  >
                    {listALlUsers?.data?.map((e) => {
                      return (
                        <Select.Option
                          key={e.id || e.key}
                          data={e}
                          value={e.key}
                          style={{ textTransform: "capitalize" }}
                        >
                          {e.full_name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              {/* {Industry} */}
              <Col className="col-custom-add-job gutter-row" span={24}>
                <label>
                  Industry <StarRequireComponent />:{" "}
                </label>
                <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        style={{ width: "100%" }}
                        name={["business_line", "industry"]}
                      >
                        <Select
                          showSearch
                          placeholder="Select your industry"
                          optionFilterProp="children"
                          onChange={(e,record) => {onChangeIndustry(e,record)}} 
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {listCategoryByType?.data?.map((e) => {
                            return (
                              <Select.Option key={e.key} data={e} value={e.key}>
                                {e.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col> 
                    <Col span={8}>
                      <Form.Item
                        style={{ width: "100%" }}
                        name={["business_line", "sector"]}
                      >
                        <Select
                          disabled={!Boolean(sector)}
                          showSearch
                          placeholder="Select your sector"
                          onChange={onChangeSector} 
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {sector?.map((e) => {
                            return (
                              <Select.Option key={e.key} data={e} value={e.key}>
                                {e.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col> 
                    <Col span={8}>
                      <Form.Item
                        style={{ width: "100%" }}
                        name={["business_line", "category"]}
                      >
                        <Select
                          disabled={!Boolean(category)}
                          showSearch
                          placeholder="Select your category"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {category?.map((e) => {
                            return (
                              <Select.Option key={e.key} data={e} value={e.key}>
                                {e.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  {isShowBtnIndustry?<div style={{float: "right", marginTop: '10px'}}> 
                    <Button  style={{marginRight: '10px', color: 'red', borderColor: 'red'}} onClick={resetForm}>Cancel</Button>
                    <Button type="primary" onClick={saveDataIndustry}>Save Industry</Button>
                </div> :<></>}
                
                <Table  
                    // rowKey={obj => [obj.industry.id, obj?.sector?.name, obj?.category?.id]}
                    style={{ padding: '24px 0'}}
                    columns={columns}
                    // dataSource={dataJob}
                />
              </Col>
            </Row> 
            <Form.Item style={{ float: "right" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
}