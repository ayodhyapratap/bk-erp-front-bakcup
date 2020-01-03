import React from "react";
import {Col, Row, Select} from "antd";
import {MLM_Reports} from "../../../constants/api";
import {getAPI } from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";

export default class ProductWiseReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            mailingUsersList: []
        }
        this.loadMlmReport = this.loadMlmReport.bind(this);
    }
    componentDidMount() {
        this.loadMlmReport();
        loadMailingUserListForReportsMail(this);
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.agents!=newProps.agents)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadMlmReport();
            })

    }

    loadMlmReport() {
        let that = this;
        this.setState({
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
            practice:that.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };
        if(this.props.agents){
            apiParams.agents=this.props.agents.toString();
        }
        getAPI(MLM_Reports , successFn, errorFn, apiParams);
    }

    sendMail = (mailTo) => {
        let that = this;
        let apiParams={
            practice:that.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };
        if(this.props.agents){
            apiParams.agents=this.props.agents.toString();
        }
        apiParams.mail_to = mailTo;
        sendReportMail(MLM_Reports, apiParams)
    };

    render() {
        const {report} =this.state;
        const reportData = [];
        for (let i = 1; i <= report.length; i++) {
            reportData.push({s_no: i,...report[i-1]});
        };

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            width: 50
        },{
            title: 'Date',
            key: 'date',
            dataIndex:'date',
            render: (text, record) => (
                <span>
                {moment(record.expense_date).format('DD MMM YYYY')}
                  </span>
            ),
            export:(item,record)=>(moment(record.expense_date).format('ll')),
        }, {
            title: '	Expense Type',
            dataIndex: 'expense_type.name',
            key: 'name',
            export:(item,record)=>(record.expense_type.name),
        }, {
            title: 'Expense Amount (INR)',
            dataIndex: 'amount',
            key: 'amount',
        }, {
            title: 'Mode Of Payment',
            dataIndex: 'payment_mode.mode',
            key: 'payment_mode',
            export:(item,record)=>(record.payment_mode.mode),
        }, {
            title: 'Vendor',
            dataIndex: 'vendor.name',
            key: 'vendor.name',
            export:(item,record)=>(record.vendor.name),
        }, {
            title: 'Notes',
            dataIndex: 'remark',
            key: 'remark',
        }];
        // var totalAmount = this.state.report.reduce(function(prev, cur) {
        //     return prev + cur.amount;
        // }, 0);
        return <div>
            <h2>MLM Report

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
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    {/*<Statistic title="Total Expense (INR)" value={totalAmount} />*/}
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
