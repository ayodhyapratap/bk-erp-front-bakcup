import React from "react";
import {Table} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";


export default class AverageWaitingOrEngagedTimeDayWise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentDayWait: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false
        }
        this.loadAppointmentDayWait = this.loadAppointmentDayWait.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentDayWait();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentDayWait();
            })

    }

    loadAppointmentDayWait = () => {
        let that = this;
        that.setState({
            loading:true,
        });
        let successFn = function (data) {
            that.setState({
                appointmentDayWait: data,
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
        const {appointmentDayWait} =this.state;
        const appointmentDayWaitData = [];
        for (let i = 1; i <= appointmentDayWait.length; i++) {
            appointmentDayWaitData.push({s_no: i,...appointmentDayWait[i-1]});
        };

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            width: 50
        },{
            title: 'Appointment Time Day',
            key: 'date',
            dataIndex:'date',
            render: (text, record) => (
                <span>
                {moment(record.date).format('DD MMM YYYY')}
                  </span>
            ),
            export:(item,record)=> (moment(record.date).format('DD MMM YYYY')),
        }, {
            title: 'Avg. waiting Time(hh:mm:ss)',
            key: 'wait',
            dataIndex:'wait',
            render: (text, record) => (
                <span>
                  {record.wait?moment(record.wait).format('HH:mm:ss'):''}
                </span>
            ),
            export:(item,record)=> (record.wait?moment(record.wait).format('HH:mm:ss'):''),
        }, {
            title: 'Avg. engaged Time(hh:mm:ss)',
            key: 'engage',
            dataIndex:'engage',
            render: (text, record) => (
                <span>
                  {record.engage?moment(record.engage).format('HH:mm:ss'):''}
                </span>
            ),
            export:(item,record)=> (record.engage?moment(record.engage).format('HH:mm:ss'):''),
        }, {
            title: 'Avg. stay Time (hh:mm:ss)',
            key: 'stay',
            dataIndex:'stay',
            render: (stay, record) => (<span>
                {record.stay ? moment(record.stay).format('hh:mm:ss'): ''}
            </span>),
            export:(item,record)=> (record.stay ? moment(record.stay).format('hh:mm:ss'): ''),
        }];





        return <div>
            <h2>Average Waiting/engaged Time Day Wise
            </h2>
            <CustomizedTable loading={this.state.loading} columns={columns}
                             dataSource={appointmentDayWaitData}/>

        </div>
    }
}
