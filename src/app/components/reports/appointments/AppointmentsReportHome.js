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
    NEW_PATIENTS, DOCTORS_ROLE, APPOINTMENT_FOR_PATIENT_CONVERSION
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
import {loadDoctors, loadMailingUserListForReportsMail} from "../../../utils/clinicUtils";
import Patient_Conversion from "./PatientConversion";


export default class AppointmentsReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidePanelColSpan: 4,
            appointmentReports: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            type:'ALL',
            advancedOptionShow: true,
            appointmentCategory:[],
            categories:'',
            practiceDoctors:[],
        };
        this.loadAppointmentCategory = this.loadAppointmentCategory.bind(this);


    }
    componentDidMount() {
        this.loadAppointmentCategory();
        loadDoctors(this);
    }
    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
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

    changeSidePanelSize = (sidePanel) => {
        this.setState({
            sidePanelColSpan: sidePanel ? 0 : 4
        })
    }
    render() {
        return <div>
            <h2>Appointments Report <Button type="primary" shape="round"
                                        icon={this.state.sidePanelColSpan ? "double-right" : "double-left"}
                                        style={{float: "right"}}
                                        onClick={() => this.changeSidePanelSize(this.state.sidePanelColSpan)}>Panel</Button>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={(24 - this.state.sidePanelColSpan)}>
                       {this.state.type == ALL_APPOINTMENT?
                           <AllAppointments type={ALL_APPOINTMENT} {...this.state} {...this.props}/>:null}
                       {this.state.type == APPOINTMENT_FOR_EACH_CATEGORY?
                           <AppointmentByCategory {...this.state} {...this.props} />:null}

                       {this.state.type == APPOINTMENT_FOR_EACH_DOCTOR?<AppointmentForEachDoctor {...this.state} {...this.props}/>:null}
                       {this.state.type == APPOINTMENT_FOR_EACH_PATIENT_GROUP?<AppointmentForEachPatientGroup {...this.state} {...this.props}/>:null}
                       {this.state.type == AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE?<AverageWaitingOrEngagedTimeDayWise {...this.state} {...this.props}/>:null}
                       {this.state.type == AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE?<AverageWaitingOrEngagedTimeMonthWise {...this.state} {...this.props}/>:null}
                       {this.state.type == CANCELLATION_NUMBERS?<CancellationsNumbers {...this.state} {...this.props}/>:null}
                       {this.state.type == DAILY_APPOINTMENT_COUNT?<DailyAppointmentCount {...this.state} {...this.props}/>:null}
                       {this.state.type == MONTHLY_APPOINTMENT_COUNT?<MonthlyAppointmentCount {...this.state} {...this.props}/>:null}
                       {this.state.type==APPOINTMENT_FOR_PATIENT_CONVERSION?<Patient_Conversion {...this.props} {...this.state}/>:null}

                    </Col>
                    <Col span={this.state.sidePanelColSpan}>
                        <Radio.Group buttonStyle="solid" defaultValue={ALL_APPOINTMENT}  onChange={(value)=>this.onChangeHandle('type',value)}>
                            <h2>Appointments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={ALL_APPOINTMENT}>
                                All Appointemnts
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {APPOINTMENT_RELATED_REPORT.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>


                        <br/>
                        <br/>
                        {this.state.advancedOptionShow?<>
                            <Button type="link" onClick={(value)=>this.advancedOption(false)}>Hide Advanced Options </Button>
                            <Col> <br/>
                                <h4>Doctors</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Doctors"
                                        onChange={(value)=>this.handleChangeOption('doctors',value)}>
                                    {this.state.practiceDoctors.map((item) => <Select.Option value={item.id}>
                                        {item.user.first_name}</Select.Option>)}
                                </Select>

                                <br/>
                                <br/>
                                <h4>Appointment Categories</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Category"
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
                                <Checkbox  onChange={(e)=>this.onChangeCheckbox(e)}> Exclude Cancelled</Checkbox>
                            </Col>
                        </>:<Button type="link" onClick={(value)=>this.advancedOption(true)}>Show Advanced Options </Button>}

                    </Col>
                </Row>
            </Card>
        </div>
    }
}
