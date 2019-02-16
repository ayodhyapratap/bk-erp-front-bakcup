import React from "react";
import {Breadcrumb, Layout} from "antd";
import ReportsHeader from "./ReportsHeader";
import AmountDueReport from "./amountdue/AmountDueReport";
import {Route, Switch} from "react-router-dom";
import AppointmentsReport from "./appointments/AppointmentsReport";
import EMRReports from "./emr/EMRReports";
import ExpensesReport from "./expenses/ExpensesReport";
import IncomeReport from "./income/IncomeReport";
import InventoryReport from "./inventory/InventoryReport";
import InventoryDetailsReport from "./inventorydetails/InventoryDetailsReport";
import PatientsReport from "./patients/PatientsReport";
import PaymentsReport from "./payments/PaymentsReport";
import DailySummaryReport from "./summary/DailySummaryReport";
import moment from 'moment';

const {Content} = Layout;

class ReportsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            active_practiceId: this.props.active_practiceId,
        }
        this.reportsDateRange = this.reportsDateRange.bind(this);
    }

    reportsDateRange(dateString) {
        console.log(dateString);
        this.setState({
            startDate: moment(dateString[0], 'DD/MM/YYYY').format("YYYY-MM-DD"),
            endDate: moment(dateString[1], 'DD/MM/YYYY').format("YYYY-MM-DD"),
        });
    }

    render() {
        console.log(this.state.endDate);
        return <Layout>
            <ReportsHeader reportsDateRange={this.reportsDateRange} {...this.props}/>
            <Content style={{margin: '16px'}}>
                <Switch>
                    <Route exact path="/reports/amountdue" component={AmountDueReport}/>
                    <Route exact path="/reports/emr" render={(route) =>
                        <EMRReports  {...this.state} {...route}/>
                    }/>
                    <Route exact path="/reports/expenses" render={(route) =>
                        <ExpensesReport  {...this.state} {...route}/>
                    }/>
                    <Route exact path="/reports/income" render={(route) =>
                        <IncomeReport  {...this.state} {...route}/>
                    }/>
                    <Route exact path="/reports/inventory" component={InventoryReport}/>
                    <Route exact path="/reports/inventorydetails" component={InventoryDetailsReport}/>
                    <Route exact path="/reports/patients" render={(route) =>
                        <PatientsReport  {...this.state} {...route}/>
                    }/>
                    <Route exact path="/reports/payments" render={(route) =>
                        <PaymentsReport  {...this.state} {...route}/>
                    }/>
                    <Route exact path="/reports/summary" component={DailySummaryReport}/>
                    <Route render={(route) =>
                        <AppointmentsReport  {...this.state} {...route}/>
                    }/>
                </Switch>
            </Content>
        </Layout>
    }
}

export default ReportsHome;
