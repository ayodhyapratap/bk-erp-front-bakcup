import {Button, Card, Divider, Icon, List, Row, Table, Upload} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {VENDOR_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddExpenses from "./AddExpenses";
import {Link} from "react-router-dom";

export default class ExpensesList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            active_practiceId:this.props.active_practiceId,
            expenses:null
        };
        this.loadData=this.loadData.bind(this);
    }
    componentDidMount(){
        this.loadData();
    }
    loadData(){
        let that =this;
        let successFn = function (data) {
            that.setState({
                expenses:data
            })
        }
        let errorFn = function () {

        }
        getAPI(VENDOR_API ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
                <Route exact path='/inventory/expenses/add'
                   render={(route) => <AddExpenses {...this.state} {...route}/>}/>
            <Route exact path='/inventory/expenses/edit/:id'
                   render={(route) => <AddExpenses {...this.state} {...route}/>}/>
            <Card title="expensess" extra={<Link to={"/inventory/expenses/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>

            </Card>
        </Switch>
        </div>
    }
}
