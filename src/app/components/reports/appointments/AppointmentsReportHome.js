import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {APPOINTMENT_REPORTS} from "../../../constants/api";
import {ALL_APPOINTMENT,APPOINTMENT_FOR_EACH_CATEGORY ,CANCELLATION_NUMBERS,AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE,AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE,
    REASONS_FOR_CANCELLATIONS,DAILY_APPOINTMENT_COUNT,APPOINTMENT_FOR_EACH_DOCTOR, MONTHLY_APPOINTMENT_COUNT,APPOINTMENT_FOR_EACH_PATIENT_GROUP}
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


export default class AppointmentsReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentReports: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            filterReport:'all',
        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
        this.loadAppointmentReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentReport();
            })

    }

    loadAppointmentReport = () => {
        let that = this;
        this.setState({
            loading:true
        })
        let successFn = function (data) {
            console.log(data);
            that.setState({
                appointmentReports: data.data,
                loading: false
            });
            console.log(that.state.appointmentReports);
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(APPOINTMENT_REPORTS, [this.props.active_practiceId]), successFn, errorFn, {
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        });
    }

    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        },function () {
            that.loadAppointmentReport();
        })
    }

    render() {
        let that=this;



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
                       {this.state.filterReport == ALL_APPOINTMENT ?< AllAppointments {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == APPOINTMENT_FOR_EACH_CATEGORY?<AppointmentByCategory {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == APPOINTMENT_FOR_EACH_DOCTOR?<AppointmentForEachDoctor {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == APPOINTMENT_FOR_EACH_PATIENT_GROUP?<AppointmentForEachPatientGroup {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE?<AverageWaitingOrEngagedTimeDayWise {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE?<AverageWaitingOrEngagedTimeMonthWise {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == CANCELLATION_NUMBERS?<CancellationsNumbers {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == DAILY_APPOINTMENT_COUNT?<DailyAppointmentCount {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport == MONTHLY_APPOINTMENT_COUNT?<MonthlyAppointmentCount {...this.props} filterReport={this.state.filterReport}/>:null}
                       {this.state.filterReport==REASONS_FOR_CANCELLATIONS?<ReasonsForCancellations {...this.props} filterReport={this.state.filterReport}/>:null}

                    </Col>
                    <Col span={6}>
                        <Radio.Group buttonStyle="solid" defaultValue="all"  onChange={(value)=>this.onChangeHandle('filterReport',value)}>
                            <h2>Appointments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
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
                    </Col>
                </Row>
            </Card>
        </div>
    }
}
