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

const {Content} = Layout;

class ReportsHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Layout>
            <ReportsHeader {...this.props}/>
            <Content style={{margin: '16px'}}>
                <Switch>
                    <Route exact path="/reports/amountdue" component={AmountDueReport}/>
                    <Route exact path="/reports/appointments" component={AppointmentsReport}/>
                    <Route exact path="/reports/emr" component={EMRReports}/>
                    <Route exact path="/reports/expenses" component={ExpensesReport}/>
                    <Route exact path="/reports/income" component={IncomeReport}/>
                    <Route exact path="/reports/inventory" component={InventoryReport}/>
                    <Route exact path="/reports/inventorydetails" component={InventoryDetailsReport}/>
                    <Route exact path="/reports/patients" component={PatientsReport}/>
                    <Route exact path="/reports/payments" component={PaymentsReport}/>
                    <Route exact path="/reports/summary" component={DailySummaryReport}/>
                </Switch>
            </Content>
        </Layout>
    }
}

export default ReportsHome;
