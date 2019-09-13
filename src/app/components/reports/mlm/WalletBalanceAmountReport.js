import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Statistic, Table} from "antd";
import {MLM_Agent_Wallet} from "../../../constants/api";
import {getAPI } from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";

export default class WalletBalanceAmountReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadMlmReport = this.loadMlmReport.bind(this);
    }
    componentDidMount() {
        this.loadMlmReport();
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
                report: data,
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
        getAPI(MLM_Agent_Wallet , successFn, errorFn, apiParams);
    }


    render() {
        let that=this;
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'sno',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
            title: 'Agent Name',
            dataIndex: 'patient.user.first_name',
            key: 'name',
            export:(item,record)=>(record.patient.user.first_name),
        },{
            title: 'Mobile Number',
            key: 'patient.user.mobile',
            dataIndex:'patient.user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value),
            export:(item ,record)=>(record.patient.user.mobile),
        },{
            title: 'Email',
            key: 'patient.user.email',
            dataIndex:'patient.user.email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value),
            export:(item ,record)=>(record.patient.user.email),
        },{
            title:'Gender',
            key:'gender',
            dataIndex:'patient.gender',
            export:(item ,record)=>(record.patient.gender),
        }, {
            title: 'Refundable Amount',
            dataIndex: 'refundable_amount',
            key: 'refundable_amount',
            render:(item,record)=><span>{record.refundable_amount?record.refundable_amount.toFixed(2) :'0.00'}</span>,
        }, {
            title: 'Non Refundable Amount',
            dataIndex: 'non_refundable',
            key: 'non_refundable',
            render:(item,record)=><span>{record.non_refundable?record.non_refundable.toFixed(2) :'0.00'}</span>,
        }];
        var total_refundable_Amount = this.state.report.reduce(function(prev, cur) {
            return prev + cur.refundable_amount;
        }, 0);

        var total_Non_refundable_Amount = this.state.report.reduce(function(prev, cur) {
            return prev + cur.non_refundable;
        }, 0);
        return <div>
            <h2>MLM Report
            </h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Total Refundable Amount(INR)" value={total_refundable_Amount?total_refundable_Amount.toFixed(2):'0.00'} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Total Non Refundable Amount(INR)" value={total_Non_refundable_Amount?total_Non_refundable_Amount.toFixed(2):'0.00'} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>
        </div>
    }
}
