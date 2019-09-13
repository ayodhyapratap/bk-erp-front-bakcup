import React from "react";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {PAYMENT_REPORTS} from "../../../constants/api";
import {getAPI,interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";

export default class AllPayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            report:[],
        };
        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.patient_groups != newProps.patient_groups
            || this.props.doctors != newProps.doctors ||this.props.payment_mode !=newProps.payment_mode||this.props.consume!=newProps.consume || this.props.exclude_cancelled != newProps.exclude_cancelled)
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
                report: data.data,
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
        };
        if (this.props.patient_groups){
            apiParams.patient_groups=this.props.patient_groups.toString();
        }
        if (this.props.payment_mode) {
            apiParams.payment_mode = this.props.payment_mode.toString();
        }
        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }
        if (this.props.consume) {
            apiParams.consume = this.props.consume.toString();
        }
        getAPI(interpolate(PAYMENT_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };
    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };

    render() {
        let that = this;
        let i = 1;
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
            title: 'Patient',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Receipt Number',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Invoice(s)',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Treatments & Products',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Amount Paid (INR)	',
            dataIndex: 'patient_name',
            key: 'patient_name',
        }, {
            title: 'Advance Amount (INR)',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Payment Info	',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Vendor Fees (INR)',
            dataIndex: 'address',
            key: 'address',
        }];

        return <div>
            <h2>All Payments Report</h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign: "center"}}>
                    {/*<Statistic title="Total Appointments" value={this.state.total}/>*/}
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
