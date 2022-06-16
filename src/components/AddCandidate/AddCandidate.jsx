import {
  Breadcrumb,
  Button,
  Col, 
  Form,
  Input,
  Radio,
  Row,
  Select, 
  Spin,
  Steps,
} from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import "./AddCandidate.css";
import { Link } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getLocationFromCity, getLocationFromCountry, getNationality, getValueFlag } from "../../core/candidate";
import { useQuery } from "react-query";
const { Step } = Steps;

const day = () => {
  let arr = [];
  for (let index = 1; index <= 31; index++) {
    arr.push(index);
  }
  return arr;
};
const year = () => {
  const d = new Date();
  let arr = [];
  for (let index = 1960; index <= d.getFullYear(); index++) {
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

export default function AddCandidate(props) {
  const [current, setCurrent] = useState(0);
  const [country, setCountry]= useState();
  const [city, setCity]= useState();
  // const [form] = Form.useForm();

  const {data: listCountries} = useQuery(
    "repoData",
    () => getValueFlag()
  );
  const {data: listNationality} = useQuery(
    "repoNationality",
    () => getNationality()
  );
  console.log(listNationality);
  const {data: dataFromCountry, refetch: countryRefetch} = useQuery(
    ["locationFromCountry",country],
    () => getLocationFromCountry(country),{enabled: Boolean(country)}
  );
  const {data: dataFromCity, refetch: cityRefetch} = useQuery(
    ["locationFromCity",city],
    () => getLocationFromCity(city),{enabled: Boolean(city)}
  );

  let listCountry = listCountries?.data || []; 
  const onChange = (value) => {
    setCurrent(value);
  };
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  const onChangeCountryAddress = (e)=>{ 
    setCountry(e) ;  
  } 
  const onChangeCityAddress = (e)=>{ 
    setCity(e) ;  
  } 
  if (true) {
    return (
      <Layout>
        <Layout style={{ padding: "12px 24px 0 24px ", minHeight: "1000px" }}>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/candidates">Candidates List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">Create Candidate</Breadcrumb.Item>
          </Breadcrumb>
          <strong style={{ fontWeight: 600, fontSize: 24, paddingBlock: 10 }}>
            Create Candidate
          </strong>
          <Steps current={current} onChange={onChange}>
            <Step title="Personal Information" />
            <Step title="Skills and Industry" />
            <Step title="Education and Certificate" />
            <Step title="Working History" />
            <Step title="Remunertion and Rewards" />
            <Step title="Finish" />
          </Steps>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              paddingTop: 12,
              margin: 0,
              marginTop: 20,
              minHeight: 280,
              backgroundColor: "white",
            }}
          >
            <div className="title-add-candidate">PERSONAL INFORMATION</div>
            <Form
              name="basic"
              layout="vertical"
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              initialValues={{ emails: [""], phones: [""], address: [""] }}
              autoComplete="off"
              onFinish={onFinish}
            >
              <Row className="wrapper-name-add-candidate">
                {/* Fullname */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">
                      First Name<span style={{ color: "red" }}>*</span>:
                    </div>
                    <Form.Item required name="firstName" rules={[ 
                                  {
                                    required: true,
                                    message: "Please input First Name!",
                                  },
                                ]}>
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Please Input First Name"
                      />
                    </Form.Item>
                  </div>
                </Col>
                {/* Lastname */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">
                      Last Name<span style={{ color: "red" }}>*</span>:
                    </div>
                    <Form.Item 
                      style={{ width: "100%" }}
                      name="lastName"
                      rules={[ 
                        {
                          required: true,
                          message: "Please input Last Name!",
                        },
                      ]}
                    >
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Please Input Last Name"
                      />
                    </Form.Item>
                  </div>
                </Col>
                {/* Middle name */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">
                      First Name<span style={{ color: "red" }}>*</span>:
                    </div>

                    <Form.Item rules={[ 
                        {
                          required: true,
                          message: "Please input Middle Name!",
                        },
                      ]} name="middleName">
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Please Input Middle Name"
                      />
                    </Form.Item>
                  </div>
                </Col>
                {/* Primary status */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Primary status:</div>
                    <Form.Item required name="primaryStatus">
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Please select primary status"
                        optionFilterProp="children"
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="Active">Active</Select.Option>
                        <Select.Option value="Off-limit">
                          Off-limit
                        </Select.Option>
                        <Select.Option value="Blacklist">
                          Blacklist
                        </Select.Option>
                        <Select.Option value="Inactive">Inactive</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                {/* Birthday */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Birthday:</div> 
                      <Row>
                        <Col span={8} style={{ paddingRight: 10 }}>
                          <Form.Item name="date">
                            <Select
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Date"
                              optionFilterProp="children"
                              // onChange={onChange}
                              // onSearch={onSearch}
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {day().map(function (x, i) {
                                return (
                                  <Select.Option key={i} value={x}>
                                    {x}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8} style={{ paddingInline: 5 }}>
                          <Form.Item name="month">
                            <Select
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Month"
                              optionFilterProp="children"
                              // onChange={onChange}
                              // onSearch={onSearch}
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {month.map(function (x, i) {
                                return (
                                  <Select.Option key={i} value={x}>
                                    {x}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8} style={{ paddingLeft: 10 }}>
                          <Form.Item name="year">
                            <Select
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Year"
                              optionFilterProp="children"
                              // onChange={onChange}
                              // onSearch={onSearch}
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {year().map(function (x, i) {
                                return (
                                  <Select.Option key={i} value={x}>
                                    {x}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row> 
                  </div>
                </Col>
                {/* Space */}
                <Col span={12}>
                </Col>
                {/* Gender */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Gender:</div>
                    <Form.Item required name="gender">
                      <Radio.Group onChange={onChange}>
                        <Radio value={"male"}>Male</Radio>
                        <Radio value={"female"}>Female</Radio>
                        <Radio value={"complecated"}>Complicated</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
                {/* Marital Status */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Marital Status:</div>
                    <Form.Item required name="maritalStatus">
                      <Radio.Group onChange={onChange}>
                        <Radio value={"yes"}>Yes</Radio>
                        <Radio value={"no"}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
                {/* Ready to move */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Ready to move:</div>

                    <Form.Item required name="readyToMove">
                      <Select
                        style={{ width: "100%", cursor: "pointer" }}
                        defaultValue={"Yes"}
                        optionFilterProp="children"
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="Yes">Yes</Select.Option>
                        <Select.Option value="No">No</Select.Option>
                        <Select.Option value="Available">
                          Available
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                {/* Source */}
                <Col span={12}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Source:</div>
                    <Form.Item required name="firstName">
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Please input source"
                      />
                    </Form.Item>
                  </div>
                </Col>
                {/* Email */}
                <Col span={22}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">
                      Email<span style={{ color: "red" }}>*</span>:
                    </div>
                    <Form.List name="emails">
                      {(emails, { add, remove }) => (
                        <>
                          {emails.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              style={{
                                width: "65%",
                                display: "flex",
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                style={{ flex: 1 }}
                                name={[key, "email"]}
                                rules={[
                                  {
                                    type: "email",
                                    message: "The input is not valid Email!",
                                  },
                                  {
                                    required: true,
                                    message: "Please input Email!",
                                  },
                                ]}
                              >
                                <Input
                                  style={{ width: "100%" }}
                                  placeholder={"ex: email@email.com"}
                                />
                              </Form.Item>
                              {emails.length > 1 ? (
                                <MinusCircleOutlined
                                  style={{ marginLeft: 10, paddingTop: 10 }}
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </div>
                          ))}

                          {emails.length < 5 ? (
                            <Form.Item
                              style={{ width: "60%", textAlign: "end" }}
                            >
                              <Button
                                style={{
                                  width: "70%",
                                  color: "#40a9ff",
                                  borderColor: "#40a9ff",
                                }}
                                type="double"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add field
                              </Button>
                            </Form.Item>
                          ) : null}
                        </>
                      )}
                    </Form.List>
                  </div>
                </Col>
                {/* Number phone */}
                <Col span={22}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">
                      Mobile Phone<span style={{ color: "red" }}>*</span>:
                    </div>
                    <Form.List name="phones">
                      {(phones, { add, remove }) => (
                        <>
                          {phones.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                width: "65%",
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                style={{ flex: 1 }}
                                name={[key, "phones"]} 
                              >
                                <Input.Group
                                  name="phone"
                                  style={{ display: "flex" }}
                                  compact
                                >
                                  <Select
                                    style={{ width: 100 }}
                                    defaultValue="+84"
                                    showSearch
                                  >
                                    {listCountry.map((e, i) => {
                                      return (
                                        <Select.Option
                                          key={i}
                                          value={e?.extra?.dial_code}
                                          maxTagTextLength={10}
                                        >
                                          {e?.extra?.dial_code}
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                  <Input
                                    style={{
                                      flex: 1,
                                    }}
                                    placeholder="ex: 371234567"
                                  />
                                </Input.Group>
                              </Form.Item>
                              {phones.length > 1 ? (
                                <MinusCircleOutlined
                                  style={{ marginLeft: 10, paddingTop: 10 }}
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </div>
                          ))}

                          {phones.length < 5 ? (
                            <Form.Item
                              style={{ width: "60%", textAlign: "end" }}
                            >
                              <Button
                                style={{
                                  width: "70%",
                                  color: "#40a9ff",
                                  borderColor: "#40a9ff",
                                }}
                                type="double"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add field
                              </Button>
                            </Form.Item>
                          ) : null}
                        </>
                      )}
                    </Form.List>
                  </div>
                </Col>
                {/* Address */}
                <Col span={24}>
                  <div style={{ paddingInline: 10 }}>
                    <div className="label-add-candidate">Address:</div>
                    <Form.List name="address">
                      {(address, { add, remove }) => (
                        <>
                          {address.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                style={{ flex: 1 }}
                                name={[key, "address"]} 
                              >
                                <Row>
                                  <Col span={8} style={{ paddingRight: 5 }}>
                                    <Select optionFilterProp='children' placeholder="Country" showSearch onChange={e=>onChangeCountryAddress(e)}>
                                    {listCountry.map((e, i) => {
                                      return (
                                        <Select.Option
                                          key={i}
                                          children={e?.label}
                                          value={e?.key}
                                          maxTagTextLength={10}
                                        >
                                          {e?.label}
                                        </Select.Option>
                                      );
                                    })}
                                    </Select>
                                  </Col>
                                  <Col span={8} style={{ paddingInline: 10 }}>
                                    <Select optionFilterProp='children' disabled={!dataFromCountry?.data.length > 0} placeholder="City" showSearch onChange={e=>onChangeCityAddress(e)}>
                                      {dataFromCountry?.data?.map((e, i) => {
                                        return (
                                          <Select.Option
                                            key={i}
                                            children={e?.label}
                                            value={e?.key}
                                            maxTagTextLength={10}
                                          >
                                            {e?.label}
                                          </Select.Option>
                                        );
                                      })}
                                    </Select>
                                  </Col>
                                  <Col span={8} style={{ paddingLeft: 5 }}>
                                    <Select disabled={!dataFromCity?.data.length > 0} defaultValue="District" showSearch>
                                      {dataFromCity?.data.map((e, i) => {
                                        return (
                                          <Select.Option
                                            key={i}
                                            value={e?.label}
                                            maxTagTextLength={10}
                                          >
                                            {e?.label}
                                          </Select.Option>
                                        );
                                      })}
                                    </Select>
                                  </Col>
                                  <Input
                                    style={{
                                      marginTop: 20,
                                    }}
                                    placeholder="ex: 371234567"
                                  />
                                </Row>
                              </Form.Item>
                              {address.length > 1 ? (
                                <MinusCircleOutlined
                                  style={{ marginLeft: 10, paddingTop: 10 }}
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </div>
                          ))}

                          {address.length < 5 ? (
                            <Form.Item style={{ textAlign: "center" }}>
                              <Button
                                style={{
                                  width: "50%",
                                  color: "#40a9ff",
                                  borderColor: "#40a9ff",
                                }}
                                type="double"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add field
                              </Button>
                            </Form.Item>
                          ) : null}
                        </>
                      )}
                    </Form.List>
                  </div>
                </Col>
              </Row>
              <Form.Item label=" " colon={false}>
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
}
