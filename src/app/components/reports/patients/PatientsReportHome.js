import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table, Divider,Select} from "antd";
import {PATIENTS_REPORTS ,PATIENT_GROUPS,OFFERS} from "../../../constants/api";
import {
    NEW_PATIENTS,
    DAILY_NEW_PATIENTS,
    PATIENTS_FIRST_APPOINTMENT,
    MONTHLY_NEW_PATIENTS,
    NEW_MEMBERSHIP,
    EXPIRING_MEMBERSHIP, ACTIVE_PATIENTS
} from "../../../constants/dataKeys";
import {BLOOD_GROUPS, PATIENTS_RELATED_REPORT} from "../../../constants/hardData";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import DailyNewPatientReports from "./DailyNewPatientsReports";
import ExpiringMembership from "./ExpiringMembership";
import MonthlyNewPatients from "./MonthlyNewPatients";
import NewMembership from "./NewMembership";
import NewPatientReports from "./NewPatientReport";
import PatientsFirstAppointment from "./PatientsFirstAppointment";
import ActivePatients from "./ActivePatients";

export default class PatientsReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'DETAILED',
            advancedOptionShow: true,
            sidePanelColSpan: 4,
            patientGroup:[],
            offerOption:[],
        }
        this.loadPatientGroup = this.loadPatientGroup.bind(this);
    }

    componentDidMount() {
        this.loadPatientGroup();
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
    // loadOffer(){
    //     let that=this;
    //     let successFun=function (data) {
    //         that.setState({
    //             offerOption:data,
    //         })
    //     };
    //     let errorFn =function () {
    //
    //     }
    //     getAPI(interpolate(OFFERS ,[this.props.active_practiceId]),successFun,errorFn);
    // }

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
                            <NewPatientReports {...this.props}  {...this.state}/> : null}

                        {this.state.type == DAILY_NEW_PATIENTS ?
                            <DailyNewPatientReports {...this.props} {...this.state}/> : null}

                        {this.state.type == EXPIRING_MEMBERSHIP ?
                            <ExpiringMembership {...this.props} {...this.state} /> : null}
                        {this.state.type == PATIENTS_FIRST_APPOINTMENT ?
                            <PatientsFirstAppointment {...this.props} {...this.state}/> : null}
                        {this.state.type == MONTHLY_NEW_PATIENTS ?
                            <MonthlyNewPatients  {...this.props} {...this.state}/> : null}
                        {this.state.type == NEW_MEMBERSHIP ?
                            <NewMembership  {...this.props} {...this.state}/> :null}

                        {this.state.type == ACTIVE_PATIENTS ?
                            <ActivePatients  {...this.props} {...this.state}/> : null}

                    </Col>


                    <Col span={this.state.sidePanelColSpan}>
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
                        {this.state.type == NEW_PATIENTS || this.state.type == DAILY_NEW_PATIENTS ||this.state.type == MONTHLY_NEW_PATIENTS || this.state.type == ACTIVE_PATIENTS ?<>
                            {this.state.advancedOptionShow?<>
                                <Button type="link" onClick={(value)=>this.advancedOption(false)}>Hide Advanced Options </Button>
                                <Col> <br/>
                                    <h4>Patient Groups</h4>
                                    <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Patient Groups"
                                            onChange={(value)=>this.handleChangeOption('patient_groups',value)}>
                                        {this.state.patientGroup.map((item) => <Select.Option value={item.id}>
                                            {item.name}</Select.Option>)}
                                    </Select>

                                    <br/>
                                    <h4>Blood Groups</h4>
                                    <Select style={{minWidth: '200px'}} placeholder="Select Blood Group"
                                            onChange={(value)=>this.handleChangeOption('blood_group',value)}>
                                        {BLOOD_GROUPS.map((item) => <Select.Option value={item.value}>
                                            {item.name}</Select.Option>)}
                                    </Select>

                                </Col>
                            </>: <Button type="link" onClick={(value)=>this.advancedOption(true)}>Show Advanced Options </Button>}
                            </>:null}
                    </Col>

                </Row>
            </Card>
        </div>
    }
}
