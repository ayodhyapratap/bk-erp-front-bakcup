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
import BedBookingReport from "./booking/BedBookingReport";
import moment from 'moment';
import PermissionDenied from "../common/errors/PermissionDenied";

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
        let that=this;
        return <Layout>
            <ReportsHeader reportsDateRange={this.reportsDateRange} {...this.props}/>
            <Content style={{margin: '16px'}}>
                <Switch>
                    <Route exact path="/reports/amountdue" render={(route) => (that.props.activePracticePermissions.ReportsAmountDue || that.props.allowAllPermissions ?
                        <AmountDueReport {...this.state} {...route}/>:<PermissionDenied/>
                    )} />

                    <Route exact path="/reports/emr" render={(route) =>(that.props.activePracticePermissions.ReportsEMR || that.props.allowAllPermissions ?
                        <EMRReports  {...this.state} {...route}/>:<PermissionDenied/>
                    )}/>
                    <Route exact path="/reports/expenses" render={(route) => (that.props.activePracticePermissions.ReportsExpenses || that.props.allowAllPermissions ?
                        <ExpensesReport  {...this.state} {...route}/>:<PermissionDenied/>
                    )}/>
                    <Route exact path="/reports/income" render={(route) =>(that.props.activePracticePermissions.ReportsIncome || that.props.allowAllPermissions ?
                        <IncomeReport  {...this.state} {...route}/>:<PermissionDenied/>
                    )}/>
                    <Route exact path="/reports/inventory" render={(route) => (that.props.activePracticePermissions.ReportsInventory || that.props.allowAllPermissions? 
                        <InventoryReport {...this.state} {...route}/>:<PermissionDenied/>
                    )} />

                    <Route exact path="/reports/inventoryretails" render ={(route) =>(that.props.activePracticePermissions.ReportsInventoryRetail || that.props.allowAllPermissions ?
                        <InventoryDetailsReport {...this.state} {...route}/>:<PermissionDenied/>
                    ) } />

                    <Route exact path="/reports/patients" render={(route) =>(that.props.activePracticePermissions.ReportsPatients || that.props.allowAllPermissions ?
                        <PatientsReport  {...this.state} {...route}/>:<PermissionDenied/>
                    )}/>
                    <Route exact path="/reports/payments" render={(route) =>(that.props.activePracticePermissions.ReportsPayments || that.props.allowAllPermissions ?
                        <PaymentsReport  {...this.state} {...route}/>:<PermissionDenied/>
                    )}/>
                    <Route exact path="/reports/summary" render={(route) => (that.props.activePracticePermissions.ReportsDailySummary || that.props.allowAllPermissions ?
                        <DailySummaryReport {...this.state} {...route}/>:<PermissionDenied/>
                    )} />
                    <Route exact path="/reports/bed_booking" render={(route) => (that.props.activePracticePermissions.ReportsBedBooking ||that.props.allowAllPermissions?
                        <BedBookingReport {...this.state } {...route}/>:<PermissionDenied/>
                    )}/>
                    <Route render={(route) =>(that.props.activePracticePermissions.ReportsAppointments || that.props.allowAllPermissions ?
                        <AppointmentsReport  {...this.state} {...route}/>:<PermissionDenied/>
                    )}/>
                </Switch>
            </Content>
        </Layout>
    }
}

export default ReportsHome;
