import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {APPOINTMENT_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";

export default class AppointmentsReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentReports: [],
            loading: true
        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
        this.loadAppointmentReport();
    }

    componentWillReceiveProps(newProps) {
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.loadAppointmentReport();
    }

    loadAppointmentReport() {
        let that = this;
        let successFn = function (data) {
            console.log(data);
            that.setState({
                appointmentReports: data.data,
                loading: false
            });
            console.log(that.state.appointmentReports);
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(APPOINTMENT_REPORTS, [this.props.active_practiceId, "start=" + this.props.startDate + "&end=" + this.props.endDate]), successFn, errorFn);
    }

    render() {
        const columns = [{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.schedule_at).format('LL')}
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


        const relatedReport = [
            {name: 'Appointments For Each Category', value: 'b'},
            {name: 'Cancellation Numbers', value: 'c'},
            {name: 'Average Waiting/engaged Time Day Wise', value: 'd'},
            {name: 'Average Waiting/engaged Time Month Wise', value: 'e'},
            {name: 'Reasons For Cancellations', value: 'f'},
            {name: 'Daily Appointment Count', value: 'g'},
            {name: 'Appointments For Each Doctor', value: 'h'},
            {name: 'Monthly Appointment Count', value: 'i'},
            {name: 'Appointment For Each Patient Group', value: 'j'},]
        return <div>
            <h2>Appointments Report
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={18}>
                        <CustomizedTable loading={this.state.loading} columns={columns} size={'small'}
                                         dataSource={this.state.appointmentReports}/>
                    </Col>
                    <Col span={6}>
                        <Radio.Group buttonStyle="solid" defaultValue="all">
                            <h2>Appointments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                All Appointemnts
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {relatedReport.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>
                    </Col>
                </Row>
            </Card>
        </div>
    }
}
