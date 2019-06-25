import React from "react";
import {Select, DatePicker, Layout} from "antd";
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

      let that =this;
        const reportCategory = [{name: 'Daily Summary', value: '/reports/summary'},
            {name: 'Income', value: '/reports/income'},
            {name: 'Payments', value: '/reports/payments'},
            {name: 'Appointment', value: '/reports/appointments'},
            {name: 'Patients', value: '/reports/patients'},
            {name: 'Amount Due', value: '/reports/amountdue'},
            {name: 'Expenses', value: '/reports/expenses'},
            {name: 'Inventory', value: '/reports/inventory'},
            {name: 'EMR', value: '/reports/emr'},
            {name: 'Inventory Details', value: '/reports/inventorydetails'}];
        return <Header style={{background: '#fff'}}>
            <ul style={{listStyle: 'none'}}>
                <li style={{display: 'inline'}}>
                    Select Report Category &nbsp;
                </li>
                <li style={{display: 'inline'}}>
                    <Select style={{minWidth: '200px'}} defaultValue={reportCategory[3].name}
                            onChange={this.changeReport}>
                        {reportCategory.map((item) => <Select.Option value={item.value}>{item.name}</Select.Option>)}
                    </Select>
                </li>
                <li style={{display: 'inline', float: 'right'}}>
                    <RangePicker
                        onChange={(date, dateString)=> that.props.reportsDateRange(dateString)}
                        defaultValue={[moment(), moment()]}
                        format={dateFormat}
                    />
                </li>
            </ul>
        </Header>
    }
}
