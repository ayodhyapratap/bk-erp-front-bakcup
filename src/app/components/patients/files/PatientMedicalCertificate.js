import React from "react";
import {Route} from "react-router";
import { Form, Icon, Input, Button,Checkbox, Card,DatePicker, Radio ,Row,Col,Select} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {postAPI, interpolate, displayMessage} from "../../../utils/common";
import {ATTENDANCE} from "../../../constants/hardData";
import {MEDICAL_CERTIFICATE_API} from "../../../constants/api";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";


const { TextArea } = Input;
const { Option } = Select;
class PatientMedicalCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
            excused_duty_checked:false,
            fit_light_duty_checked:false,
            attendance_checked:false,
        }
        
    console.log(this.props);
    }
    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }
    
    handleCheck = (e) => {
        this.setState({
            excused_duty_checked: !this.state.excused_duty_checked
        });
    }
    handleLighDutyCheck = (e)=>{
        this.setState({
            fit_light_duty_checked:!this.state.fit_light_duty_checked
        });
    }
    onChangeHandle = (e)=>{
        this.setState({
            
        });
    }
    handleAttendanceCheck = (e) =>{
        this.setState({
            attendance_checked:!this.state.attendance_checked
        });
    }

    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let reqData = {...values};
                that.setState({
                });
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Saved Successfully!!");
                    that.setState({
                    });
                }
                let errorFn = function () {
                    that.setState({
                    });
                }
                console.log(reqData);
                postAPI(interpolate(MEDICAL_CERTIFICATE_API, [this.props.currentPatient.id]), reqData, successFn, errorFn);
            }
        });
    }
    render() {
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
                md: {span: 8},
                lg: {span: 8},
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
                md: { span: 16 },
                lg: { span: 16 },
            },
        };
        const radioOption = ATTENDANCE.map((option) => <Radio value={option.value}>{option.label}</Radio>)
        return ( <Form onSubmit={this.handleSubmit} {...formItemLayout}> 
                <Card title="ADD MEDICAL LEAVE CERTIFICATE"
                    extra={<Button.Group>
                    <Button type="primary" htmlType="submit">Save Certificate</Button>
                </Button.Group>}>

           

                <Form.Item >
                    {getFieldDecorator('excused_duty', { })(
                        (<Checkbox onClick={this.handleCheck} defaultChecked={this.state.excused_duty_checked}>Excused from duty</Checkbox>),
                    )}                 
                </Form.Item> 
                {this.state.excused_duty_checked ? 
                    <Row>
                        <Col span={6} offset={6}>
                            <Form.Item label="From">
                                <DatePicker />
                            </Form.Item>

                            <Form.Item label="till">
                                <DatePicker />
                            </Form.Item>
                            
                        </Col>
                        <Col span={6} >
                            <Form.Item>
                                <Select>
                                    <Option value="M">Morning</Option>
                                    <Option value="E">Evening</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Select>
                                    <Option value="M">Morning</Option>
                                    <Option value="E">Evening</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                :null}
                

                <Form.Item >
                    {getFieldDecorator('fit_light_duty', { })(
                        (<Checkbox onClick={this.handleLighDutyCheck} defaultChecked={this.state.fit_light_duty_checked}>Fit for light duty</Checkbox>),
                    )}                 
                </Form.Item> 

                {this.state.fit_light_duty_checked ?
                    <Row>
                        <Col>
                            <Form.Item label="From">
                                <DatePicker />
                            </Form.Item>

                            <Form.Item label="till">
                                <DatePicker />
                            </Form.Item>
                        </Col>
                    </Row>
                    :null
                }
                
                <Form.Item>
                    {getFieldDecorator('proof_attendance', { })(
                        (<Checkbox onClick={this.handleAttendanceCheck} defaultChecked={this.state.attendance_checked}>Proof of attendance at practice</Checkbox>),
                    )}                 
                </Form.Item> 
                {this.state.attendance_checked ? 
                    <Row>
                        <Form.Item label="on">
                            <DatePicker />
                        </Form.Item>
                        <Col span={6} offset={6}>
                            <Form.Item label="From">
                                <Select>
                                    <Option value="M">5pm</Option>
                                    <Option value="E">8pm</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="till">
                                <Select>
                                    <Option value="M">8</Option>
                                    <Option value="E">9</Option>
                                </Select>
                            </Form.Item>
                        
                        </Col>
                        <Col span={4} >
                            <Form.Item>
                                <Select>
                                    <Option value="M">8</Option>
                                    <Option value="E">9</Option>
                                </Select>
                            </Form.Item>
    
                            <Form.Item>
                                <Select>
                                    <Option value="M">8</Option>
                                    <Option value="E">9</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        </Row>
                    
                    
                    :null}
               
                        
                <Form.Item label="Notes">
                    {getFieldDecorator('notes', { })(
                        (<TextArea/>),
                    )}                 
                </Form.Item> 

                
                <Form.Item>
                    {getFieldDecorator('xxf', { })(
                        <Radio.Group onChange={this.onChangeHandle}>
                           {radioOption}
                        </Radio.Group>
                    )}
                    
                </Form.Item>
               
            </Card>
        </Form>

        );
      }
}

export default Form.create()(PatientMedicalCertificate);
