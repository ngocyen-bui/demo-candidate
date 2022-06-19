import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select, 
  Steps,
} from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import "./AddCandidate.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getCandidate,
  getLocationFromCity,
  getLocationFromCountry,
  getNationality,
  getPosition,
  getValueFlag,
} from "../../core/candidate";
import { useQuery } from "react-query"; 
import TextArea from "antd/lib/input/TextArea";
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

  const params = useParams();
  const [current, setCurrent] = useState(0);
  const [country, setCountry] = useState();
  const navigate = useNavigate();
  const [city, setCity] = useState();
  const [checkInfo, setCheckInfo]= useState();
  const [value, setValue] = useState(); 
   
  const [disabled, setDisabled] = useState(() => {
    if (Boolean(localStorage.getItem('personal-infomation'))) return true;
    return false;
  });

  
  const [prevData, setPrevData] = useState() 
  const { data: listCountries } = useQuery("repoData", () => getValueFlag());
  const { data: listNationality } = useQuery("repoNationality", () =>
    getNationality()
  ); 
  
  const { data: listPosition } = useQuery(
    "position", () => getPosition(),
  );
  const { data: dataFromCountry} = useQuery(
    ["locationFromCountry", country],
    () => getLocationFromCountry(country),
    { enabled: Boolean(country) }
  );
  const { data: dataFromCity} = useQuery(
    ["locationFromCity", city],
    () => getLocationFromCity(city),
    { enabled: Boolean(city) }
  ); 
 
useEffect(()=>{
  if(params.id){
     getCandidate(params.id).then(dataCandidate =>{
      const x =({
        address:  dataCandidate?.addresses,
        date: null,
        directReports: 2,
        emails: dataCandidate?.emails?.map((e,i) =>({key: i,email: e})) || [],
        firstName: dataCandidate?.first_name,
        gender: dataCandidate?.gender,
        lastName: dataCandidate?.last_name,
        maritalStatus: null,
        middleName: dataCandidate?.middle_name,
        month: null,
        nationality: dataCandidate?.nationality,
        phones: dataCandidate?.phones?.map((e,i) =>({key: i, phone: e.number}))|| [],
        positionApplied: 544,
        primaryStatus: null,
        source: null,
        year: null,
        yearOfManagement: dataCandidate?.management_years,
        yearOfServices: 1, 
      }); 
      setPrevData(x)
    });
  }else{
    setPrevData(JSON.parse(localStorage.getItem('personal-infomation')))
  }
},[params.id]) 

useEffect(()=>{
  if(params.id)setDisabled(false);
},[params.id])

const onChange = (value) => {
  setCurrent(value);
};
const onFinish = (values) => {
  countDown();
  if (values && !params?.id) {
    localStorage.setItem('personal-infomation', JSON.stringify(values))
    setDisabled(true);
  }
};
const onValuesChange = (values) => {
  setValue(values);
};
const onChangeCountryAddress = (e) => {
  setCountry(e);
};
const onChangeCityAddress = (e) => {
  setCity(e);
};

const countDown = () => {
  let secondsToGo = 2;
  let mess = '';
  if(params?.id){
    mess = 'Updated success'
  }else{
    mess='Created success'
  }
  const modal = Modal.success({
    title: mess,
    content: `This modal will be destroyed after ${secondsToGo} second.`,
  });

  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `This modal will be destroyed after ${secondsToGo} second.`,
    });
  }, 1000);

setTimeout(() => {
    clearInterval(timer);
    modal.destroy(); 
    navigate("/candidates");
    // localStorage.removeItem('personal-infomation')
  }, secondsToGo * 1000); 
};   
useEffect(()=>{
  if(prevData || !params.id) setCheckInfo(true) 
},[prevData,params.id])
if(checkInfo) return (
  <Layout>
    <Layout
      style={{ padding: "12px 24px 100px 24px ", minHeight: "1000px" }}
    >
      <Breadcrumb separator="/">
        <Breadcrumb.Item>
          <Link to="/candidates">Candidates List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Detail Candidate</Breadcrumb.Item>
      </Breadcrumb>

      {params?.id?  <Layout style={{padding: '10px 20px', background: '#fff', marginTop: 20, }}>
        <h4 style={{ fontSize: 16, color: '#465f7b', fontWeight: 600}}> Overview</h4>
        <TextArea placeholder="Overview" rows={4} />
      </Layout>:
      <> 
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
      </>}
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
          initialValues={{ emails: [...prevData?.emails || ['']], phones: [...prevData?.phones || [""]], address: [...prevData?.address || [""]] }}
          autoComplete="off"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Row className="wrapper-name-add-candidate">
            {/* First */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">
                  First Name<span style={{ color: "red" }}>*</span>:
                </div>
                <Form.Item
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input First Name!",
                    },
                  ]}
                >
                  <Input
                    disabled={disabled}
                    style={{ width: "100%" }}
                    placeholder="Please Input First Name"
                    defaultValue={prevData?.firstName|| null}
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
                    disabled={disabled}
                    style={{ width: "100%" }}
                    placeholder="Please Input Last Name"
                    defaultValue={prevData?.lastName || null}
                  />
                </Form.Item>
              </div>
            </Col>
            {/* Middle name */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">
                  Middle Name:
                </div>

                <Form.Item 
                  name="middleName"
                >
                  <Input
                    disabled={disabled}
                    style={{ width: "100%" }}
                    placeholder="Please Input Middle Name"
                    defaultValue={prevData?.middleName || null}
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
                    disabled={disabled}
                    style={{ width: "100%" }}
                    placeholder="Please select primary status"
                    optionFilterProp="children"
                    defaultValue={prevData?.primaryStatus || null}
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
                        disabled={disabled}
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Date"
                        optionFilterProp="children"
                        defaultValue={prevData?.date || null}
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
                        disabled={disabled}
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Month"
                        optionFilterProp="children"
                        defaultValue={prevData?.month || null}
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
                        disabled={disabled}
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Year"
                        optionFilterProp="children"
                        defaultValue={prevData?.year || null}
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
            <Col span={12}></Col>
            {/* Gender */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Gender:</div>
                <Form.Item required name="gender">
                  <Radio.Group onChange={onChange} disabled={disabled}
                    defaultValue={prevData?.gender || null}>
                    <Radio value={1}>Male</Radio>
                    <Radio value={2}>Female</Radio>
                    <Radio value={3}>Complicated</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>
            {/* Marital Status */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Marital Status:</div>
                <Form.Item required name="maritalStatus">
                  <Radio.Group onChange={onChange} disabled={disabled} defaultValue={prevData?.maritalStatus || null}>
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
                    disabled={disabled}
                    style={{ width: "100%", cursor: "pointer" }}
                    optionFilterProp="children"
                    defaultValue={prevData?.readyToMove || "Yes"}
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
                <Form.Item required name="source">
                  <Input
                    defaultValue={prevData?.source || null}
                    disabled={disabled}
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
                              defaultValue={prevData?.emails[key]?.email || null}
                              disabled={disabled}
                              style={{ width: "100%" }}
                              placeholder={"ex: email@email.com"}
                            />
                          </Form.Item>
                          {emails.length > 1 ? (
                            <MinusCircleOutlined
                              disabled={disabled}
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
                            disabled={disabled}
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
                          <Input.Group style={{ display: "flex" }} compact>
                            <Form.Item
                              {...restField}
                              name={[key, "country-code"]}
                            >
                              <Select
                                disabled={disabled}
                                style={{ width: 100 }}
                                defaultValue="+84"
                                showSearch
                              >
                                {listCountries?.data.map((e, i) => {
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
                            </Form.Item>
                            <Form.Item
                              name={[key, "phone"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your number phone!",
                                },
                              ]}
                              style={{
                                flex: 1,
                                width: "100%",
                              }}
                            >
                              <Input
                                defaultValue={prevData?.phones[key]?.phone || null}
                                disabled={disabled}
                                placeholder="ex: 371234567"
                              />
                            </Form.Item>
                          </Input.Group>
                          {phones.length > 1 ? (
                            <MinusCircleOutlined
                              disabled={disabled}
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
                            disabled={disabled}
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
                <Form.List name={"address"}>
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
                          <Row style={{ flex: 1 }}>
                            <Col span={8} style={{ paddingRight: 5 }}>
                              <Form.Item name={[key, "country"]}>
                                <Select
                                  disabled={disabled}
                                  optionFilterProp="children"
                                  placeholder="Country"
                                  showSearch
                                  onChange={(e) =>
                                    onChangeCountryAddress(e)
                                  }
                                >
                                  {listCountries?.data.map((e, i) => {
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
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ paddingInline: 10 }}>
                              <Form.Item name={[key, "city"]}>
                                <Select
                                  optionFilterProp="children"
                                  disabled={
                                    !dataFromCountry?.data.length > 0 ||
                                    disabled
                                  }
                                  placeholder="City"
                                  showSearch
                                  onChange={(e) => onChangeCityAddress(e)}
                                >
                                  {dataFromCountry?.data?.map((e, i) => {
                                    return (
                                      <Select.Option
                                        disabled={disabled}
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
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ paddingLeft: 5 }}>
                              <Form.Item name={[key, "district"]}>
                                <Select
                                  disabled={
                                    !dataFromCity?.data.length > 0 ||
                                    disabled
                                  }
                                  defaultValue="District"
                                  showSearch
                                >
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
                              </Form.Item>
                            </Col>
                            <Form.Item
                            style={{width: '100%'}}
                              name={[key, "street"]}>
                              <Input
                                disabled={disabled}
                                style={{
                                  width: '100%',
                                  marginTop: 20,
                                }}
                                placeholder="ex: 371234567"
                              />
                            </Form.Item>
                          </Row>
                          {address.length > 1 ? (
                            <MinusCircleOutlined
                              twoToneColor={"red"}
                              style={{
                                marginLeft: 10,
                                paddingTop: 10,
                                color: "white",
                              }}
                              onClick={() => (disabled ? remove(name) : "")}
                            />
                          ) : null}
                        </div>
                      ))}

                      {address.length < 5 ? (
                        <Form.Item style={{ textAlign: "center" }}>
                          <Button
                            disabled={disabled}
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
            {/* Nationality */}
            <Col span={24}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Nationality :</div>
                <Form.Item required name="nationality">
                  <Select
                    defaultValue={prevData?.nationality || null}
                    disabled={disabled}
                    optionFilterProp="children"
                    placeholder="Please choose a nationality"
                    showSearch
                    onChange={(e) => onChangeCountryAddress(e)}
                  >
                    {listNationality?.data?.map((e, i) => {
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
                </Form.Item>
              </div>
            </Col>
            {/* Position Applied  */}
            <Col span={24}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Position Applied  :</div>
                <Form.Item required name="positionApplied">
                  <Select
                    defaultValue={prevData?.positionApplied || null}
                    disabled={disabled}
                    optionFilterProp="children"
                    placeholder="Select or add your position applied"
                    showSearch
                    onChange={(e) => onChangeCountryAddress(e)}
                  >
                    {listPosition?.data?.map((e, i) => {
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
                </Form.Item>
              </div>
            </Col>
            {/* Industry Year of Services */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">
                  Industry Year of Services:
                </div>
                <Form.Item name="yearOfServices">
                  <InputNumber
                    defaultValue={prevData?.yearOfServices || null}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    min={1}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
            {/* Year of Management */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">
                  Year of Management:
                </div>
                <Form.Item name="yearOfManagement">
                  <InputNumber
                    defaultValue={prevData?.yearOfManagement || null}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    min={1}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
            {/* No. of Direct Reports */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">
                  No. of Direct Reports:
                </div>
                <Form.Item name="directReports">
                  <InputNumber
                    defaultValue={prevData?.directReports || null}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    min={1}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          {(!value && !disabled) ? (
            ""
          ) : (
            <Form.Item label=" " colon={false}>
              <Button 
                type="primary"
                onClick={()=> localStorage.removeItem('personal-infomation')}
              >
                Reset
              </Button>
              <Button
                style={{ float: "right", marginRight: 40 }}
                type="primary"
                htmlType="submit"
              >
                Create and Next
              </Button>
            </Form.Item>
          )}
        </Form>
      </Content>
    </Layout>
  </Layout>
); 
}
