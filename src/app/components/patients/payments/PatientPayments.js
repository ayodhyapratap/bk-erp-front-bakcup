import React from "react";

import {Alert, Button, Card, Col, Divider, Dropdown, Icon, Menu, Row, Spin, Table, Tag, Tooltip} from "antd";
import {displayMessage, getAPI, interpolate, putAPI} from "../../../utils/common";
import {PATIENT_PAYMENTS_API, PAYMENT_PDF, SINGLE_PAYMENT_API} from "../../../constants/api";
import moment from "moment";
import {Link} from "react-router-dom";
import {Route, Switch} from "react-router";
import AddPayment from "./AddPayment";
import AddPaymentForm from "./AddPaymentForm";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {BACKEND_BASE_URL} from "../../../config/connect";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {Modal} from "antd/lib/index";

const confirm = Modal.confirm;

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
        this.loadPayments();
    }


    loadPayments = (page = 1) => {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1)
                    return {
                        payments: [...data.results],
                        next: data.next,
                        loading: false
                    }
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


    editInvoiceData(record) {
        this.setState({
            editInvoice: record,
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/billing/invoices/edit")

    }

    loadPDF = (id) => {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(PAYMENT_PDF, [id]), successFn, errorFn);
    }

    deletePayment(record) {
        let that = this;
        confirm({
            title: 'Are you sure to cancel this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {patient: record.patient, is_cancelled: true};
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Payment cancelled successfully")
                    that.loadPayments();
                }
                let errorFn = function () {
                }
                putAPI(interpolate(SINGLE_PAYMENT_API, [record.id]), reqData, successFn, errorFn);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        console.log("propsssss",this.props)
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
                           render={(route) => <AddPaymentForm {...this.state} {...route} {...this.props}
                                                              loadData={this.loadPayments}/>}/>
                    <Route exact path='/patient/:id/billing/payments/edit'
                           render={(route) => <AddPayment {...this.state} {...route} {...this.props}/>}/>
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
        } else {
            return <div>
                <Card
                    bodyStyle={{padding: 0}}
                    title={this.state.currentPatient ? this.state.currentPatient.name + " Payments" : "Payments"}
                    extra={<Button.Group>
                        {/* onClick={() => this.props.togglePatientListModal(true)} */}
                       <Button type={"primary"} onClick={() => this.props.togglePatientListModal(true)}>
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
    dataIndex: 'invoice_id',
    key: 'invoice',
    render: invoice => <span>{invoice}</span>,
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
                     : <small>{payment.created_at ? moment(payment.created_at).format('lll') : null}</small>)}
                 extra={<Dropdown.Button
                     size={"small"}
                     style={{float: 'right'}}
                     overlay={<Menu>
                         {/*<Menu.Item key="2" onClick={() => that.editInvoiceData(payment)}*/}
                         {/*disabled={(payment.practice != that.props.active_practiceId)}>*/}
                         {/*<Icon type="edit"/>*/}
                         {/*Edit*/}
                         {/*</Menu.Item>*/}
                         {/*<Menu.Item key="3" onClick={() => that.deletePayment(payment)}*/}
                         {/*disabled={(payment.practice != that.props.active_practiceId) || payment.is_cancelled}>*/}
                         {/*<Icon type="delete"/>*/}
                         {/*Cancel*/}
                         {/*</Menu.Item>*/}
                         <Menu.Divider/>
                         <Menu.Item key="4">
                             <Link to={"/patient/" + payment.patient + "/emr/timeline"}>
                                 <Icon type="clock-circle"/>
                                 Patient Timeline
                             </Link>
                         </Menu.Item>
                     </Menu>}>
                     <a onClick={() => that.loadPDF(payment.id)}><Icon
                         type="printer"/></a>
                 </Dropdown.Button>}>
        <Row gutter={8}>
            <Col xs={24} sm={24} md={6} lg={4} xl={4} xxl={4} style={{padding: 10}}>
                {payment.is_cancelled ?
                    <Alert message="Cancelled" type="error" showIcon/> : null}
                <Divider style={{marginBottom: 0}}>{payment.payment_id}</Divider>
            </Col>
            <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>

                    <Table columns={columns}
                           pagination={false}
                           footer={() => PaymentFooter({practice: payment.practice_data})}
                           dataSource={payment.invoices}/>
            </Col>
        </Row>
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
