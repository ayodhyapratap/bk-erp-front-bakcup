import React from "react";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {APPOINTMENT_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Cell, Pie, PieChart, Sector} from "recharts";
import moment from "moment"

export default class AgeingAmountDue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            appointmentCategory:[],
            activeIndex:0,
        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentReport();
            })

    }

    loadAppointmentReport = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                appointmentReports: data.data,
                total:data.total,
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
        getAPI(interpolate(APPOINTMENT_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };
    onPieEnter=(data, index)=>{
        this.setState({
            activeIndex: index,
        });
    };
    render() {
        let that=this;
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.schedule_at).format('DD MMM YYYY')}
                  </span>
            ),
        }, {
            title: 'Scheduled At	',
            key: 'time',
            render: (text, record) => (
                <span>
                  {moment(record.schedule_at).format('HH:mm')}

                  </span>
            ),
        }, {
            title: 'Check-in At',
            dataIndex: 'waiting',
            key: 'waiting',
            render: (text, record) => (
                <span>
                {record.waiting ? moment(record.waiting).format('lll') : ''}
                  </span>
            ),
        }, {
            title: 'Waited For (hh:mm:ss)',
            dataIndex: 'age',
            key: 'age',
            render: (age, record) => (<span>
                {record.engaged ? moment(record.engaged).from(moment(record.waiting))
                    : ''}
            </span>)
        }, {
            title: 'Engaged At',
            dataIndex: 'engaged',
            key: 'engaged',
            render: (text, record) => (
                <span>
                {record.engaged ? moment(record.engaged).format('lll') : ''}
                  </span>
            ),
        }, {
            title: 'Checkout At',
            dataIndex: 'checkout',
            key: 'checkout',
            render: (text, record) => (
                <span>
                {record.checkout ? moment(record.checkout).format('lll') : ''}
                  </span>
            ),
        }, {
            title: 'Patient',
            dataIndex: 'patient',
            key: 'patient_name',
            render: (item, record) => <span>{item.user.first_name}</span>
        },{
            title:'Current Status',
            key:'status',
            dataIndex:'status',
        }, {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'address',
            render: (text, record) => <span>{record.doctor_data ? record.doctor_data.user.first_name : null}</span>
        }, {
            title: 'Category',
            dataIndex: 'category',
            key: 'address',
            render: (text, record) => <span>{record.category_data ? record.category_data.name : null}</span>
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
            {/*<h2>All Appointments Report (Total:{that.props.total?that.props.total:this.state.total})*/}
            {/*    /!*<Button.Group style={{float: 'right'}}>*!/*/}
            {/*    /!*<Button><Icon type="mail"/> Mail</Button>*!/*/}
            {/*    /!*<Button><Icon type="printer"/> Print</Button>*!/*/}
            {/*    /!*</Button.Group>*!/*/}
            {/*</h2>*/}

            {this.state.appointmentReports?<>
                <h2>All Appointments Report (Total:{this.state.total})</h2>
                <Table
                    loading={this.state.loading}
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.appointmentReports}/>

            </>:<>
                <h2>All Appointments Report (Total:{that.props.total})</h2>
                <Table
                    loading={that.props.loading}
                    columns={columns}
                    pagination={false}
                    dataSource={that.props.appointmentReports}/>


            </>}



        </div>
    }
}
