import React from "react";
import {Col, Divider, Row, Select, Statistic, Table} from "antd";
import {Pie, PieChart, Sector,Cell} from "recharts";
import {AMOUNT_DUE_REPORTS, PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";

export default class AmountDuePerProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            activeIndex:0,
            mailingUsersList: []
        }
        this.loadReport = this.loadReport.bind(this);

    }

    componentDidMount() {
        this.loadReport();
        loadMailingUserListForReportsMail(this);
    }

    componentWillReceiveProps(newProps) {
        const that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.doctors != newProps.doctors)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadReport();
            })

    }

    loadReport(){
        const that =this;
        that.setState({
            loading:true,
        });

        const successFn = function (data) {
            that.setState({
                report:data,
                loading:false,
            })
        };
        const errorFn = function () {
            that.setState({
                loading:false
            })
        };
        const apiParams={
            practice:this.props.active_practiceId,
            type: that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };

        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }

        getAPI(AMOUNT_DUE_REPORTS, successFn ,errorFn,apiParams);
    };

    sendMail = (mailTo) => {
        const apiParams={
            practice:this.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            type:this.props.type,
        }
        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }
        apiParams.mail_to = mailTo;
        sendReportMail(AMOUNT_DUE_REPORTS, apiParams)
    }

    render() {

        const {report ,loading} =this.state;


        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            width: 50
        },{
            title: 'Treatment Category',
            key:'treatment_category',
            dataIndex:'treatment_category',
        },{
            title:'Invoiced (INR)',
            key:'invoiced_amount',
            dataIndex:'',
        },{
            title:'Received (INR)',
            key:'received_amount',
            dataIndex:'',
        },{
            title:'Total Amount Due (INR)',
            key:'count',
            dataIndex:'count',

        }];
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
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
                    <Sector
                      cx={cx}
                      cy={cy}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      innerRadius={outerRadius + 6}
                      outerRadius={outerRadius + 10}
                      fill={fill}
                    />
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.doctor},${ payload.count}`}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`(Rate ${(percent * 100).toFixed(2)}%)`}
                    </text>
                </g>
            );
        };
        return (
<div>
            <h2>Appointment For Each Patient Doctor
                <span style={{float: 'right'}}>
                    <p><small>E-Mail To:&nbsp;</small>
                <Select onChange={(e) => this.sendMail(e)} style={{width: 200}}>
                    {this.state.mailingUsersList.map(item => (
<Select.Option
  value={item.email}
>{item.name}
</Select.Option>
))}
                </Select>
                    </p>
                </span>
            </h2>

            <Row>
                <Col span={12} offset={6}>
                    <PieChart width={800} height={400}>
                        <Pie
                          activeIndex={this.state.activeIndex}
                          activeShape={renderActiveShape}
                          data={report}
                          cx={300}
                          dataKey="count"
                          cy={200}
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          onMouseEnter={this.onPieEnter}
                        >
                            {
                                report.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
                            }
                        </Pie>
                        {/* <Tooltip/> */}
                    </PieChart>
                </Col>
            </Row>
            <Divider><Statistic title="Total" value={this.state.total} /></Divider>
            <Table loading={loading} columns={columns} pagination={false} dataSource={report} />


</div>
)
    }
}
