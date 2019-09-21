import React from "react";
import {FIRST_APPOINTMENT_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment";
import {Col, Row, Statistic, Table} from "antd";
import CustomizedTable from "../../common/CustomizedTable";

export default class PatientsFirstAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadFirstAppointment = this.loadFirstAppointment.bind(this);
    }

    componentDidMount() {
        this.loadFirstAppointment();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadFirstAppointment();
            })
    }

    loadFirstAppointment() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            from_date: this.props.startDate.format('YYYY-MM-DD'),
            to_date: this.props.endDate.format('YYYY-MM-DD'),
        }
        getAPI(FIRST_APPOINTMENT_REPORTS, successFn, errorFn,apiParams);
    }
    render() {
        let that=this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'sno',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
            title: 'Date',
            key: 'appointment_time',
            render: (text, record) => (
                <span>
                {moment(record.appointment_time).format('LL')}
                  </span>
            ),
            export:(item,record)=> (moment(record.appointment_time).format('LL')),
        }, {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },{
            title:'Patient Number',
            key:'id',
            render:(item ,record)=><span>{record.custom_id?record.custom_id:record.patient_id}</span>,
            exports:(item ,record) =>(record.custom_id?record.custom_id:record.patient_id),
        }];

        return <div>
            <h2>Patients First AppointmentReport</h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Total Patients" value={this.state.report.length} />
                    <br/>
                </Col>
            </Row>

            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>


        </div>
    }
}
