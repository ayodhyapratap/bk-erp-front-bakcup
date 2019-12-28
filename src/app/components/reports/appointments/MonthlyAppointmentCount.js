import React from "react";
import {Table, Divider, Statistic, Spin, Empty, Select} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend}  from 'recharts';
import CustomizedTable from "../../common/CustomizedTable";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";

export default class MonthlyAppointmentCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentMonthly: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            mailingUsersList: []
        }
        this.loadAppointmentMonthly = this.loadAppointmentMonthly.bind(this);
    }
    componentDidMount() {
        this.loadAppointmentMonthly();
        loadMailingUserListForReportsMail(this);
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
        that.setState({
            loading:true,
        });
        let successFn = function (data) {
            that.setState({
                appointmentMonthly: data.data,
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
    sendMail = (mailTo) => {
        let apiParams={
            type:this.props.type,
            practice:this.props.active_practiceId,
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
        apiParams.mail_to = mailTo;
        sendReportMail(PATIENT_APPOINTMENTS_REPORTS, apiParams)
    }
    render() {
        const {appointmentMonthly} =this.state;
        const appointmentMonthlyData = [];
        for (let i = 1; i <= appointmentMonthly.length; i++) {
            appointmentMonthlyData.push({s_no: i,...appointmentMonthly[i-1]});
        };


        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
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
                <span style={{float: 'right'}}>
                    <p><small>E-Mail To:&nbsp;</small>
                <Select onChange={(e) => this.sendMail(e)} style={{width: 200}}>
                    {this.state.mailingUsersList.map(item => <Select.Option
                        value={item.email}>{item.name}</Select.Option>)}
                </Select>
                    </p>
            </span>
            </h2>
             <Spin size="large" spinning={this.state.loading}>
                 {appointmentMonthlyData.length>0?
                 <ComposedChart width={1000} height={400} data={[...appointmentMonthlyData].reverse()}
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
            <CustomizedTable hideReport={true} loading={this.state.loading} columns={columns}  dataSource={appointmentMonthlyData}/>

        </div>
    }
}
