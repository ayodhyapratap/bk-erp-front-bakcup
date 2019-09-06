import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Select, Checkbox} from "antd";
import {APPOINTMENT_REPORTS, APPOINTMENT_CATEGORIES, PRACTICESTAFF} from "../../../constants/api";
import {
    ALL_APPOINTMENT,
    APPOINTMENT_FOR_EACH_CATEGORY,
    CANCELLATION_NUMBERS,
    AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE,
    AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE,
    REASONS_FOR_CANCELLATIONS,
    DAILY_APPOINTMENT_COUNT,
    APPOINTMENT_FOR_EACH_DOCTOR,
    MONTHLY_APPOINTMENT_COUNT,
    APPOINTMENT_FOR_EACH_PATIENT_GROUP,
    NEW_PATIENTS, DOCTORS_ROLE
}
    from "../../../constants/dataKeys";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {APPOINTMENT_RELATED_REPORT} from "../../../constants/hardData";
import moment from "moment"
import AllAppointments from "./AllAppointments";
import AppointmentByCategory from "./AppointmentByCategory";
import AppointmentForEachDoctor from "./AppointmentForEachDoctor";
import AppointmentForEachPatientGroup from "./AppointmentForEachPatientGroup";
import AverageWaitingOrEngagedTimeDayWise from "./AverageWaitingOrEngagedTimeDayWise";
import AverageWaitingOrEngagedTimeMonthWise from "./AverageWaitingOrEngagedTimeMonthWise";
import CancellationsNumbers from "./CancellationsNumbers";
import DailyAppointmentCount from "./DailyAppointmentCount";
import MonthlyAppointmentCount from './MonthlyAppointmentCount'
import ReasonsForCancellations from "./ReasonsForCancellations";
import { loadDoctors } from "../../../utils/clinicUtils";


export default class AppointmentsReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentReports: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            type:'all',
            advancedOptionShow: true,
            appointmentCategory:[],
            categories:'',
            practiceDoctors:[],


        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
        this.loadAppointmentCategory = this.loadAppointmentCategory.bind(this);
        loadDoctors(this);

    }
    componentDidMount() {
        if (this.state.type == ALL_APPOINTMENT){
            this.loadAppointmentReport();

        }
        this.loadAppointmentCategory();

    }
    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.categories !=newProps.categories )
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                if (this.state.type==ALL_APPOINTMENT){
                    that.loadAppointmentReport();
                }

            })

    }

    loadAppointmentCategory(){
        let that=this;
        let successFn=function (data) {
            that.setState({
                appointmentCategory:data,
            })
        };
        let errorFn=function () {

        }
        getAPI(interpolate(APPOINTMENT_CATEGORIES,[this.props.active_practiceId]),successFn ,errorFn);
    };

    loadAppointmentReport = () => {
        let that = this;
        this.setState({
            loading:true
        })
        let successFn = function (data) {
            that.setState({
                appointmentReports: data.data,
                total:data.total,
                loading: false
            });

        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        };
        if (this.state.exclude_cancelled){
            apiParams.exclude_cancelled=this.state.exclude_cancelled;
        }
        getAPI(interpolate(APPOINTMENT_REPORTS, [this.props.active_practiceId]), successFn, errorFn, apiParams);
    };

    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        });
    }
    advancedOption(value){
        this.setState({
            advancedOptionShow:value,
        })
    }
    handleChangeOption = (type,value) => {
        let that = this;
        this.setState({
            [type]: value,
        })
    }
    onChangeCheckbox=(e)=>{
        this.setState({
            exclude_cancelled: !this.state.exclude_cancelled,
        });
    };
    render() {
        console.log("stae",this.state)
        return <div>
            <h2>Appointments Report
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={18}>
                       {this.state.type == ALL_APPOINTMENT ?
                           < AllAppointments {...this.state}/>:null}
                       {this.state.type == APPOINTMENT_FOR_EACH_CATEGORY?
                           <AppointmentByCategory {...this.state} />:null}

                       {this.state.type == APPOINTMENT_FOR_EACH_DOCTOR?<AppointmentForEachDoctor {...this.props} type={this.state.type}/>:null}
                       {this.state.type == APPOINTMENT_FOR_EACH_PATIENT_GROUP?<AppointmentForEachPatientGroup {...this.props} type={this.state.type}/>:null}
                       {this.state.type == AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE?<AverageWaitingOrEngagedTimeDayWise {...this.props} type={this.state.type}/>:null}
                       {this.state.type == AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE?<AverageWaitingOrEngagedTimeMonthWise {...this.props} type={this.state.type}/>:null}
                       {this.state.type == CANCELLATION_NUMBERS?<CancellationsNumbers {...this.props} type={this.state.type}/>:null}
                       {this.state.type == DAILY_APPOINTMENT_COUNT?<DailyAppointmentCount {...this.props} type={this.state.type}/>:null}
                       {this.state.type == MONTHLY_APPOINTMENT_COUNT?<MonthlyAppointmentCount {...this.props} type={this.state.type}/>:null}
                       {/*{this.state.type==REASONS_FOR_CANCELLATIONS?<ReasonsForCancellations {...this.props} type={this.state.type}/>:null}*/}

                    </Col>
                    <Col span={6}>
                        <Radio.Group buttonStyle="solid" defaultValue={ALL_APPOINTMENT}  onChange={(value)=>this.onChangeHandle('type',value)}>
                            <h2>Appointments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={ALL_APPOINTMENT}>
                                All Appointemnts
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {APPOINTMENT_RELATED_REPORT.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>


                        <br/>
                        <br/>
                        {this.state.advancedOptionShow?<>
                            <a href={'#'} onClick={(value)=>this.advancedOption(false)}>Hide Advanced Options</a>
                            <Col> <br/>
                                <h4>Doctors</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple"
                                        onChange={(value)=>this.handleChangeOption('doctors',value)}>
                                    {this.state.practiceDoctors.map((item) => <Select.Option value={item.id}>
                                        {item.user.first_name}</Select.Option>)}
                                </Select>

                                <br/>
                                <br/>
                                <h4>Appointment Categories</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple"
                                        onChange={(value)=>this.handleChangeOption('categories',value)}>
                                    {this.state.appointmentCategory.map((item) => <Select.Option value={item.id}>
                                        {item.name}</Select.Option>)}
                                </Select>
                                {/*<h4>Offer Applied</h4>*/}
                                {/*<Select style={{minWidth: '200px'}}*/}
                                {/*        onChange={(value)=>this.handleChangeOption('referrer',value)}>*/}
                                {/*    {this.state.referrerOption.map((item) => <Select.Option value={item.id}>*/}
                                {/*        {item.name}</Select.Option>)}*/}
                                {/*</Select>*/}

                                <br/>
                                <br/>
                                <Checkbox  onChange={(e)=>this.onChangeCheckbox(e)}>Checkbox</Checkbox>
                            </Col>
                        </>:<a href={'#'} onClick={(value)=>this.advancedOption(true)}>Show Advanced Options</a>}

                    </Col>
                </Row>
            </Card>
        </div>
    }
}
