import React from "react";
import {Table} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment"


export default class AverageWaitingOrEngagedTimeDayWise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentDayWait: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadAppointmentDayWait = this.loadAppointmentDayWait.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentDayWait();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentDayWait();
            })

    }

    loadAppointmentDayWait = () => {
        let that = this;
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
        };

        getAPI(PATIENT_APPOINTMENTS_REPORTS,  successFn, errorFn, apiParams);
    };

    render() {
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Appointment Time Day',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.date).format('DD MMM YYYY')}
                  </span>
            ),
        }, {
            title: 'Avg. waiting Time(hh:mm:ss)',
            key: 'wait',
            render: (text, record) => (
                <span>
                  {record.wait?moment(record.wait).format('HH:mm:ss'):''}
                </span>
            ),
        }, {
            title: 'Avg. engaged Time(hh:mm:ss)',
            key: 'engage',
            render: (text, record) => (
                <span>
                  {record.engage?moment(record.engage).format('HH:mm:ss'):''}
                </span>
            ),
        }, {
            title: 'Avg. stay Time (hh:mm:ss)',
            key: 'stay',
            render: (stay, record) => (<span>
                {record.stay ? moment(record.stay).format('hh:mm:ss'): ''}
            </span>)
        }];





        return <div>
            <h2>Average Waiting/engaged Time Day Wise
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>
            <Table loading={this.state.loading} columns={columns} pagination={false}
                             dataSource={this.state.appointmentDayWait}/>

        </div>
    }
}
