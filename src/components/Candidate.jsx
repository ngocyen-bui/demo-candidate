import { 
  CheckCircleTwoTone, 
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber, 
  Modal,
  Radio,
  Row,
  Select, 
} from "antd";
import { Content } from "antd/lib/layout/layout";
import { memo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {    
  getCandidate,
  getDegree,
  getLocationFromCity,
  getLocationFromCountry,
  getNationality,
  getPosition,
  getValueFlag, 
} from "../features/candidate";
import { useAuth } from "../hooks/useAuth";
import {  fetchCreateCandidate, fetchUpdateCandidate } from "../redux/reducer";
const day = () => {
  let arr = [];
  for (let index = 1; index <= 31; index++) {
    if (index < 10) {
      arr.push("0" + index);
    } else {
      arr.push(index);
    }
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
const cv = (x) => {
  if (x.toString().length < 2) {
    return "0" + x;
  }
  return x;
};
const result = (obj) => { 
  let listPhone = obj?.phones?.map((e) => {
    let key = e?.countryCode || "+84";
    return {
      number: Number(e?.phone),
      current: -1,
      phone_code: {
        key: Number(key.slice(1)),
      },
    };
  }); 

  let positionApplied = [];
  if(obj?.nationality){
    positionApplied = obj?.positionApplied?.map((n) => {
      if(typeof(n) === 'object') {
        return n
      }
      return {key: n}
    })
  } 
  let nation = [];
  if(obj?.nationality){
    nation = obj?.nationality?.map((n) => {
      if(typeof(n) === 'object') {
        return n
      }
      return {key: n}
    })
  }
 
  let highest_education = {key: obj?.highest_education} 
  if(typeof(obj?.highest_education) === 'object'){
    highest_education = obj?.highest_education
  } 

  let addressModify = [];  
  if(obj){ 
    let temp = obj?.addresses?.filter(e => Boolean(e.country));
    addressModify = temp.map((n) => {
      let city = {};
      let district = {};
      if(typeof(n.country) === 'object') {
        return n
      }
      if(n.city) city = {city: {key:n.city}};
      if(n.district) district = {district: {key:n.district}};

      return {country: {key:n.country}, ...city ,...district}
    })
  }


  let result =  {
    nationality: [...nation],
    middle_name: obj?.middleName,
    highest_education: highest_education,
    dob:
      (obj?.year ? obj?.year + "-" : "") +
      (obj?.month ? cv(obj?.month) + "-" : "") +
      (obj?.date ? cv(obj?.date) : ""),
    full_name:
      (obj?.firstName ? obj?.firstName + " " : "") +
      (obj?.month ? obj?.month + " " : "") +
      (obj?.lastName ? obj?.lastName : ""),
    relocating_willingness: obj?.readyToMove,
    first_name: obj?.firstName,
    last_name: obj?.lastName,
    phones: listPhone,
    emails: obj?.emails,
    current_emails: [],
    addresses: addressModify || [],
    gender: obj?.gender,
    martial_status: obj?.maritalStatus,
    source: obj?.source,
    priority_status: obj?.primaryStatus,
    management_years: obj?.yearOfManagement,
    industry_years: obj?.yearOfServices,
    prefer_position: {
      positions: positionApplied
    },
    type: 3,
  };
  if(result.dob === ""){
    delete result.dob;
  }
  return result;
};



export const DetailCandidate = memo((prop) => { 
  const params = prop.params;
  const onChange = prop.onChange;
  const edit = prop.edit || false; 
  const [prevData,setPrevData]= useState({});
  const [country, setCountry] = useState();
  const [city, setCity] = useState();  
  const [nationality, setNationality] = useState('');
  const [value, setValue] = useState();
  const [loadings, setLoadings] = useState([]);
  const [form] = Form.useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: auth } = useAuth();   
  const token = auth?.token;
  

  // const dataStatus = useSelector((state) => state.candidate.data) 
  let styleButton = {};
  if(edit){
    styleButton = {float: "right", position: 'fixed', bottom: 0, right: 0, backgroundColor: '#f0f2f5', width: '100%', textAlign: 'end',paddingBlock: '20px'};
  }else{
    styleButton = {float: "right", marginRight: 10} ;
  }

  const { data: listCountries } = useQuery(["repoData",token], () => getValueFlag(token));

  const { data: listPosition } = useQuery(["position",token], () => getPosition(token));
  const { data: dataFromCountry } = useQuery(
    ["locationFromCountry", country,token],
    () => getLocationFromCountry(country,token),
    { enabled: Boolean(country) }
  );
  const { data: dataFromCity } = useQuery(
    ["locationFromCity", city,token],
    () => getLocationFromCity(city,token),
    { enabled: Boolean(city) }
  ); 
  const { data: listDegree } = useQuery(["listDegree",token], () =>
    getDegree(token)
  ); 
  const { data: listNationality } = useQuery(
    ["getNationalityByValue", nationality,token],
    () => getNationality(nationality,token), 
  );      
  useEffect(()=>{
    if(edit){
      if(params.id){ 
        getCandidate(params.id,token).then(dataCandidate =>{  
          const dob = dataCandidate?.dob?.split("-") || []; 
          const x =({
            id: dataCandidate?.id,
            addresses:  dataCandidate.addresses|| [""],
            date: dob[2] || null, 
            emails: dataCandidate.emails,
            firstName: dataCandidate.first_name|| null,
            gender: dataCandidate.gender,
            lastName: dataCandidate.last_name|| null,
            maritalStatus: dataCandidate.extra.martial_status,
            middleName: dataCandidate.middle_name || null,
            month: dob[1]|| null,
            highest_education: dataCandidate.highest_education,
            readyToMove: dataCandidate.readyToMove || 1,
            nationality: dataCandidate.nationality,
            phones: dataCandidate.phones.map((e) =>({ countryCode: "+"+e.phone_code.key, phone: e.number}))|| [""],
            positionApplied: dataCandidate.prefer_position.positions,
            primaryStatus: dataCandidate.priority_status || 1,
            source: dataCandidate.source,
            year: dob[0]|| null,
            yearOfManagement: dataCandidate.management_years,
            yearOfServices: dataCandidate.industry_years,
            directReports: dataCandidate.direct_reports
          });  
          setPrevData(x)
        }).catch(err => {  
        });
      }else{
        setPrevData(JSON.parse(localStorage.getItem('personal-infomation')))
      }
    }
  },[params?.id,token,edit]);
  const onFinish = (values) => {   
  if (values && !edit) { 
      let data = result(values);
      dispatch(fetchCreateCandidate( {data,token}))
      .then(unwrapResult)
      .then((originalPromiseResult) => {
        confirm() 
        console.log(originalPromiseResult);
      })
      .catch((rejectedValueOrSerializedError) => {
        // console.log(rejectedValueOrSerializedError);
        error("Please check you infomation");
        // handle result here
      })

      // setTimeout(() => {
      //   createCandidate(result(values)).then(res => { 
      //     if(res.status === 200) {
      //        countDown();  
      //     }else{
      //       error("Please check field "+res.response.data[0].field+ "with" + res.response.data[0].message)
      //     }
      //   }); 
      //  },1000) 
  
      localStorage.setItem("personal-infomation", JSON.stringify(values));
    } else if (values && edit) {
      let data = {
        id: prevData?.id,
        data:result(values),
        token
      };
       dispatch(fetchUpdateCandidate(data))
      .then(unwrapResult)
      .then(() => { 
        countDown()
        // if(dataStatus === 200){ 
        // }
      })
      .catch((rejectedValueOrSerializedError) => {  
        // console.log(rejectedValueOrSerializedError);
        error("Please check you infomation");
        // handle result here
      })

    //  setTimeout(() => {
    //   updateCandidate(prevData?.id, result(values)).then(res => { 
    //     if(res.status === 200) {
    //       dispatch(increment(values));
    //        countDown();  
    //     }else{
    //       error("Please check field "+res.response.data[0].field+ "with" + res.response.data[0].message)
    //     }
    //   }); 
    //  },1000)
    } 
  };
  const onFinishFailed = values => { 
   return Modal.warning({
      title: 'Please complete field required',
      content: (
        <div>
          {values.errorFields.map((field,index) => <p key={index}>{field.name[0]}</p>)} 
        </div>
      ),
    });
  }
  const onValuesChange = (values) => {
    setValue(values);
  };
  const onChangeCountryAddress = (e,o) => { 
    let list = form.getFieldValue()?.addresses;  
    let cur = list[o.position]; 
    list[o.position] = {
      country: cur?.country, 
    }
    form.setFieldsValue({
      addresses:[
        ...list 
      ]
    }); 
    setCountry(o.data.key);  
    setCity();
  };
  const onChangeCityAddress = (e,o) => { 
    let list = form.getFieldValue()?.addresses;   
    let cur = list[o.position]; 
    list[o.position] = {
      country: cur?.country, 
      city: cur?.city, 
    }
    form.setFieldsValue({
      addresses:[
        ...list
      ]
    }); 
    setCity(o.data.key);   
  }; 
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  }; 
  const error = (message) => {
    Modal.error({
      title: 'Please check your infomation',
      content: message,
    });
  };
  const countDown = () => {
    let secondsToGo = 2;
    let mess = ""; 
      mess = "Updated success"; 
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
    }, secondsToGo * 1000);
  }; 
  const confirm = () => {
    Modal.confirm({
      title: 'Created Candidate',
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      content: 'Success! You have successfully!',
      okText: 'List Candidate',
      cancelText: 'Create new',
      onOk: () => navigate("/candidates"),
      onCancel: () => navigate("/add-candidate")
    });
  }; 
  if(Object.keys(prevData).length > 0 || !edit) {
    return (
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
          scrollToFirstError={true}
          form={form}
          initialValues={{
            ...prevData,  
            emails: [...(prevData?.emails || [""])],
            phones: [...(prevData?.phones ||  [{ countryCode: "+84", phone: null}])],
            addresses: [...(prevData?.addresses || [{}])],    
            readyToMove: prevData?.readyToMove || 1,
          }}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed} 
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
                <div className="label-add-candidate">Middle Name:</div>
  
                <Form.Item name="middleName">
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
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value={1}>Active</Select.Option>
                    <Select.Option value={-1}>Off-limit</Select.Option>
                    <Select.Option value={-2}>Blacklist</Select.Option>
                    <Select.Option value={5}>Inactive</Select.Option>
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
                        filterOption={(input, option) =>
                          option.children
                            .toString()
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
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {month.map(function (x, i) {
                          return (
                            <Select.Option key={i} value={i + 1}>
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
                        filterOption={(input, option) =>
                          option.children
                            .toString()
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
            {/* Spaceaddresses*/}
            <Col span={12}></Col>
            {/* Gender */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Gender:</div>
                <Form.Item required name="gender">
                  <Radio.Group onChange={onChange}>
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
                  <Radio.Group onChange={onChange}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={-1}>No</Radio>
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
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value={1}>Yes</Select.Option>
                    <Select.Option value={-1}>No</Select.Option>
                    <Select.Option value={2}>Available</Select.Option>
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
                <Form.List name="emails"  
                > 
                  {(emails, { add, remove }, { errors }) => (
                    <>  
                      {emails.map((email, index) => (
                        <Form.Item
                          key={email.key}
                          required={false}
                          style={{
                            width: "65%",
                            display: "flex",
                            marginBottom: 8,
                          }}
                          align="baseline"
                        > 
                          <Form.Item 
                            {...email}
                            style={{ flex: 1 }} 
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[ 
                              {
                                required: true,
                                whitespace: true,
                                message: "Please input Email!",
                              }, 
                              {
                                type: "email",
                                message: "The input is not valid Email!",
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              style={{ width: "95%" }}
                              placeholder={"ex: email@email.com"}
                            />
                          </Form.Item>
                          {emails.length > 1 ? (
                            <MinusCircleOutlined
                              style={{
                                marginLeft: 10,
                                paddingTop: 10,
                                color: "red",
                              }}
                              onClick={() => remove(email.name)}
                            />
                          ) : null}
                        </Form.Item>
                      ))}
  
                      {emails.length < 5 ? (
                        <Form.Item style={{ width: "60%", textAlign: "end" }}>
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

                          <Form.ErrorList errors={errors} />
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
                      {phones.map((phone, index) => (
                        <div
                          key={phone.key}
                          style={{
                            display: "flex",
                            width: "65%",
                            marginBottom: 8,
                          }}
                          align="baseline"
                        >
                          <Input.Group style={{ display: "flex" }} compact>
                            <Form.Item name={[index, "countryCode"]}>
                              <Select 
                                style={{ width: 100 }}
                                defaultValue="+84"
                                showSearch  
                                rules={[  
                                  {
                                    required: true,
                                    message: "Please choose you country code!",
                                  },
                                ]}
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
                              name={[index, "phone"]}
                              rules={[ 
                                {
                                  pattern: /^(?:\d*)$/,
                                  message: "Please input numbers only",
                                },
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
                              <Input maxLength={11} placeholder="ex: 371234567" />
                            </Form.Item>
                          </Input.Group>
                          {phones.length > 1 ? (
                            <MinusCircleOutlined
                              style={{
                                marginLeft: 10,
                                paddingTop: 10,
                                color: "red",
                              }}
                              onClick={() => remove(phone.name)}
                            />
                          ) : null}
                        </div>
                      ))}
  
                      {phones.length < 5 ? (
                        <Form.Item style={{ width: "60%", textAlign: "end" }}>
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
            {/* Addresses */}
            <Col span={24}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Address:</div>
                <Form.List name={"addresses"}>
                  {(addresses, { add, remove }) => (
                    <>
                      {addresses.map((address, index) => (
                        <div
                          key={address.key}
                          style={{
                            display: "flex",
                            marginBottom: 8,
                          }}
                          align="baseline"
                        >
                          <Row style={{ flex: 1 }}>
                            <Col span={8} style={{ paddingRight: 5 }}>
                              <Form.Item name={[index, "country"]} 
                                  >
                                <Select
                                  optionFilterProp="children"
                                  placeholder="Country" 
                                  showSearch 
                                  onChange={(e,o) => onChangeCountryAddress(e,o)}
                                >
                                  {listCountries?.data.map((e, i) => {
                                    return (
                                      <Select.Option
                                        key={i}
                                        children={e?.label}
                                        value={e.key}
                                        maxTagTextLength={10}
                                        data={e} 
                                        position={index}
                                      >
                                        {e?.label}
                                      </Select.Option>
                                    ); 
                                  })} 
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ paddingInline: 10 }}>
                              <Form.Item name={[index, "city"]}   
                                  >
                                <Select
                                  optionFilterProp="children"
                                  disabled={
                                    (!dataFromCountry?.data.length > 0 &&
                                      !params?.id) 
                                  }
                                  placeholder="City" 
                                  showSearch
                                  onChange={(e,o) => onChangeCityAddress(e,o)} 
                                >
                                  {dataFromCountry?.data?.map((e, i) => {
                                    return (
                                      <Select.Option
                                        key={i}
                                        children={e?.label}
                                        value={e?.key}
                                        maxTagTextLength={10}
                                        data={e}
                                        position={index}
                                      >
                                        {e?.label}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} style={{ paddingLeft: 5 }}>
                              <Form.Item name={[index, "district"]}>
                                <Select
                                  disabled={
                                    (!dataFromCity?.data.length > 0 &&
                                      !params?.id) 
                                  }
                                  showSearch
                                  placeholder="District"
                                >
                                  {dataFromCity?.data.map((e, i) => {
                                    return (
                                      <Select.Option
                                        key={i}
                                        children={e?.label}
                                        value={e?.key}
                                        position={index}
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
                              style={{ width: "100%" }}
                              name={[index, "address"]}
                            >
                              <Input
                                style={{
                                  width: "100%",
                                  marginTop: 20,
                                }}
                                placeholder="ex: Street Le Van Si"
                              />
                            </Form.Item>
                          </Row>
                          {addresses.length > 1 ? (
                            <MinusCircleOutlined
                              twoToneColor={"red"}
                              style={{
                                marginLeft: 10,
                                paddingTop: 10,
                                color: "red",
                              }}
                              onClick={() =>
                                remove(address.name) 
                              }
                            />
                          ) : null}
                        </div>
                      ))}
  
                      {addresses.length < 5 ? (
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
                      ) : <></>}
                    </>
                  )}
                </Form.List>
              </div>
            </Col>
            {/* Nationality */}
            <Col span={24}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Nationality :</div>
                <Form.Item name="nationality">
                  <Select
                    mode="multiple"
                    optionFilterProp="children"
                    placeholder="Please choose or add a nationality"
                    showSearch   
                    onKeyUp={(e)=>{ setTimeout(() =>{return setNationality(e.target.value)},600)}} 
                    onBlur={()=>{setNationality()}}
                    // filterOption={(input, option) => setTimeout(() =>{return setNationality(input)},600)}
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    dropdownRender={menu => (
                      <div>
                        {menu}
                        {(listNationality?.data?.length > 0)?<></>: <>
                          <Divider style={{ margin: '4px 0' }} />
                          <div
                            style={{ padding: '4px 8px', cursor: 'pointer' }}
                            // onMouseDown={e => console.log(e)}
                            // onClick={()=> console.log(1)}
                          >
                            <PlusOutlined /> Add item
                          </div>
                        </>}
                        
                      </div>
                    )}
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
                <div className="label-add-candidate">Position Applied :</div>
                <Form.Item required name="positionApplied">
                  <Select
                    mode="multiple"
                    optionFilterProp="children"
                    placeholder="Select or add your position applied"
                    showSearch
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
            {/* Highest Education  */}
            <Col span={24}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Highest Education :</div>
                <Form.Item name="highest_education">
                  <Select
                    optionFilterProp="children"
                    placeholder="Select your highest education"
                    showSearch
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {listDegree?.data?.map((e, i) => {
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
                <Form.Item name="yearOfServices" rules={ [{
                  pattern: /^(?:\d*)$/,
                  message: "Please input integers numbers only",
                }]}>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
            {/* Year of Management */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">Year of Management:</div>
                <Form.Item name="yearOfManagement"
                rules={ [{
                  pattern: /^(?:\d*)$/,
                  message: "Please input integers numbers only",
                }]}>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
            {/* No. of Direct Reports */}
            <Col span={12}>
              <div style={{ paddingInline: 10 }}>
                <div className="label-add-candidate">No. of Direct Reports:</div>
                <Form.Item name="directReports"rules={[ {
                  pattern: /^(?:\d*)$/,
                  message: "Please input integers numbers only",
                }]}>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          {!value? (
            ""
          ) : (
            <div style={styleButton}>
                {!edit ? (
                  <></>
                ) : ( 
                    <Button
                    style={{width: '100px', marginRight: '20px'}}
                    loading={loadings[1]}
                    onClick={() => enterLoading(1)}
                  >
                    Reset
                  </Button> 
                )}
                <Button 
                  style={{ marginRight: '20px',minWidth: '100px'}}
                  type="primary"
                  htmlType="submit"
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                >
                  {edit ? "Update" : " Create and Next"}
                </Button> 
            </div>
          )}
        </Form>
      </Content>
    );
  } 
  
 
})
