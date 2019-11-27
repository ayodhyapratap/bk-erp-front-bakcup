import React from "react";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {Pie, PieChart, Sector,Cell} from "recharts";

export default class AmountDuePerProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentEachDoctor: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            activeIndex:0,

        }
        this.loadAppointmentEachDoctor = this.loadAppointmentEachDoctor.bind(this);

    }
    componentDidMount() {
        this.loadAppointmentEachDoctor();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentEachDoctor();
            })

    }

    loadAppointmentEachDoctor = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                appointmentEachDoctor: data,
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
            exclude_cancelled:this.props.exclude_cancelled?true:false,
        };
        // if (this.props.exclude_cancelled){
        //     apiParams.exclude_cancelled=this.props.exclude_cancelled;
        // }
        if(this.props.categories){
            apiParams.categories=this.props.categories.toString();
        }
        if(this.props.doctors){
            apiParams.doctors=this.props.doctors.toString();
        }

        getAPI(PATIENT_APPOINTMENTS_REPORTS,  successFn, errorFn, apiParams);
    };
    onPieEnter=(data, index)=>{
        this.setState({
            activeIndex: index,
        });
    };
    render() {

        const {appointmentEachDoctor} =this.state;
        const appointmentEachDoctorData = [];
        for (let i = 1; i <= appointmentEachDoctor.length; i++) {
            appointmentEachDoctorData.push({s_no: i,...appointmentEachDoctor[i-1]});
        };

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
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.doctor+','+ payload.count}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`(Rate ${(percent * 100).toFixed(2)}%)`}
                    </text>
                </g>
            );
        };
        return <div>
            <h2>Appointment For Each Patient Doctor
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>

            <Row>
                <Col span={12} offset={6}>
                    <PieChart width={800} height={400} >
                        <Pie
                            activeIndex={this.state.activeIndex}
                            activeShape={renderActiveShape}
                            data={appointmentEachDoctorData}
                            cx={300}
                            dataKey="count"
                            cy={200}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            onMouseEnter={this.onPieEnter}>
                            {
                                appointmentEachDoctorData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                            }
                        </Pie>
                        {/*<Tooltip/>*/}
                    </PieChart>
                </Col>
            </Row>
            <Divider><Statistic title="Total" value={this.state.total} /></Divider>
            <Table loading={this.state.loading} columns={columns} pagination={false} dataSource={appointmentEachDoctorData}/>


        </div>
    }
}
