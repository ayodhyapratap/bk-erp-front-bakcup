import React from "react";
import {Button, Card, Col, Radio, Row,Select} from "antd";
import {PATIENT_GROUPS, PATIENTS_REPORTS} from "../../../constants/api";
import {AMOUNT_DUE_RELATED_REPORT} from "../../../constants/hardData";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {
    AGEING_AMOUNT_DUE,
    AMOUNT_DUE_PER_DOCTOR,
    AMOUNT_DUE_PER_PROCEDURE,
    TOTAL_AMOUNT_DUE, UNSETTLED_INVOICE
} from "../../../constants/dataKeys";
import TotalAmountDue from "./TotalAmountDue";
import AgeingAmountDue from "./AgeingAmountDue";
import AmountDuePerDoctor from "./AmountDuePerDoctor";
import AmountDuePerProcedure from "./AmountDuePerProcedure";
import UnsettledInvoice from "./UnsettledInvoice";
import AppointmentForEachDoctor from "../appointments/AppointmentForEachDoctor";


export default class AmountDueReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            sidePanelColSpan: 4,
            patientGroup:[],
            type:'all',
            loading:true,
            advancedOptionShow: true,

        }
        this.loadNewPatient = this.loadNewPatient.bind(this);
        this.loadPatientGroup = this.loadPatientGroup.bind(this);
    }
    componentDidMount() {
        this.loadNewPatient();
        this.loadPatientGroup();

    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                // if (this.state.type==NEW_PATIENTS){
                //     this.loadNewPatient();
                // }
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
    loadNewPatient() {
        let that = this;

        let successFn = function (data) {
            that.setState({
                report: data.results,
                total:data.count,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            type:this.state.type,
        }
        if(this.state.startDate){
            apiParams.from_date=this.state.startDate.format('YYYY-MM-DD');
            apiParams.to_date= this.state.endDate.format('YYYY-MM-DD');
        }

        getAPI(interpolate("PATIENTS_REPORTS", [this.props.active_practiceId]), successFn, errorFn,apiParams);
    }

    onChangeHandle = (type, value) => {
        let that = this;
        this.setState({
            [type]: value.target.value,
        })
    };
    advancedOption(value){
        this.setState({
            advancedOptionShow:value,
        })
    }
    changeSidePanelSize = (sidePanel) => {
        this.setState({
            sidePanelColSpan: sidePanel ? 0 : 4
        })
    };
    handleChangeOption = (type,value) => {
        let that = this;
        this.setState({
            [type]: value,
        })
    };
    render() {
        return <div>
            <h2>Amount Due Report <Button type="primary" shape="round"
                                        icon={this.state.sidePanelColSpan ? "double-right" : "double-left"}
                                        style={{float: "right"}}
                                        onClick={() => this.changeSidePanelSize(this.state.sidePanelColSpan)}>Panel</Button>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={(24 - this.state.sidePanelColSpan)}>

                        {this.state.type==TOTAL_AMOUNT_DUE?<TotalAmountDue {...this.state} {...this.props}/>:null}
                        {this.state.type==AGEING_AMOUNT_DUE?<AgeingAmountDue {...this.state} {...this.props}/>:null}
                        {this.state.type==AMOUNT_DUE_PER_DOCTOR?<AmountDuePerDoctor {...this.state} {...this.props}/>:null}
                        {this.state.type==AMOUNT_DUE_PER_PROCEDURE?<AmountDuePerProcedure {...this.state} {...this.props}/>:null}
                        {this.state.type==UNSETTLED_INVOICE?<UnsettledInvoice {...this.state} {...this.props}/>:null}

                    </Col>
                    <Col span={this.state.sidePanelColSpan}>
                        <Radio.Group buttonStyle="solid" defaultValue={TOTAL_AMOUNT_DUE} onChange={(value)=>this.onChangeHandle('type',value)}>
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={TOTAL_AMOUNT_DUE}>
                                Total Amount Due
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {AMOUNT_DUE_RELATED_REPORT.map((item) => <Radio.Button
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
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Patient Groups"
                                        onChange={(value)=>this.handleChangeOption('patient_groups',value)}>
                                    {this.state.patientGroup.map((item) => <Select.Option value={item.id}>
                                        {item.name}</Select.Option>)}
                                </Select>
                            </Col>
                        </>:<a href={'#'} onClick={(value)=>this.advancedOption(true)}>Show Advanced Options</a>}


                    </Col>
                </Row>
            </Card>
        </div>
    }
}
