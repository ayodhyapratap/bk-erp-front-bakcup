import React from "react";

import {Button, Card, Checkbox, Divider, Icon, Spin, Table, Tag, Row, Alert, Tooltip} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {PAYMENT_MODES, INVOICES_API, PATIENT_PAYMENTS_API, TAXES} from "../../../constants/api";
import moment from "moment";
import {Link} from "react-router-dom";
import {Route, Switch} from "react-router";
import AddPayment from "./AddPayment";
import AddPaymentForm from "./AddPaymentForm";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";


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


    loadPayments = (page = 1) => {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                return {
                    payments: [...prevState.payments, ...data.results],
                    next: data.next,
                    loading: false
                }
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        let apiParams = {
            page: page,
            practice: this.props.active_practiceId,
        };
        if (this.props.match.params.id) {
            apiParams.patient = this.props.match.params.id;
        }
        // if (this.props.showAllClinic && this.props.match.params.id) {
        //     delete (apiParams.practice)
        // }
        getAPI(PATIENT_PAYMENTS_API, successFn, errorFn, apiParams);
    }

    loadInvoices = () => {
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
        let that = this;
        const paymentmodes = {}
        if (this.state.paymentModes) {
            this.state.paymentModes.forEach(function (mode) {
                paymentmodes[mode.id] = mode.mode;
            })
        }


        if (this.props.match.params.id) {
            return <div>

                <Switch>
                    <Route exact path='/patient/:id/billing/payments/add'
                           render={(route) => <AddPaymentForm {...this.state} {...route}
                                                              loadData={this.loadPayments}/>}/>
                    <Route exact path='/patient/:id/billing/payments/edit'
                           render={(route) => <AddPayment {...this.state} {...route}/>}/>
                    <Route>
                        <div>
                            <Alert banner showIcon type={"info"}
                                   message={"The payments shown are only for the current selected practice!"}/>
                            <Card
                                bodyStyle={{padding: 0}}
                                title={this.state.currentPatient ? this.state.currentPatient.name + " Payments" : "Payments"}
                                extra={<Button.Group>
                                    <Link
                                        to={"/patient/" + this.props.match.params.id + "/billing/payments/add"}><Button><Icon
                                        type="plus"/>Add</Button></Link>
                                </Button.Group>}>
                            </Card>
                            {this.state.payments.map(payment => PaymentCard(payment, this))}
                            <Spin spinning={this.state.loading}>
                                <Row/>
                            </Spin>
                            <InfiniteFeedLoaderButton loaderFunction={() => this.loadPayments(that.state.next)}
                                                      loading={this.state.loading}
                                                      hidden={!this.state.next}/>
                        </div>
                    </Route>
                </Switch>
            </div>
        }
        else {
            return <div>
                <Card
                    bodyStyle={{padding: 0}}
                    title={this.state.currentPatient ? this.state.currentPatient.name + " Payments" : "Payments"}
                    extra={<Button.Group>
                        <Button type={"primary"} onClick={() => that.props.togglePatientListModal(true)}>
                            <Icon type="plus"/>Add
                        </Button>
                    </Button.Group>}>
                </Card>
                {this.state.payments.map(payment => PaymentCard(payment, this))}
                <Spin spinning={this.state.loading}>
                    <Row/>
                </Spin>
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadPayments(that.state.next)}
                                          loading={this.state.loading}
                                          hidden={!this.state.next}/>

            </div>
        }

    }
}

export default PatientPayments;

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

function PaymentCard(payment, that) {
    return <Card style={{marginTop: 10}}
                 bodyStyle={{padding: 0}}
                 title={(payment.patient_data && !that.props.currentPatient ?
                     <small>{payment.created_at ? moment(payment.created_at).format('lll') : null}
                         <Link to={"/patient/" + payment.patient_data.id + "/billing/payments"}>
                             &nbsp;&nbsp; {payment.patient_data.user.first_name} (ID: {payment.patient_data.id})&nbsp;
                         </Link>
                         <span>, {payment.patient_data.gender}</span></small>
                     : <small>{payment.created_at ? moment(payment.created_at).format('lll') : null}</small>)}>
        <Table columns={columns}
               pagination={false}
               footer={() => PaymentFooter({practice: payment.practice_data})}
               dataSource={payment.invoices}/>
    </Card>
}

function PaymentFooter(presc) {
    if (presc) {
        return <p>
            {presc.doctor ? <Tooltip title="Doctor"><Tag color={presc.doctor ? presc.doctor.calendar_colour : null}>
                <b>{"prescribed by  " + presc.doctor.user.first_name} </b>
            </Tag></Tooltip> : null}
            {presc.practice ? <Tag style={{float: 'right'}}>
                <Tooltip title="Practice Name">
                    <b>{presc.practice.name} </b>
                </Tooltip>
            </Tag> : null}
        </p>
    }
    return null
}
