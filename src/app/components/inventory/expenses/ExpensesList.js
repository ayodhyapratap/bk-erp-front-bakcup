import {Button, Card, Divider, Icon, List, Row, Table, Upload} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {EXPENSES_API, VENDOR_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddExpenses from "./AddExpenses";
import {Link} from "react-router-dom";

export default class ExpensesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_practiceId: this.props.active_practiceId,
            expenses: null
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                expenses: data
            })
        }
        let errorFn = function () {

        }
        getAPI(EXPENSES_API, successFn, errorFn);
    }

    render() {
        const expenseColoumns = [{
            title: 'Expense Date',
            key: 'expense_date',
            dataIndex: 'expense_date',

        },{
            title: 'Expense Type',
            key: 'expense_type',
            dataIndex: 'expense_type'
        }, {
            title: 'Vendor',
            key: 'vendor',
            dataIndex: 'vendor'
        }, {
            title: 'Payment Mode',
            key: 'payment_mode',
            dataIndex: 'payment_mode'
        }, {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount'
        }, {
            title: 'Action',
            render: function (record) {
                return <div>
                    <Link to={'/inventory/expenses/edit/' + record.id}>Edit</Link>
                </div>
            }
        }]
        return <div><Switch>
            <Route exact path='/inventory/expenses/add'
                   render={(route) => <AddExpenses {...this.state} {...route} loadData={this.loadData}/>}/>
            <Route exact path='/inventory/expenses/edit/:id'
                   render={(route) => <AddExpenses {...this.state} {...route} loadData={this.loadData}/>}/>
            <Card title="Expensess" extra={<Link to={"/inventory/expenses/add"}> <Button type="primary"><Icon
                type="plus"/> Add</Button></Link>}>
                <Table dataSource={this.state.expenses} columns={expenseColoumns}/>
            </Card>
        </Switch>
        </div>
    }
}
