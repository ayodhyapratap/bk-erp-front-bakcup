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
        }
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
        this.loadAppointmentReport();
    }
    componentWillReceiveProps(newProps){
        if(this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.loadAppointmentReport();
    }
    loadAppointmentReport() {
        let that = this;
        let successFn = function (data) {
            console.log(data);
            that.setState({
                appointmentReports: data.data,
            });
            console.log(that.state.appointmentReports);
        };
        let errorFn = function () {
        };
        getAPI(interpolate(APPOINTMENT_REPORTS, [this.props.active_practiceId, "start=" + this.props.startDate + "&end=" + this.props.endDate]), successFn, errorFn);
    }

    render() {
        const columns = [{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.shedule_at).format('LL')}
                  </span>
            ),
        }, {
            title: 'Scheduled At	',
            key: 'time',
            render: (text, record) => (
                <span>
                  {moment(record.shedule_at).format('HH:mm')}

                  </span>
            ),
        }, {
            title: 'Check-in At',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Waited For (hh:mm:ss)',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Engaged At',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Checkout At',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Patient',
            dataIndex: 'patient_name',
            key: 'patient_name',
        }, {
            title: 'Doctor',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Category',
            dataIndex: 'address',
            key: 'address',
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
                    <Col span={16}>
                        <CustomizedTable columns={columns} size={'small'} dataSource={this.state.appointmentReports}/>
                    </Col>
                    <Col span={8}>
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
