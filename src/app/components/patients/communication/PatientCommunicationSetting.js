import React from "react";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, List, Card, Form, Icon, Row, Table, Divider, Col, Radio} from "antd";
import {SINGLE_CHECKBOX_FIELD} from "../../../constants/dataKeys";
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";

class PatientCommunicationSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    
    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
            // const { getFieldDecorator } = this.props.form;
            const formItemLayout = {
              labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
                md: { span: 8 },
                lg: { span: 8 },
              },
              wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
                md: { span: 16 },
                lg: { span: 16 },
              },
            };

            const dataSource = [{
              key: '1',
              name: '13 Apr 2019 12:30 PM',
              age: 32,
              address: '10 Downing Street'
            }, {
              key: '2',
              name: '13 Apr 2019 12:30 PM',
              age: 42,
              address: '10 Downing Street'
            }];

            const columns = [{
              title: 'SENT TIME',
              dataIndex: 'name',
              key: 'name',
            }, {
              title: 'MESSAGE',
              dataIndex: 'age',
              key: 'age',
            }, {
              title: 'DELIVERY TIME',
              dataIndex: 'address',
              key: 'address',
            },{
              title: 'TYPE',
              dataIndex: 'age',
              key: 'age',
            },{
              title: 'MESSAGE STATUS',
              dataIndex: 'age',
              key: 'age',
            }
            ];
        return (<Form>
                    <Form.Item {...formItemLayout} key={'active'}> <label><span className="ant-form-text">{'Enable SMS the patient'} : </span>
                            <Radio.Group>
                                <Radio value="a">Yes</Radio>
                                <Radio value="b">No</Radio>
                            </Radio.Group>
                            </label>
                    </Form.Item>

                    <Form.Item {...formItemLayout} key={'active'}> <label> <span className="ant-form-text">{'Enable Email the patient'} : </span>
                            <Radio.Group>
                                <Radio value="a">Yes</Radio>
                                <Radio value="b">No</Radio>
                            </Radio.Group>
                            </label>
                    </Form.Item>

                    <Form.Item {...formItemLayout} key={'active'}> <label> <span className="ant-form-text"> {"Send Birthday wish SMS & Email"} : </span>
                            <Radio.Group>
                                <Radio value="a">Yes</Radio>
                                <Radio value="b">No</Radio>
                            </Radio.Group>
                            </label>
                    </Form.Item>
                    <h3>{'Next Follow-up To go on 12-09-2019'} <Button type="dashed">change</Button></h3>

                    
                    <div>
                        <p>Recent Appointments</p>
                        <Divider  style={{marginTop:0, marginBottom:5}}/>

                        <List><span>{'25-09-2019'}</span></List>
                        <List>{'25-09-2019'}</List>
                    </div>
                    <div>
                         <Divider dashed />
                        <h2>Past Communication</h2>
                        <span>SMS</span>
                        <Table dataSource={dataSource} columns={columns} />
                    </div>

                </Form>
           );
       
    }
}

export default PatientCommunicationSetting;
