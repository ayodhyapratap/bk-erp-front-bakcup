import React from "react";
import {Col, Divider, Row, Select, Statistic, Table} from "antd";
import {PAYMENT_REPORTS} from "../../../constants/api";
import {getAPI, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";

export default class PaymentReceivedEachPatientGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            report: [],
            mailingUsersList: []
        };
        this.loadPaymentsReport = this.loadPaymentsReport.bind(this);
    }

    componentDidMount() {
        this.loadPaymentsReport();
        loadMailingUserListForReportsMail(this);
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.patient_groups != newProps.patient_groups ||this.props.taxes!=newProps.taxes
            || this.props.doctors != newProps.doctors || this.props.payment_mode != newProps.payment_mode || this.props.consume != newProps.consume || this.props.exclude_cancelled != newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadPaymentsReport();
            })

    }

    loadPaymentsReport = () => {
        let that = this;
        that.setState({
            loading:true,
        });
        let successFn = function (data) {
            that.setState({
                report: data.data,
                total: data.total,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams = {
            type: that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            exclude_cancelled: this.props.exclude_cancelled ? true : false,
        };
        if (this.props.taxes){
            apiParams.taxes=this.props.taxes.toString();
        }
        if (this.props.patient_groups) {
            apiParams.patient_groups = this.props.patient_groups.toString();
        }
        if (this.props.payment_mode) {
            apiParams.payment_mode = this.props.payment_mode.toString();
        }
        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }
        if (this.props.consume) {
            apiParams.consume = this.props.consume.toString();
        }
        getAPI(interpolate(PAYMENT_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };

    sendMail = (mailTo) => {
        let that = this
        let {startDate, endDate} = this.state;
        let {active_practiceId, type} = this.props;
        let apiParams = {
            practice:active_practiceId,
            type:type,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
        };


        apiParams.mail_to = mailTo;
        sendReportMail(interpolate(PAYMENT_REPORTS, [that.props.active_practiceId]), apiParams);
    };

    render() {
        let that = this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'sno',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        }];

        return <div>
            <h2>Payment Received Each Patient Group
                <span style={{float: 'right'}}>
                    <p><small>E-Mail To:&nbsp;</small>
                        <Select onChange={(e) => this.sendMail(e)} style={{width: 200}}>
                            {this.state.mailingUsersList.map(item => <Select.Option
                                value={item.email}>{item.name}</Select.Option>)}
                        </Select>
                    </p>
                </span>
            </h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign: "center"}}>
                    {/*<Statistic title="Total Appointments" value={this.state.total}/>*/}
                    <br/>
                </Col>
            </Row>

            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>

        </div>
    }
}
