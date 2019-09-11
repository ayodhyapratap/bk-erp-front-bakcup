import React from "react";
import {Col, Divider, Row, Empty,Spin} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Cell, Pie, PieChart, Sector} from "recharts";
import CustomizedTable from "../../common/CustomizedTable";

export default class AppointmentByCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            appointmentCategory:[],
            activeIndex:0,
        }
        this.loadAppointmentWithCategory = this.loadAppointmentWithCategory.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentWithCategory();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentWithCategory();
            })

    }

    loadAppointmentWithCategory = () => {
        let that = this;
        this.setState({
            loading:true
        });
        let successFn = function (data) {
            that.setState({
                appointmentCategory: data,
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

        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'sno',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
           title: 'Appointment Category',
           key:'category',
           dataIndex:'category',
        },{
            title:'Total Appointments',
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
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.category+','+ payload.count}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`(Rate ${(percent * 100).toFixed(2)}%)`}
                    </text>
                </g>
            );
        };



        return <div>
            <h2>Appointment By Category
            </h2>

            <Row>
                <Col span={12} offset={6}>
                    <Spin  size="large" spinning={this.state.loading}>
                        {this.state.appointmentCategory.length>0?
                            <PieChart width={800} height={400}>
                                <Pie
                                    activeIndex={this.state.activeIndex}
                                    activeShape={renderActiveShape}
                                    data={this.state.appointmentCategory}
                                    cx={300}
                                    dataKey="count"
                                    cy={200}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    onMouseEnter={this.onPieEnter}>
                                    {
                                        this.state.appointmentCategory.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                                    }
                                </Pie>
                                {/*<Tooltip/>*/}
                            </PieChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
                    </Spin>
                </Col>
            </Row>
            <CustomizedTable loading={this.state.loading} columns={columns}  dataSource={this.state.appointmentCategory}/>

        </div>
    }
}
