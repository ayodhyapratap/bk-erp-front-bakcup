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
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title:'Name',
            key:'name',
            dataIndex:'user.first_name',
        },{
            title:'Unsettled Invoice Amount(INR)',
            key:'invoice_amount',
            dataIndex:'',
        },{
            title: 'Amount Due(INR)',
            dataIndex: 'amount_due',
            key: 'amount_due',
        }, {
            title: 'Last Invoice(INR)',
            dataIndex: 'last_invoice_amount',
            key: 'last_invoice_amount',
        },{
            title:'Last Payment(INR)',
            key:'last_payed_amount',
            dataIndex:'last_payed_amount',
        }];

        return <div>
            <h2>Unsettled Invoices</h2>
            <Table
                loading={this.state.loading}
                columns={columns}
                pagination={false}
                dataSource={this.state.appointmentReports}/>


        </div>
    }
}
