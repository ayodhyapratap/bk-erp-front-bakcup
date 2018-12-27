import React from "react";
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import VendorList from "./vendor/VendorList";
import ExpensesList from "./expenses/ExpensesList";
import ManufactureList from "./manufacture/ManufactureList";
import LabList from "./labs/LabList";
import ActivityList from "./activities/ActivityList";

const {Content} = Layout;
export default class InventoryHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Content className="main-container" style={{
            margin: '24px 16px',
            // padding: 24,
            minHeight: 280,
            // marginLeft: '200px'
        }}>

            <Switch>
                <Route path="/inventory/vendor" render={(route) => <VendorList {...this.props}/>}/>
                <Route path="/inventory/expenses" render={(route) => <ExpensesList {...this.props}/>}/>
                <Route path="/inventory/manufacture" render={(route) => <ManufactureList {...this.props}/>}/>
                <Route path="/inventory/lab" render={(route) => <LabList {...this.props}/>}/>
                <Route path="/inventory/activity" render={(route) => <ActivityList {...this.props}/>}/>
            </Switch>
        </Content>
    }
}

