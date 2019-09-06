import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table, Divider,Select} from "antd";
import {PATIENTS_REPORTS ,PATIENT_GROUPS,OFFERS} from "../../../constants/api";
import {
    NEW_PATIENTS,
    DAILY_NEW_PATIENTS,
    PATIENTS_FIRST_APPOINTMENT,
    MONTHLY_NEW_PATIENTS,
    NEW_MEMBERSHIP,
    EXPIRING_MEMBERSHIP
} from "../../../constants/dataKeys";
import {PATIENTS_RELATED_REPORT} from "../../../constants/hardData";
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
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            type: 'DETAILED',
            loading: true,
            advancedOptionShow: true,
            sidePanelColSpan: 4,
            patientGroup:[],
            patient_groups:'',
            offerOption:[],
        }
        this.loadNewPatient = this.loadNewPatient.bind(this);
        this.loadPatientGroup = this.loadPatientGroup.bind(this);
        this.loadOffer = this.loadOffer.bind(this);
    }

    componentDidMount() {
        if (this.state.type == NEW_PATIENTS) {
            this.loadNewPatient();
        }
        this.loadPatientGroup();
        this.loadOffer();

    }

    componentWillReceiveProps(newProps) {

        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.state.patient_groups !=newProps.patient_groups
            ||this.state.blood_group !=newProps.blood_group || this.state.offer !=newProps.offer)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                if (this.state.type == NEW_PATIENTS) {
                    this.loadNewPatient();
                }
            })
    }
    loadPatientGroup(){
        let that=this;
        let successFn =function (data) {
            that.setState({
                patientGroup:data,
            });
        };
        let errorFn=function () {

        }
        getAPI(interpolate(PATIENT_GROUPS,[this.props.active_practiceId]),successFn ,errorFn)
    }
    loadOffer(){
        let that=this;
        let successFun=function (data) {
            that.setState({
                offerOption:data,
            })
        };
        let errorFn =function () {

        }
        getAPI(interpolate(OFFERS ,[this.props.active_practiceId]),successFun,errorFn);
    }
    loadNewPatient() {
        let that = this;

        let successFn = function (data) {
            that.setState({
                report: data.results,
                total: data.count,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams = {
            type: this.state.type,
        }

        if(this.state.patient_groups){
            apiParams.groups=this.state.patient_groups;
        }
        if (this.state.startDate) {
            apiParams.from_date = this.state.startDate.format('YYYY-MM-DD');
            apiParams.to_date = this.state.endDate.format('YYYY-MM-DD');
        }

        getAPI(PATIENTS_REPORTS, successFn, errorFn, apiParams);
    }

    onChangeHandle = (type, value) => {
        let that = this;
        this.setState({
            [type]: value.target.value,
        })
    }
    advancedOption(value){
        this.setState({
            advancedOptionShow:value,
        })
    }
    changeSidePanelSize = (sidePanel) => {
        this.setState({
            sidePanelColSpan: sidePanel ? 0 : 4
        })
    }
    handleChangeOption = (type,value) => {
        let that = this;
        this.setState({
            [type]: value,
        })
    }
    render() {
        return <div>
            <h2>Patients Report <Button type="primary" shape="round"
                                        icon={this.state.sidePanelColSpan ? "double-right" : "double-left"}
                                        style={{float: "right"}}
                                        onClick={() => this.changeSidePanelSize(this.state.sidePanelColSpan)}>Panel</Button>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={(24 - this.state.sidePanelColSpan)}>

                        {this.state.type == NEW_PATIENTS ?
                            <NewPatientReports {...this.props} type={NEW_PATIENTS} {...this.state}/> : null}

                        {this.state.type == DAILY_NEW_PATIENTS ? <DailyNewPatientReports {...this.state}/> : null}

                        {this.state.type == EXPIRING_MEMBERSHIP ?
                            <ExpiringMembership {...this.props} type={this.state.type}/> : null}
                        {this.state.type == PATIENTS_FIRST_APPOINTMENT ?
                            <PatientsFirstAppointment {...this.props} type={this.state.type}/> : null}
                        {this.state.type == MONTHLY_NEW_PATIENTS ?
                            <MonthlyNewPatients  {...this.props} type={this.state.type}/> : null}
                        {this.state.type == NEW_MEMBERSHIP ?
                            <NewMembership  {...this.props} type={this.state.type}/> : null}

                    </Col>


                    <Col span={this.state.sidePanelColSpan} >
                        <Radio.Group buttonStyle="solid" defaultValue={NEW_PATIENTS}
                                     onChange={(value) => this.onChangeHandle('type', value)}>
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={NEW_PATIENTS}>
                                New Patients
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {PATIENTS_RELATED_REPORT.map((item) => <Radio.Button
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
                                <h4>Patient Groups</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple"
                                        onChange={(value)=>this.handleChangeOption('patient_groups',value)}>
                                    {this.state.patientGroup.map((item) => <Select.Option value={item.id}>
                                        {item.name}</Select.Option>)}
                                </Select>

                                <br/>
                                <h4>Blood Groups</h4>
                                <Select style={{minWidth: '200px'}}
                                        onChange={(value)=>this.handleChangeOption('offer',value)}>
                                    {this.state.offerOption.map((item) => <Select.Option value={item.code}>
                                        {item.code}</Select.Option>)}
                                </Select>

                                {/*<br/>*/}
                                {/*<h4>Referre</h4>*/}
                                {/*<Select style={{minWidth: '200px'}} mode="multiple"*/}
                                {/*        onChange={(value)=>this.handleChangeOption('blood_group',value)}>*/}
                                {/*    {this.state.bloodGroup.map((item) => <Select.Option value={item.id}>*/}
                                {/*        {item.name}</Select.Option>)}*/}
                                {/*</Select>*/}


                                {/*<br/>*/}
                                {/*<h4>Offer Applied</h4>*/}
                                {/*<Select style={{minWidth: '200px'}}*/}
                                {/*        onChange={(value)=>this.handleChangeOption('referrer',value)}>*/}
                                {/*    {this.state.referrerOption.map((item) => <Select.Option value={item.id}>*/}
                                {/*        {item.name}</Select.Option>)}*/}
                                {/*</Select>*/}
                            </Col>
                        </>:<a href={'#'} onClick={(value)=>this.advancedOption(true)}>Show Advanced Options</a>}
                    </Col>

                </Row>
            </Card>
        </div>
    }
}
