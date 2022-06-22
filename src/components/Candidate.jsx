import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  createCandidate,
  getDefaultProp,
  getLocationFromCity,
  getLocationFromCountry,
  getNationality,
  getPosition,
  getValueFlag,
  updateCandidate,
} from "../features/candidate";
const day = () => {
  let arr = [];
  for (let index = 1; index <= 31; index++) {
    if(index < 10){ 
      arr.push("0"+index);
    }else{ 
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

const cv = (x)=>{
  if(x.toString().length < 2){
    return "0" + x;
  }
  return x;
}
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
  let listEmail = obj?.emails?.map((e) => {
    return e.email;
  }); 
  return { 
    nationality: obj?.nationality,
    middle_name: obj?.middleName,
    highest_education: obj?.highest_education,
    dob:
      (obj?.year ? obj?.year + "-" : "") +
      (obj?.month ? cv(obj?.month)+ "-" : "") +
      (obj?.date ? cv(obj?.date ): ""),
    full_name:
      (obj?.firstName ? obj?.firstName + " " : "") +
      (obj?.month ? obj?.month + " " : "") +
      (obj?.lastName ? obj?.lastName : ""),
    relocating_willingness: obj?.readyToMove,
    first_name: obj?.firstName,
    last_name: obj?.lastName,
    phones: listPhone,
    emails: listEmail,
    current_emails: [],
    addresses: [],
    gender: obj?.gender,
    martial_status: obj?.martialStatus,
    source: obj?.source,
    priority_status: obj?.primaryStatus,
    type: 3,
  };
};

export function DetailCandidate(prop) {
  const prevData = prop.prevData;
  const params = prop.params;
  const onChange = prop.onChange;
  const edit = prop.edit || false; 
  const [country, setCountry] = useState();
  const [value, setValue] = useState();
  const [city, setCity] = useState();
  const [disabled, setDisabled] = useState(prop.disabled);
  const [listProps, setListProps] = useState();
  const navigate = useNavigate();

  const { data: listCountries } = useQuery("repoData", () => getValueFlag());
  const { data: listNationality } = useQuery("repoNationality", () =>
    getNationality()
  );

  const { data: listPosition } = useQuery("position", () => getPosition());
  const { data: dataFromCountry } = useQuery(
    ["locationFromCountry", country],
    () => getLocationFromCountry(country),
    { enabled: Boolean(country) }
  );
  const { data: dataFromCity } = useQuery(
    ["locationFromCity", city],
    () => getLocationFromCity(city),
    { enabled: Boolean(city) }
  );
  const { data: listDefaultProp } = useQuery("defaultProps", () =>
    getDefaultProp()
  );
  useEffect(() => {
    if (listDefaultProp) {
      let b = Object.values(listDefaultProp).find((obj) => {
        return obj.name === "certificate";
      });
      setListProps(b?.values);
    }
  }, [listDefaultProp]); 

  const onFinish = (values) => { 
    countDown();
    if (values && !edit) {
      createCandidate(result(values)); 
      localStorage.setItem("personal-infomation", JSON.stringify(values));
      setDisabled(true);
    }else if (values && edit) { 
        updateCandidate(prevData?.id,result(values))
        setDisabled(false); 
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
    let mess = "";
    if (params?.id) {
      mess = "Updated success";
    } else {
      mess = "Created success";
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
  if(!prevData && edit) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  } 
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
        initialValues={{
          date: prevData?.date || null,
          year: prevData?.year || null,
          month: prevData?.month || null,
          firstName: prevData?.firstName || null,
          lastName: prevData?.lastName || null,
          emails: [...(prevData?.emails || [""])],
          phones: [...(prevData?.phones || [""])],
          address: [...(prevData?.address || [""])],
        }}
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
                rules={[ {
                  type: "text", 
                },
                  {
                    required: true,
                    message: "Please input First Name!",
                  },
                ]}
              >
                <Input
                  defaultValue={prevData?.firstName || null} 
                  disabled={disabled}
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
              <div className="label-add-candidate">Middle Name:</div>

              <Form.Item name="middleName">
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
                <Radio.Group
                  onChange={onChange}
                  disabled={disabled}
                  defaultValue={prevData?.gender || null}
                >
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
                <Radio.Group
                  onChange={onChange}
                  disabled={disabled}
                  defaultValue={prevData?.maritalStatus || null}
                >
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
                  disabled={disabled}
                  style={{ width: "100%", cursor: "pointer" }}
                  optionFilterProp="children"
                  defaultValue={prevData?.readyToMove || "Yes"}
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
                            style={{ marginLeft: 10, paddingTop: 10, color: 'red' }}
                            onClick={() => remove(name)}
                          />
                        ) : null}
                      </div>
                    ))}

                    {emails.length < 5 ? (
                      <Form.Item style={{ width: "60%", textAlign: "end" }}>
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
                    {phones.map(({ key, name }) => (
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
                          <Form.Item name={[key, "countryCode"]}>
                            <Select
                              disabled={disabled}
                              style={{ width: 100 }}
                              defaultValue="+84"
                              showSearch
                              rules={[{ required: true }]}
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
                              defaultValue={
                                prevData?.phones[key]?.phone || null
                              }
                              disabled={disabled}
                              placeholder="ex: 371234567"
                            />
                          </Form.Item>
                        </Input.Group>
                        {phones.length > 1 ? (
                          <MinusCircleOutlined
                            disabled={disabled}
                            style={{ marginLeft: 10, paddingTop: 10 , color: 'red'}}
                            onClick={() => remove(name)}
                          />
                        ) : null}
                      </div>
                    ))}

                    {phones.length < 5 ? (
                      <Form.Item style={{ width: "60%", textAlign: "end" }}>
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
                                onChange={(e) => onChangeCountryAddress(e)}
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
                                  (!dataFromCountry?.data.length > 0 &&
                                    !params?.id) ||
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
                                  (!dataFromCity?.data.length > 0 &&
                                    !params?.id) ||
                                  disabled
                                }
                                defaultValue="District"
                                showSearch
                              >
                                {dataFromCity?.data.map((e, i) => {
                                  return (
                                    <Select.Option
                                      key={i}
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
                          <Form.Item
                            style={{ width: "100%" }}
                            name={[key, "street"]}
                          >
                            <Input
                              disabled={disabled}
                              style={{
                                width: "100%",
                                marginTop: 20,
                              }}
                              placeholder="ex: Street Le Van Si"
                            />
                          </Form.Item>
                        </Row>
                        {address.length > 1 ? (
                          <MinusCircleOutlined
                            twoToneColor={"red"}
                            style={{
                              marginLeft: 10,
                              paddingTop: 10, 
                              color: 'red'
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
                  mode="multiple"
                  defaultValue={prevData?.nationality}
                  disabled={disabled}
                  optionFilterProp="children"
                  placeholder="Please choose a nationality"
                  showSearch 
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
                  defaultValue={prevData?.positionApplied}
                  disabled={disabled}
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
              <Form.Item required name="highest_education">
                <Select
                  defaultValue={prevData?.highest_education || null}
                  disabled={disabled}
                  optionFilterProp="children"
                  placeholder="Select or add your highest education"
                  showSearch
                >
                  {listProps?.map((e, i) => {
                    return (
                      <Select.Option
                        key={i}
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
              <div className="label-add-candidate">Year of Management:</div>
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
              <div className="label-add-candidate">No. of Direct Reports:</div>
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
        {!value && !disabled ? (
          ""
        ) : (
          <Form.Item label=" " colon={false}>
            {edit ? (
              <></>
            ) : (
              <Button
                type="primary"
                onClick={() => localStorage.removeItem("personal-infomation")}
              >
                Reset
              </Button>
            )} 

            <Button
              style={{ float: "right", marginRight: 40 }}
              type="primary"
              htmlType="submit" 
            >
              {edit ? "Update" : " Create and Next"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Content>
  );
}
