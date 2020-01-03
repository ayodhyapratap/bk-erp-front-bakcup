import React from "react";
import {Col, Row, Select, Statistic, Table,Modal} from "antd";
import {APPOINTMENT_REPORTS} from "../../../constants/api";
import {getAPI, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";
export default class AllAppointments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            appointmentCategory: [],
            appointmentReports: [],
            activeIndex: 0,
            mailingUsersList: []
        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentReport();
        loadMailingUserListForReportsMail(this);
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.categories != newProps.categories
            || this.props.doctors != newProps.doctors || this.props.exclude_cancelled != newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadAppointmentReport();
            })

    }

    loadAppointmentReport = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                appointmentReports: data.data,
                total: data.total,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams = {
            type: that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            exclude_cancelled: this.props.exclude_cancelled ? true : false,
            practice:that.props.active_practiceId
        };
        // if (this.props.exclude_cancelled){
        //     apiParams.exclude_cancelled=this.props.exclude_cancelled;
        // }
        if (this.props.categories) {
            apiParams.categories = this.props.categories.toString();
        }
        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }
        getAPI(interpolate(APPOINTMENT_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };
    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };
    sendMail = (mailTo) => {
        console.log(mailTo)
        let that = this;
        let apiParams = {
            type: that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            exclude_cancelled: this.props.exclude_cancelled ? true : false,
        };
        // if (this.props.exclude_cancelled){
        //     apiParams.exclude_cancelled=this.props.exclude_cancelled;
        // }
        if (this.props.categories) {
            apiParams.categories = this.props.categories.toString();
        }
        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }
        apiParams.mail_to = mailTo;
        sendReportMail(interpolate(APPOINTMENT_REPORTS, [that.props.active_practiceId]), apiParams)
    };


    render() {

        const {appointmentReports} = this.state;
        const appointmentReportsData = [];
        for (let i = 1; i <= appointmentReports.length; i++) {
            appointmentReportsData.push({s_no: i, ...appointmentReports[i - 1]});
        }
        ;

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex: 's_no',
            width: 50
        }, {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                {moment(record.schedule_at).format('DD MMM YYYY')}
                  </span>
            ),
            export: (item, record) => (moment(record.schedule_at).format('ll')),
        }, {
            title: 'Scheduled At	',
            key: 'time',
            dataIndex: 'time',
            render: (text, record) => (
                <span>
                  {moment(record.schedule_at).format('HH:mm')}

                  </span>
            ),
            export: (item, record) => (
                moment(record.schedule_at).format('HH:mm')
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
            export: (item, record) => (moment(record.schedule_at).format('HH:mm')),

        }, {
            title: 'Waited For (hh:mm:ss)',
            dataIndex: 'age',
            key: 'age',
            render: (age, record) => (<span>
                {record.engaged ? moment(record.engaged).from(moment(record.waiting))
                    : ''}
            </span>),
            export: (item, record) => (record.engaged ? moment(record.engaged).from(moment(record.waiting))
                : ''),
        }, {
            title: 'Engaged At',
            dataIndex: 'engaged',
            key: 'engaged',
            render: (text, record) => (
                <span>
                {record.engaged ? moment(record.engaged).format('lll') : ''}
                  </span>
            ),
            export: (item, record) => (record.engaged ? moment(record.engaged).format('lll') : ''),
        }, {
            title: 'Checkout At',
            dataIndex: 'checkout',
            key: 'checkout',
            render: (text, record) => (
                <span>
                {record.checkout ? moment(record.checkout).format('lll') : ''}
                  </span>
            ),
            export: (item, record) => (record.checkout ? moment(record.checkout).format('lll') : ''),
        }, {
            title: 'Patient',
            dataIndex: 'patient',
            key: 'patient_name',
            render: (item, record) => <span>{item.user.first_name}</span>,
            export: (item, record) => (item.user.first_name),
        }, {
            title: 'Current Status',
            key: 'status',
            dataIndex: 'status',
        }, {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'address',
            render: (text, record) => <span>{record.doctor_data ? record.doctor_data.user.first_name : null}</span>,
            export: (item, record) => (record.doctor_data ? record.doctor_data.user.first_name : null),
        }, {
            title: 'Category',
            dataIndex: 'category',
            key: 'address',
            render: (text, record) => <span>{record.category_data ? record.category_data.name : null}</span>,
            export: (item, record) => (record.category_data ? record.category_data.name : null),
        }];

        return <div>
            <h2>All Appointments Report
                <span style={{float: 'right'}}>
                    <p><small>E-Mail To:&nbsp;</small>
                <Select onChange={(e) => this.sendMail(e)} style={{width: 200}}>
                    {this.state.mailingUsersList.map(item => <Select.Option
                        value={item.email}>{item.name}</Select.Option>)}
                </Select>
                    </p>
            </span>
            </h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign: "center"}}>
                    <Statistic title="Total Appointments" value={this.state.total}/>
                    <br/>
                </Col>
            </Row>

            <CustomizedTable
                hideReport={true}
                loading={this.state.loading}
                columns={columns}
                dataSource={appointmentReportsData}/>


        </div>
    }
}
