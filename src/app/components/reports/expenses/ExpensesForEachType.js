import React from "react";
import {Statistic, Divider, Table, Empty, Spin, Col,Row} from "antd"
import {EMR_REPORTS, EXPENSE_REPORT_API,} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Cell, LineChart, Pie, PieChart, Sector} from "recharts";
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";

export default class ExpensesForEachType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadExpenseEachType = this.loadExpenseEachType.bind(this);
    }
    componentDidMount() {
        this.loadExpenseEachType();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.expense_type!=newProps.expense_type
            ||this.props.payment_mode!=newProps.payment_mode)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadExpenseEachType();
            })
    }

    loadExpenseEachType() {
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
            dataIndex:'sno',
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
        const COLORS = ['#89b9d8', '#8fc6eb','#81dac9','#f39e94','#bb98c9','#73c1c1'];
        const renderActiveShape = (props) => {
            const RADIAN = Math.PI / 180;
            const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
                fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 30) * cos;
            const my = cy + (outerRadius + 30) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 22;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';

            return (
                <g>

                    <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                    />

                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.expense_type.name+','+ payload.amount}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`(Rate ${(percent * 100).toFixed(2)}%)`}
                    </text>
                </g>
            );
        };

        var totalAmount = this.state.report.reduce(function(prev, cur) {
            return prev + cur.amount;
        }, 0);

        return <div>
            <h2>Expenses By Type</h2>
            <Row>
                <Col span={12} offset={6}>
                    <Spin size="large" spinning={this.state.loading}>
                        {this.state.report.length>0 && totalAmount?
                            <PieChart width={800} height={400} >
                                <Pie
                                    label={renderActiveShape}
                                    data={this.state.report}
                                    cx={300}
                                    dataKey="amount"
                                    cy={200}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8">
                                    {
                                        this.state.report.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                                    }
                                </Pie>
                                {/*<Tooltip/>*/}
                            </PieChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
                    </Spin>
                </Col>
            </Row>
            <Divider><Statistic title="Total" value={totalAmount} /></Divider>
            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>
        </div>
    }
}
