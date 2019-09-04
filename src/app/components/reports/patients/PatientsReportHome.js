import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {NEW_PATIENTS,DAILY_NEW_PATIENTS,PATIENTS_FIRST_APPOINTMENT,MONTHLY_NEW_PATIENTS,NEW_MEMBERSHIP,EXPIRING_MEMBERSHIP} from "../../../constants/dataKeys"
import {PATIENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {hideMobile} from "../../../utils/permissionUtils";

import DailyNewPatientReports from "./DailyNewPatientsReports";
import ExpiringMembership from "./ExpiringMembership";
import MonthlyNewPatients from "./MonthlyNewPatients";
import NewMembership from "./NewMembership";
import NewPatientReports from "./NewPatientReport";
import PatientsFirstAppointment from "./PatientsFirstAppointment";

export default class PatientsReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            filterReport:'all',
            top: 10,
        }
        this.report = this.report.bind(this);
        this.report();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.report();
            })
    }

    report() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report: data.data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={

        }
        if(this.state.startDate){
            apiParams.start=this.state.startDate.format('YYYY-MM-DD');
            apiParams.end= this.state.endDate.format('YYYY-MM-DD');
        }
        if(this.state.filter){
            apiParams.filetr=this.state.filter;
        }
        getAPI(interpolate(PATIENTS_REPORTS, [this.props.active_practiceId]), successFn, errorFn,apiParams);
    }
    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        },function () {
            that.report();
        })
    }
    render() {
        let that = this;
        const columns = [{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.created_at).format('LL')}
                  </span>
            ),
        }, {
            title: 'Scheduled At',
            key: 'time',
            render: (text, record) => (
                <span>
                  {moment(record.created_at).format('HH:mm')}
                  </span>
            ),
        }, {
            title: 'Name',
            dataIndex: 'patient.user.first_name',
            key: 'patient.user.first_name',
        }, {
            title: 'Patient Number',
            dataIndex: 'patient.user.mobile',
            key: 'patient.user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value)
        },];


        const relatedReport = [
            {name: 'Daily New Patients', value: DAILY_NEW_PATIENTS},
            {name: 'Expiring Membership', value: EXPIRING_MEMBERSHIP},
            {name: 'Patients First Appointment', value: PATIENTS_FIRST_APPOINTMENT},
            {name: 'Monthly New Patients', value: MONTHLY_NEW_PATIENTS},
            {name: 'New Membership', value: NEW_MEMBERSHIP},
        ]
        return <div>
            <h2>Patients Report</h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                        {this.state.filterReport=='all'?
                            <NewPatientReports {...this.props} filterReport={this.state.filterReport}/>:null}

                        {this.state.filterReport== DAILY_NEW_PATIENTS?<DailyNewPatientReports {...this.props} filterReport={this.state.filterReport}/>:null}

                        {this.state.filterReport == EXPIRING_MEMBERSHIP?<ExpiringMembership {...this.props} filterReport={this.state.filterReport}/>:null}
                        {this.state.filterReport == PATIENTS_FIRST_APPOINTMENT?<PatientsFirstAppointment {...this.props} filterReport={this.state.filterReport}/>:null}
                        {this.state.filterReport == MONTHLY_NEW_PATIENTS?<MonthlyNewPatients  {...this.props} filterReport={this.state.filterReport}/>:null}
                        {this.state.filterReport == NEW_MEMBERSHIP ?<NewMembership  {...this.props} filterReport={this.state.filterReport}/>:null}

                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue="all" onChange={(value)=>this.onChangeHandle('filterReport',value)}>
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                New Patients
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {relatedReport.map((item) => <Radio.Button
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
