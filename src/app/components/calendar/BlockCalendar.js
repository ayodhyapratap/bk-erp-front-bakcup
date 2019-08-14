import React from "react";
import {
    DATE_PICKER,
    DATE_TIME_PICKER, DOCTORS_ROLE,
    ERROR_MSG_TYPE,
    INPUT_FIELD,
    SELECT_FIELD,
    TIME_PICKER
} from "../../constants/dataKeys";
import moment from "moment";
import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {Form, Card, Row, Col,Popover, List,Button, DatePicker,TimePicker,Input,Select,Divider} from "antd";
import {APPOINTMENT_PERPRACTICE_API, BLOCK_CALENDAR, PRACTICESTAFF} from "../../constants/api";
import {displayMessage, getAPI, interpolate,postAPI} from "../../utils/common";
import { loadDoctors } from "../../utils/clinicUtils";
import {
    CANCELLED_STATUS,
    CHECKOUT_STATUS,
    ENGAGED_STATUS,
    SCHEDULE_STATUS,
    WAITING_STATUS
} from "../../constants/hardData";
import EventPatientPopover from "./EventPatientPopover";
import { tag } from "postcss-selector-parser";

class BlockCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            practiceDoctors: [],
            blockedAppointmentParams: {}
        };
    }
    componentDidMount() {
        loadDoctors(this);
    }
    changeParamsForBlockedAppointments = (type, value) => {
        let that = this;
        this.setState(function (prevState) {
            return {
                blockedAppointmentParams: {
                    ...prevState.blockedAppointmentParams,
                    [type]: value
                }
            }
        }, function () {
            // if (valueObj.block_from && valueObj.block_to)
            that.retrieveBlockingAppointments();
        })
    }
    retrieveBlockingAppointments = () => {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setState(function (prevState) {
                return {
                    blockingAppointments: data,
                    loading: false
                }
            });
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        if (this.state.blockedAppointmentParams.block_from && this.state.blockedAppointmentParams.block_to)
            getAPI(interpolate(APPOINTMENT_PERPRACTICE_API, [this.props.active_practiceId]), successFn, errorFn, {
                start: moment(that.state.blockedAppointmentParams.block_from).format('YYYY-MM-DD'),
                end: moment(that.state.blockedAppointmentParams.block_to).format('YYYY-MM-DD')
            });
    }

    handleSubmit =(e)=>{
        e.preventDefault();
        let reqData={}
        this.props.form.validateFields((err, values) => {
            console.log(values);
            
            if (!err) {
                reqData = {...values,
                    practice:this.props.active_practiceId,

                };
                
                // reqData.
            }
        });

        let successFn =function(data){

        }
        let errorFn=function(){

        }
        postAPI(BLOCK_CALENDAR,reqData,successFn,errorFn)
    }
   
    render(){
        console.log("Doctor list",this.state)
        console.log(this.props)
        let that = this;
        const {getFieldDecorator} = this.props.form;
 
        const formItemLayout = ({
            labelCol: {span: 6},
            wrapperCol: {span: 4},
        });
        return(<Card title={'Block Calendar'}>
                <Row>
                    <Col span={18}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item label="Block From" {...formItemLayout}>
                                {getFieldDecorator('block_from',{initialValue:moment()})
                                (<DatePicker  showTime onChange={(value)=>this.changeParamsForBlockedAppointments('block_from',value)}/>)
                            }
                            </Form.Item>

                            <Form.Item label="Block To" {...formItemLayout}>
                                {getFieldDecorator('block_to',{initialValue:moment()})
                                (<DatePicker  showTime onChange={(value)=>this.changeParamsForBlockedAppointments('block_to',value)}/>)
                            }
                            </Form.Item>

                            <Form.Item label="Event Name" {...formItemLayout}>
                                {getFieldDecorator('event', {})
                                (<Input placeholder="Event Name"/>)
                                }
                            </Form.Item>

                            <Form.Item label="Doctor" {...formItemLayout}>
                                {getFieldDecorator('doctor', {})
                                (<Select placeholder="Docto List">
                                    {this.state.practiceDoctors.map((option) => <Select.Option
                                    value={option.id}>{option.user.first_name}</Select.Option>)}
                                </Select>)

                                }
                            </Form.Item>

                            <Form.Item>
                                <Button style={{margin: 5}} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                {that.props.history ?
                                    <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                        Cancel
                                    </Button> : null}
                            </Form.Item>

                        </Form>
                    </Col>
                
                    <Col span={6}>
                        <List
                            size={'small'}
                            dataSource={this.state.blockingAppointments}
                            renderItem={(apppointment) => (apppointment.status == CANCELLED_STATUS ? <div/> : <List.Item
                                color={'transparent'}
                                style={{padding: 0}}>
                                <div
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        textDecoration: (apppointment.status == CANCELLED_STATUS ? 'line-through' : 'inherit'),
                                        backgroundColor: (apppointment.status == CANCELLED_STATUS ? '#aaa' : '#eee'),
                                        width: '100%',
                                        marginTop: '2px',
                                        borderLeft: '5px solid' + (apppointment.doctor && that.state.practice_doctors && that.state.practice_doctors[apppointment.doctor] ? that.props.doctors_object[apppointment.doctor].calendar_colour : 'transparent')
                                    }}>
                                    <AppointmentCard {...apppointment}
                                                    changeAppointmentStatus={this.changeAppointmentStatus}/>
                                </div>
                            </List.Item>)
                            }/>
                    </Col>
                </Row>
               
            </Card>

        )
    }
}
export default Form.create()(BlockCalendar);

function AppointmentCard(appointment) {
    return <div style={{width: '100%'}}>

        <p style={{marginBottom: 0}}>
        <Divider type="vertical" />
            <Popover placement="right"
                     content={<EventPatientPopover appointmentId={appointment.id}
                                                   key={appointment.id}/>}>
            <span
                style={{width: 'calc(100% - 60px)'}}><b>{moment(appointment.schedule_at).format("LLL")}</b>&nbsp;
                {appointment.patient.user.first_name}</span>
            <p style={{color:appointment.doctor_data ?appointment.doctor_data.calendar_colour:null}}><Divider type="vertical"/><span>{appointment.doctor_data ? appointment.doctor_data.user.first_name:null}</span></p>
            </Popover>
        </p>
    </div>;
}
