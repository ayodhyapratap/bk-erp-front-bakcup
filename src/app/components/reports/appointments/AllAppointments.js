import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {APPOINTMENT_REPORTS} from "../../../constants/api";
import {
    APPOINTMENT_FOR_EACH_CATEGORY,
    CANCELLATION_NUMBERS,
    AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE,
    AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE,
    REASONS_FOR_CANCELLATIONS,
    DAILY_APPOINTMENT_COUNT,
    APPOINTMENT_FOR_EACH_DOCTOR,
    MONTHLY_APPOINTMENT_COUNT,
    APPOINTMENT_FOR_EACH_PATIENT_GROUP,
    NEW_PATIENTS
}
    from "../../../constants/dataKeys";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {APPOINTMENT_RELATED_REPORT} from "../../../constants/hardData";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";

export default class AppointmentsReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentReports: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
    }
    componentDidMount() {
        if (this.state.type=='all'){
            this.loadAppointmentReport();
        }
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories !=newProps.categories)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                if (this.state.type=='all'){
                    that.loadAppointmentReport();
                }

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
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };
        if (this.props.categories){
            apiParams.categories=this.props.categories.toString();
        }

        if (this.props.exclude_cancelled){
            apiParams.exclude_cancelled=this.props.exclude_cancelled;
        }
        getAPI(interpolate(APPOINTMENT_REPORTS, [this.props.active_practiceId]), successFn, errorFn, apiParams);
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





        return <div>
            <h2>All Appointments Report (Total:{that.props.total?that.props.total:this.state.total})
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>


            <Table loading={that.props.loading?that.props.loading:this.state.loading} columns={columns} pagination={false}
                             dataSource={that.props.appointmentReports?that.props.appointmentReports:this.state.appointmentReports}/>

        </div>
    }
}
