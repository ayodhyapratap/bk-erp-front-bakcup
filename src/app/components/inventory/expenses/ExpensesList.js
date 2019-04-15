import {Button, Card, Icon} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {EXPENSES_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddExpenses from "./AddExpenses";
import {Link} from "react-router-dom";
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";

export default class ExpensesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_practiceId: this.props.active_practiceId,
            expenses: null,
            loading:true
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
                expenses: data,
                loading:false
            })
            console.log("log data",that.state.expenses)
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        getAPI(EXPENSES_API, successFn, errorFn);
    }

    render() {
        const expenseColoumns = [{
            title: 'Expense Date',
            key: 'expense_date',
            dataIndex: 'expense_date',
            export: function (text) {
                return moment(text).format('lll');
            },
            render: function (text) {
                return moment(text).format('lll');
            }
        }, {
            title: 'Expense Type',
            key: 'expense_type',
            dataIndex: 'expense_type.name',

        }, {
            title: 'Vendor',
            key: 'vendor',
            dataIndex: 'vendor.name'
        }, {
            title: 'Payment Mode',
            key: 'payment_mode',
            dataIndex: 'payment_mode.mode'
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
                <CustomizedTable loading={this.state.loading} dataSource={this.state.expenses} columns={expenseColoumns}/>
            </Card>
        </Switch>
        </div>
    }
}
