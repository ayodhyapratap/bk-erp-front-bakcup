import React from "react";
import {Button, Card, Checkbox, Col, Radio, Row, Select} from "antd";
import {EXPENSE_TYPE, PATIENT_GROUPS, PAYMENT_MODES, VENDOR_API} from "../../../constants/api";
import {getAPI, interpolate} from "../../../utils/common";
import {PAYMENT_RELATED_REPORT, SCHEDULE_OF_PAYMENT, TYPE_OF_CONSUMPTION} from "../../../constants/hardData";
import {ALL_EXPENSES} from "../../../constants/dataKeys";
import AllPayments from "./AllPayments";
import {loadDoctors} from "../../../utils/clinicUtils";

export default class PaymentsReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advancedOptionShow: true,
            paymentModeOption: [],
            sidePanelColSpan: 4,
            type: 'ALL',
            practiceDoctors: [],
            patientGroup: [],
            vendorOption: [],
        };
        loadDoctors(this);
        this.loadPatientGroup = this.loadPatientGroup.bind(this);
        this.loadPaymentMode = this.loadPaymentMode.bind(this);
    }

    componentDidMount() {
        this.loadPatientGroup();
        this.loadPaymentMode();
    }

    loadPatientGroup() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientGroup: data,
            });
        };
        let errorFn = function () {

        }
        getAPI(interpolate(PATIENT_GROUPS, [this.props.active_practiceId]), successFn, errorFn)
    }

    loadPaymentMode() {
        let that = this;
        let successFun = function (data) {
            that.setState({
                paymentModeOption: data,
            })
        };
        let errorFn = function () {

        };
        getAPI(interpolate(PAYMENT_MODES, [this.props.active_practiceId]), successFun, errorFn);
    }

    onChangeHandle = (type, value) => {
        let that = this;
        this.setState({
            [type]: value.target.value,
        })
    };

    advancedOption(value) {
        this.setState({
            advancedOptionShow: value,
        })
    }

    changeSidePanelSize = (sidePanel) => {
        this.setState({
            sidePanelColSpan: sidePanel ? 0 : 4
        })
    };
    handleChangeOption = (type, value) => {
        let that = this;
        this.setState({
            [type]: value,
        })
    };
    onChangeCheckbox = (e) => {
        this.setState({
            exclude_cancelled: !this.state.exclude_cancelled,
        });
    };

    render() {
        return <div>
            <h2>Payments Report <Button type="primary" shape="round"
                                        icon={this.state.sidePanelColSpan ? "double-right" : "double-left"}
                                        style={{float: "right"}}
                                        onClick={() => this.changeSidePanelSize(this.state.sidePanelColSpan)}>Panel</Button>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={(24 - this.state.sidePanelColSpan)}>

                        {this.state.type == ALL_EXPENSES ?
                            <AllPayments {...this.props} {...this.state}/> : null}

                    </Col>


                    <Col span={this.state.sidePanelColSpan}>
                        <Radio.Group buttonStyle="solid" defaultValue={ALL_EXPENSES}
                                     onChange={(value) => this.onChangeHandle('type', value)}>
                            <h2>Payments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={ALL_EXPENSES}>
                                All Payments
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {PAYMENT_RELATED_REPORT.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>

                        <br/>
                        <br/>
                        {this.state.advancedOptionShow ? <>
                            <Button type="link" onClick={(value) => this.advancedOption(false)}>Hide Advanced
                                Options </Button>
                            <Col> <br/>
                                <h4>Show</h4>
                                <Checkbox.Group style={{width: '100%', display: "inline-grid"}}
                                                onChange={(value) => this.handleChangeOption('consume', value)}>
                                    {/*<Row>*/}
                                    {SCHEDULE_OF_PAYMENT.map((item) => <Checkbox
                                        value={item.value}> {item.label}</Checkbox>)}
                                    {/*</Row>*/}
                                </Checkbox.Group>
                                <br/>
                                <br/>
                                <h4>Doctors</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Doctors"
                                        onChange={(value) => this.handleChangeOption('doctors', value)}>
                                    {this.state.practiceDoctors.map((item) => <Select.Option value={item.id}>
                                        {item.user.first_name}</Select.Option>)}
                                </Select>
                                <br/>
                                <br/>
                                <h4>Patient Groups</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Patient Groups"
                                        onChange={(value) => this.handleChangeOption('patient_groups', value)}>
                                    {this.state.patientGroup.map((item) => <Select.Option value={item.id}>
                                        {item.name}</Select.Option>)}
                                </Select>
                                <br/>
                                <br/>
                                <h4>Payment Modes</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Payment Modes"
                                        onChange={(value) => this.handleChangeOption('payment_mode', value)}>
                                    {this.state.paymentModeOption.map((item) => <Select.Option value={item.id}>
                                        {item.mode}</Select.Option>)}
                                </Select>
                                <br/>
                                <br/>
                                <Checkbox onChange={(e) => this.onChangeCheckbox(e)}> Exclude Cancelled</Checkbox>

                            </Col>
                        </> : <Button type="link" onClick={(value) => this.advancedOption(true)}>Show Advanced
                            Options </Button>}

                    </Col>

                </Row>
            </Card>
        </div>
    }
}
