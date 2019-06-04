import React from "react";

import {Button, Card, Checkbox, Divider, Icon, Table, Tag} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {PAYMENT_MODES, INVOICES_API, PATIENT_PAYMENTS_API, TAXES} from "../../../constants/api";
import moment from "moment";
import {Link} from "react-router-dom";
import {Route, Switch} from "react-router";
import AddPayment from "./AddPayment";
import AddPaymentForm from "./AddPaymentForm";


class PatientPayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: [],
            active_practiceId: this.props.active_practiceId,
            loading: true
        }

    }

    componentDidMount() {
        this.loadPaymentModes();
        this.loadPayments();
        this.loadInvoices();
    }


    loadPayments() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                payments: data.results,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(PATIENT_PAYMENTS_API, successFn, errorFn, {
            id: this.props.match.params.id,
            practice: this.props.active_practiceId
        });
    }

    loadInvoices() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                invoices: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(INVOICES_API, [this.props.match.params.id]), successFn, errorFn);
    }

    loadPaymentModes() {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                paymentModes: data,
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(PAYMENT_MODES, [this.props.active_practiceId]), successFn, errorFn);
    }

    editInvoiceData(record) {
        this.setState({
            editInvoice: record,
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/billing/invoices/edit")

    }

    render() {
        const paymentmodes = {}
        if (this.state.paymentModes) {
            this.state.paymentModes.forEach(function (mode) {
                paymentmodes[mode.id] = mode.mode;
            })
        }
        const columns = [{
            title: 'INVOICE',
            dataIndex: 'invoice',
            key: 'invoice',
            render: invoice => <span>INV{invoice}</span>,
        }, {
            title: 'Amount Paid',
            key: 'pay_amount',
            dataIndex: 'pay_amount'
        }];


        if (this.props.match.params.id) {
            return <div>
                <Switch>
                    <Route exact path='/patient/:id/billing/payments/add'
                           render={(route) => <AddPaymentForm {...this.state} {...route} loadData={this.loadInvoices}/>}/>
                    <Route exact path='/patient/:id/billing/payments/edit'
                           render={(route) => <AddPayment {...this.state} {...route}/>}/>
                    <Route>
                        <div>
                            <Card
                                bodyStyle={{padding: 0}}
                                title={this.state.currentPatient ? this.state.currentPatient.name + " Payments" : "Payments"}
                                extra={<Button.Group>
                                    <Link
                                        to={"/patient/" + this.props.match.params.id + "/billing/payments/add"}><Button><Icon
                                        type="plus"/>Add</Button></Link>
                                </Button.Group>}>
                            </Card>
                            {this.state.payments.map(payment => <div>

                                <Card style={{marginTop: 20}}>
                                    <h4>{payment.created_at ? moment(payment.created_at).format('lll') : null}</h4>
                                    <Table loading={this.state.loading} columns={columns}
                                           pagination={false}
                                           dataSource={payment.invoices}/>
                                </Card>
                            </div>)}
                        </div>
                    </Route>
                </Switch>
            </div>
        }
        else {
            return <Card>
                <h2> select patient to further continue</h2>
            </Card>
        }

    }
}

export default PatientPayments;
