import React from "react";
import {Route} from "react-router";
import { Form, Icon, Input, Button,Checkbox, Card,DatePicker, Radio ,Row,Col,Select,TimePicker} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {postAPI, interpolate, displayMessage} from "../../../utils/common";
import {ATTENDANCE} from "../../../constants/hardData";
import {MEDICAL_CERTIFICATE_API} from "../../../constants/api";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import moment from 'moment';


// const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
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
            // startDate: this.props.value,
            // endDate: new Date(),
            proof_attendance_from:null,
            days:0,
        }
        this.handleChangeStart =this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.totalDays = this.totalDays.bind(this);
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
    handleChangeStart = (date)=> {
        console.log("date kya h0",this.state.startDate)
        this.setState({
          startDate: date
        });
       
    }
    
    
    handleChangeEnd(date) {
        console.log(date);
        this.setState({
          endDate: date
        });
    }
    totalDays(){
        let {startDate, endDate} = this.state;
        let amount = endDate.diff(startDate ,"days");
        this.setState({
        days: amount
        });
    }
    onChange =(timeString)=> {
       this.setState({
        proof_attendance_from:timeString
       });
    }
    
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("value",values);
                let reqData = {...values,
                    practice:that.props.active_practiceId,
                    excused_duty_from:moment(values.excused_duty_from).format("YYYY-MM-DD"),
                    excused_duty_to:moment(values.excused_duty_to).format("YYYY-MM-DD"),
                    fit_light_duty_from:moment(values.fit_light_duty_from).format("YYYY-MM-DD"),
                    fit_light_duty_to:moment(values.fit_light_duty_to).format("YYYY-MM-DD"),
                    proof_attendance_date:moment(values.proof_attendance_date).format("YYYY-MM-DD"),
                    proof_attendance_from:moment(values.proof_attendance_from).format('LT'),
                    proof_attendance_to:moment(values.proof_attendance_to).format('LT'),
                    patient: that.props.match.params.id,
                    is_active:true
                };
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
                                {getFieldDecorator('excused_duty_from',{})
                                    (
                                        <DatePicker />
                                        
                                    )
                                }
                            </Form.Item>

                            <Form.Item label="till">
                                {getFieldDecorator('excused_duty_to',{})
                                    (
                                        <DatePicker  />
                                    )
                                }
                            </Form.Item>
                            
                        </Col>
                        <Col span={6} >
                            <Form.Item>
                                {getFieldDecorator('excused_duty_from_session',{})
                                (
                                    <Select>
                                        <Option value="M">Morning</Option>
                                        <Option value="E">Evening</Option>
                                    </Select>
                                )}
                                
                            </Form.Item>

                            <Form.Item>
                                {getFieldDecorator('excused_duty_to_session',{})
                                (
                                    <Select>
                                        <Option value="M">Morning</Option>
                                        <Option value="E">Evening</Option>
                                    </Select>
                                )}
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
                                {getFieldDecorator('fit_light_duty_from',{})
                                    (
                                        <DatePicker />
                                    )
                                }
                                
                            </Form.Item>

                            <Form.Item label="till">
                                {getFieldDecorator('fit_light_duty_to',{})
                                    (
                                        <DatePicker/>
                                    )
                                }
                                
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
                            {getFieldDecorator('proof_attendance_date',{})
                                (<DatePicker />)
                            }
                        </Form.Item>
                        <Col span={6} offset={6}>
                            <Form.Item label="From">
                                {getFieldDecorator('proof_attendance_from',{})
                                    (
                                        <TimePicker use12Hours format="h:mm A"/>
                                    )
                                }
                               
                            </Form.Item>
                            <Form.Item label="till">
                                {getFieldDecorator('proof_attendance_to',{})
                                    (
                                        <TimePicker use12Hours format="h:mm A" />
                                    )
                                }
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
