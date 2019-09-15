import React from "react";
import {Col, Divider, Empty, Spin, Statistic, Table} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";
import {Bar, CartesianGrid, ComposedChart, Line, LineChart, PieChart, Tooltip, XAxis, YAxis} from "recharts";
import CustomizedTable from "../../common/CustomizedTable";

export default class DailyAppointmentCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentDaily: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadAppointmentDaily = this.loadAppointmentDaily.bind(this);
    }
    componentDidMount() {
        this.loadAppointmentDaily();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentDaily();
            })

    }

    loadAppointmentDaily = () => {
        let that = this;

        let successFn = function (data) {
            that.setState({
                appointmentDaily: data.data,
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
            title: 'Day',
            key: 'date',
            dataIndex:'date',
            render: (text, record) => (
                <span>
                {moment(record.date).format('DD MMM ')}
                  </span>
            ),
            export:(item,record)=> (moment(record.date).format('DD MMM ')),
        },{
            title:'Total Appointments',
            key:'count',
            dataIndex:'count'
        }];




        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
        };

        const CustomizedLabel = ({x, y, stroke, value}) => {
                return <text x={x} y={y} dy={-4} fill="#666" fontSize={18} textAnchor="middle">{value}</text>
        };

        return <div>
            <h2>Daily Appointment Count
            </h2>
            <Spin size="large" spinning={this.state.loading}>
                {this.state.appointmentDaily.length>0?
                <LineChart width={1000} height={300} data={[...this.state.appointmentDaily].reverse()}
                           margin={{top: 5, right: 30, left: 20, bottom: 55}}>

                    <XAxis dataKey="date" tickFormatter={(value) => {
                        return moment(value).format('DD MMM')
                    }}
                           label= {{value:"Data Range", offset:0, margin:{top:10}, position:"insideBottom"}} />
                    {/*</XAxis>*/}

                    <YAxis label={{ value: 'Appointments', angle: -90, position: 'insideLeft' }} />

                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="count" stroke="#1DA57A" strokeWidth={4} label={<CustomizedLabel />}/>
                </LineChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
            </Spin>

            <Divider><Statistic title="Total" value={this.state.total} /></Divider>
            <CustomizedTable loading={this.state.loading} columns={columns}  dataSource={this.state.appointmentDaily}/>

        </div>
    }
}
