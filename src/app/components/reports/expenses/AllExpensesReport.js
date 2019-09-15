import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Statistic, Table} from "antd";
import {EXPENSE_REPORT_API,EXPENSE_PAYMENT_MODE_API} from "../../../constants/api";
import {getAPI } from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";

export default class ExpensesReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.ExpenseReport = this.ExpenseReport.bind(this);
    }
    componentDidMount() {
        this.ExpenseReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.expense_type!=newProps.expense_type
            ||this.props.payment_mode!=newProps.payment_mode)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.ExpenseReport();
            })

    }

    ExpenseReport() {
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
        if(this.props.payment_mode){
            apiParams.payment_mode=this.props.payment_mode.toString();
        }
        if(this.props.expense_type){
            apiParams.expense_type=this.props.expense_type.toString();
        }
        getAPI(EXPENSE_PAYMENT_MODE_API , successFn, errorFn, apiParams);
    }


    render() {
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'sno',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
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
        var totalAmount = this.state.report.reduce(function(prev, cur) {
            return prev + cur.amount;
        }, 0);
        return <div>
            <h2>Expenses Report
            </h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Total Expense (INR)" value={totalAmount} />
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
