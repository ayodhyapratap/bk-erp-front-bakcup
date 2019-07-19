import React from "react";
import {DatePicker, Layout, Select} from "antd";
import moment from "moment";

const {Header} = Layout;
const {RangePicker} = DatePicker;
const dateFormat = 'DD/MM/YYYY';

export default class ReportsHeader extends React.Component {
    constructor(props) {
        super(props);
        this.changeReport = this.changeReport.bind(this);
    }

    changeReport(evt) {
        // console.log(evt);
        this.props.history.push(evt);
    }

    render() {
        let that = this;

        const reportCategory = [{name: 'Daily Summary', value: '/reports/summary', active: 'ReportsDailySummary'},
            {name: 'Income', value: '/reports/income', active: 'ReportsIncome'},
            {name: 'Payments', value: '/reports/payments', active: 'ReportsPayments'},
            {name: 'Appointment', value: '/reports/appointments', active: 'ReportsAppointments'},
            {name: 'Patients', value: '/reports/patients', active: 'ReportsPatients'},
            {name: 'Amount Due', value: '/reports/amountdue', active: 'ReportsAmountDue'},
            {name: 'Expenses', value: '/reports/expenses', active: 'ReportsExpenses'},
            {name: 'Inventory', value: '/reports/inventory', active: 'ReportsInventory'},
            {name: 'EMR', value: '/reports/emr', active: 'ReportsEMR'},
            {name: 'Bed Booking', value:'/reports/bed_booking', active:'ReportBedBooking'},
            {name: 'Inventory Retails', value: '/reports/inventoryretails', active: 'ReportsInventoryRetail'}];
        return <Header style={{background: '#fff'}}>
            <ul style={{listStyle: 'none'}}>
                <li style={{display: 'inline'}}>
                    Select Report Category &nbsp;
                </li>
                <li style={{display: 'inline'}}>
                    <Select style={{minWidth: '200px'}} defaultValue={reportCategory[3].name}
                            value={this.props.history.location.pathname}
                            onChange={this.changeReport}>
                        {reportCategory.map((item) => <Select.Option value={item.value}
                                                                     disabled={item.active || that.props.allowAllPermissions ? false : true}>{item.name}</Select.Option>)}
                    </Select>
                </li>
                <li style={{display: 'inline', float: 'right'}}>
                    <RangePicker
                        onChange={(date, dateString) => that.props.reportsDateRange(dateString)}
                        defaultValue={[moment(), moment()]}
                        format={dateFormat}
                    />
                </li>
            </ul>
        </Header>
    }
}
