import React from "react";
import {Layout} from "antd";
import ReportsHeader from "./ReportsHeader";
import AmountDueReportHome from "./amountdue/AmountDueReportHome";
import {Route, Switch} from "react-router-dom";
import AppointmentsReportHome from "./appointments/AppointmentsReportHome";
import EMRReportHome from "./emr/EMRReportHome";
import ExpensesReportHome from "./expenses/ExpensesReportHome";
import IncomeReport from "./income/IncomeReport";
import InventoryReportHome from "./inventory/InventoryReportHome";
import PatientsReportHome from "./patients/PatientsReportHome";
import PaymentsReport from "./payments/PaymentsReport";
import DailySummaryReport from "./summary/DailySummaryReport";
import BedBookingReport from "./booking/BedBookingReport";
import moment from 'moment';
import PermissionDenied from "../common/errors/PermissionDenied";
import InventoryDetailsReportHome from "./inventorydetails/InventoryDetailsReportHome";

const {Content} = Layout;

class ReportsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            active_practiceId: this.props.active_practiceId,
        }
        this.reportsDateRange = this.reportsDateRange.bind(this);
    }

    reportsDateRange(dateString) {
        console.log(dateString);
        this.setState({
            startDate: moment(dateString[0], 'DD/MM/YYYY'),
            endDate: moment(dateString[1], 'DD/MM/YYYY'),
        });
    }

    render() {
        let that = this;
        return <Layout>
            <ReportsHeader reportsDateRange={this.reportsDateRange} {...this.props}/>
            <Content style={{margin: '16px'}}>
                <Switch>
                    <Route exact path="/reports/amountdue"
                           render={(route) => (that.props.activePracticePermissions.ReportsAmountDue || that.props.allowAllPermissions ?
                                   <AmountDueReportHome {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>

                    <Route exact path="/reports/emr"
                           render={(route) => (that.props.activePracticePermissions.ReportsEMR || that.props.allowAllPermissions ?
                                   <EMRReportHome  {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>
                    <Route exact path="/reports/expenses"
                           render={(route) => (that.props.activePracticePermissions.ReportsExpenses || that.props.allowAllPermissions ?
                                   <ExpensesReportHome  {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>
                    <Route exact path="/reports/income"
                           render={(route) => (that.props.activePracticePermissions.ReportsIncome || that.props.allowAllPermissions ?
                                   <IncomeReport  {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>
                    <Route exact path="/reports/inventory"
                           render={(route) => (that.props.activePracticePermissions.ReportsInventory || that.props.allowAllPermissions ?
                                   <InventoryReportHome {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>

                    <Route exact path="/reports/inventoryretails"
                           render={(route) => (that.props.activePracticePermissions.ReportsInventoryRetail || that.props.allowAllPermissions ?
                                   <InventoryDetailsReportHome {...this.props} {...this.state} {...route}/> :
                                   <PermissionDenied/>
                           )}/>

                    <Route exact path="/reports/patients"
                           render={(route) => (that.props.activePracticePermissions.ReportsPatients || that.props.allowAllPermissions ?
                                   <PatientsReportHome  {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>
                    <Route exact path="/reports/payments"
                           render={(route) => (that.props.activePracticePermissions.ReportsPayments || that.props.allowAllPermissions ?
                                   <PaymentsReport  {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>
                    <Route exact path="/reports/summary"
                           render={(route) => (that.props.activePracticePermissions.ReportsDailySummary || that.props.allowAllPermissions ?
                                   <DailySummaryReport {...this.props} {...this.state} {...route}/> :
                                   <PermissionDenied/>
                           )}/>
                    <Route exact path="/reports/bed_booking"
                           render={(route) => (that.props.activePracticePermissions.ReportsBedBooking || that.props.allowAllPermissions ?
                                   <BedBookingReport {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                           )}/>
                    <Route
                        render={(route) => (that.props.activePracticePermissions.ReportsAppointments || that.props.allowAllPermissions ?
                                <AppointmentsReportHome  {...this.props} {...this.state} {...route}/> : <PermissionDenied/>
                        )}/>
                </Switch>
            </Content>
        </Layout>
    }
}

export default ReportsHome;
