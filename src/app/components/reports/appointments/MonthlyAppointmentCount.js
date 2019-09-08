import React from "react";
import {Table,Divider,Statistic,Spin,Empty} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend}  from 'recharts';
import CustomizedTable from "../../common/CustomizedTable";

export default class MonthlyAppointmentCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentMonthly: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadAppointmentMonthly = this.loadAppointmentMonthly.bind(this);
    }
    componentDidMount() {
        this.loadAppointmentMonthly();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
           if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
                    ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentMonthly();
            })

    }

    loadAppointmentMonthly = () => {
        let that = this;

        let successFn = function (data) {
            that.setState({
                appointmentMonthly: data.data.reverse(),
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
            title: 'Month',
            key: 'date',
            dataIndex:'date',
            render: (text, record) => (
                <span>
                {moment(record.date).format('MMMM YYYY')}
                  </span>
            ),
            export:(item,record)=> (moment(record.date).format('DD MMM YYYY')),
        },{
            title:'Total Appointments',
            key:'count',
            dataIndex:'count'
        }];

        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
        };
        return <div>
            <h2>Monthly Appointment Count
            </h2>
             <Spin size="large" spinning={this.state.loading}>
                 {this.state.appointmentMonthly.length>0?
                 <ComposedChart width={1000} height={400} data={this.state.appointmentMonthly}
                               margin={{top: 20, right: 20, bottom: 20, left: 20}}>


                    <XAxis dataKey="date" tickFormatter={(value) => {
                        return moment(value).format('MMM YY')
                    }} />
                    <YAxis />
                    <Tooltip />
                    {/*<Legend />*/}
                    <Bar dataKey='count' barSize={35} fill='#0059b3' stroke="#0059b3" label={renderCustomBarLabel}/>
                </ComposedChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
              </Spin>

            <Divider><Statistic title="Total" value={this.state.total} /></Divider>
            <CustomizedTable loading={this.state.loading} columns={columns}  dataSource={this.state.appointmentMonthly}/>

        </div>
    }
}
