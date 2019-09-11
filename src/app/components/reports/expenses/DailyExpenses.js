import React from "react";
import {Statistic, Divider, Table, Empty, Spin} from "antd"
import {EMR_REPORTS, EXPENSE_REPORT_API,} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart} from 'recharts';
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";

export default class DailyExpenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadDailyExpense = this.loadDailyExpense.bind(this);
    }
    componentDidMount() {
        this.loadDailyExpense();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.expense_type!=newProps.expense_type
            ||this.props.payment_mode!=newProps.payment_mode)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadDailyExpense();
            })
    }

    loadDailyExpense() {
        let that = this;
        that.setState({
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
            type:that.props.type,
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
        getAPI(EXPENSE_REPORT_API , successFn, errorFn, apiParams);
    }
    render() {
        let that=this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'abcd',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
            title: 'Day',
            key: 'date',
            dataIndex:'date',
            render:((item, record) => <span>{moment(record.expense_date).format('ll')}</span>),
            export:(item,record)=>(moment(record.expense_date).format('ll')),
        },{
            title:'Total Expenses (INR)',
            key:'amount',
            dataIndex:'amount',
        }];

        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
        };
        var totalAmount = this.state.report.reduce(function(prev, cur) {
            return prev + cur.amount;
        }, 0);
        return <div>
            <h2>Daily Expense</h2>
            <Spin size="large" spinning={this.state.loading}>
                {this.state.report.length>0?
                    <ComposedChart width={1000} height={400} data={this.state.report.reverse()}
                                   margin={{top: 20, right: 20, bottom: 20, left: 20}} >


                        <XAxis   dataKey="expense_date" tickFormatter={(value) => {
                            return moment(value).format('DD MMM')
                        }} label= {{value:"Data Range", offset:0, margin:{top:10}, position:"insideBottom"}} />
                        <YAxis label={{ value: 'Total Expenses(INR)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        {/*<Legend />*/}
                        <Bar dataKey='amount' barSize={35} fill='#0059b3' stroke="#0059b3" label={renderCustomBarLabel} />
                    </ComposedChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
            </Spin>

            <Divider><Statistic title="Total" value={totalAmount} /></Divider>
            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>
        </div>
    }
}
