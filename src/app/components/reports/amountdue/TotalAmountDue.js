import React from "react";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {APPOINTMENT_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Cell, Pie, PieChart, Sector} from "recharts";
import moment from "moment"

export default class TotalAmountDue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            appointmentCategory:[],
            activeIndex:0,
            appointmentReports:[],
        }

        this.loadAppointmentReport = this.loadAppointmentReport.bind(this);
    }

    componentDidMount() {
        this.loadAppointmentReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.patient_groups !=newProps.patient_groups)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentReport();
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
            type:that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };
        if (this.props.patient_groups){
            apiParams.groups=this.props.patient_groups.toString();
        }
        getAPI(interpolate(APPOINTMENT_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };
    onPieEnter=(data, index)=>{
        this.setState({
            activeIndex: index,
        });
    };
    render() {
        let that=this;

        const {appointmentReports} =this.state;
        const appointmentReportsData = [];
        for (let i = 1; i <= appointmentReports.length; i++) {
            appointmentReportsData.push({s_no: i,...appointmentReports[i-1]});
        };

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            width: 50
        },{
            title: 'Invoice Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.schedule_at).format('DD MMM YYYY')}
                  </span>
            ),
        },{
            title:'Invoice Number',
            key:'invoice_number',
            dataIndex:'',
        },{
            title: 'Patient',
            dataIndex: 'patient',
            key: 'patient_name',
            render: (item, record) => <span>{item.user.first_name}</span>
        },{
            title:'Invoice Amount(INR)',
            key:'status',
            dataIndex:'status',
        }, {
            title: 'Amount Due(INR)',
            dataIndex: 'amount_due',
            key: 'amount_due',
        }, {
            title: 'Mobile No.',
            dataIndex: 'user.mobile',
            key: 'mobile',
        },{
            title:'SMS last Send On',
            key:'sms',
            dataIndex:'sms',
        }];




        return <div>

            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Amount Due For Listed Invoices(INR)" value={112893} />
                    <br/>
                    <p>*Advance payments are not considered here. Amounts may vary slightly.</p>
                </Col>
            </Row>

            {this.state.appointmentReports?
                <Table
                    loading={this.state.loading}
                    columns={columns}
                    pagination={false}
                    dataSource={appointmentReportsData}/>

            :<Table
                    loading={that.props.loading}
                    columns={columns}
                    pagination={false}
                    dataSource={appointmentReportsData}/>


            }
        </div>
    }
}
