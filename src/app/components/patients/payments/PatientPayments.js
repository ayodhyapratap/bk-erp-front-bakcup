import React from "react";

import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Dropdown,
    Icon,
    Menu,
    Row,
    Spin,
    Table,
    Tag,
    Tooltip,
    Form,
    Input, Statistic
} from "antd";
import {displayMessage, getAPI, interpolate, putAPI, postAPI} from "../../../utils/common";
import {
    PATIENT_PAYMENTS_API,
    PAYMENT_PDF,
    SINGLE_PAYMENT_API,
    CANCELINVOICE_VERIFY_OTP,
    CANCELINVOICE_GENERATE_OTP,
    CANCELINVOICE_RESENT_OTP
} from "../../../constants/api";
import moment from "moment";
import {Link, Redirect} from "react-router-dom";
import {Route, Switch} from "react-router";
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
            loading: true,
            otpSent: false,
            editPaymentVisible: false,
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


    editPaymentData(record) {
        this.setState({
            editPayment: record,
        });
        // let id = this.props.match.params.id
        this.props.history.push("/patient/" + record.patient + "/billing/payments/edit")

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

    deletePayment(patient, payment) {
        console.log("Canceled", payment)
        let that = this;
        let reqData = {patient: patient, is_cancelled: true};
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "Payment cancelled successfully")
            that.loadPayments();
        }
        let errorFn = function () {
        }
        console.log("reqdata", reqData)
        putAPI(interpolate(SINGLE_PAYMENT_API, [payment]), reqData, successFn, errorFn);

    }

    editModelOpen = (record) => {
        let that = this;
        that.setState({
            editPaymentVisible: true,
            editPayment: record,
        });
        let reqData = {
            practice: this.props.active_practiceId,
            type: 'Payment' + ':' + record.payment_id + ' ' + 'Edit'
        }
        let successFn = function (data) {
            that.setState({
                otpSent: true,
                patientId: record.patient,
                paymentId: record.payment_id
            })
        }
        let errorFn = function () {

        };

        postAPI(CANCELINVOICE_GENERATE_OTP, reqData, successFn, errorFn);
    };
    editPaymentClose = () => {
        this.setState({
            editPaymentVisible: false
        })
    }

    handleSubmitEditPayment = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let reqData = {
                    ...values,
                    practice: this.props.active_practiceId,
                }
                let successFn = function (data) {
                    that.setState({
                        editPaymentVisible: false,
                    });
                    that.editPaymentData(that.state.editPayment)
                };
                let errorFn = function () {

                };
                postAPI(CANCELINVOICE_VERIFY_OTP, reqData, successFn, errorFn);
            }
        });
    }

    cancelModalOpen = (record) => {
        let that = this;
        that.setState({
            cancelPaymentVisible: true,
            editPayment: record,
        });
        let reqData = {
            practice: this.props.active_practiceId,
            type: 'Payment' + ':' + record.payment_id + ' ' + ' Cancellation'
        }
        let successFn = function (data) {
            that.setState({
                otpSent: true,
                patientId: record.patient,
                paymentId: record.id
            })
        }
        let errorFn = function () {

        };

        postAPI(CANCELINVOICE_GENERATE_OTP, reqData, successFn, errorFn);
    };


    handleSubmitCancelPayment = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let reqData = {
                    ...values,
                    practice: this.props.active_practiceId,
                }
                let successFn = function (data) {
                    that.setState({
                        cancelPaymentVisible: false,
                    });
                    that.deletePayment(that.state.patientId, that.state.paymentId)
                };
                let errorFn = function () {

                };
                postAPI(CANCELINVOICE_VERIFY_OTP, reqData, successFn, errorFn);
            }
        });
    }

    sendOTP() {
        let that = this;
        let successFn = function (data) {

        }
        let errorFn = function () {

        }
        getAPI(CANCELINVOICE_RESENT_OTP, successFn, errorFn);
    }

    cancelPaymentClose = () => {
        this.setState({
            cancelPaymentVisible: false
        })
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
                           render={(route) => <AddPaymentForm {...this.state} {...route} {...this.props}
                                                              loadData={this.loadPayments}/>}/>
                    <Route exact path='/patient/:id/billing/payments/edit'
                           render={(route) => (that.state.editPayment ?
                               <AddPaymentForm {...this.state} {...route} loadData={this.loadPayments}/> :
                               <Redirect to={"/patient/" + route.match.params.id + "/billing/payments"}/>)
                           }/>
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

export default Form.create()(PatientPayments);

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
    const {getFieldDecorator} = that.props.form;
    let advancePay = [];
    if(payment.is_advance){
        advancePay.push({
            invoice_id:"Advance Payment",
            pay_amount : payment.advance_value
        })
    }
    return <Card style={{marginTop: 10}}
                 key={payment.id}
                 bodyStyle={{padding: 0}}
                 title={(payment.patient_data && !that.props.currentPatient ?
                     <small>{payment.created_at ? moment(payment.created_at).format('lll') : null}
                         <Link to={"/patient/" + payment.patient_data.id + "/billing/payments"}>
                             &nbsp;&nbsp; {payment.patient_data.user.first_name} (ID: {payment.patient_data.custom_id?payment.patient_data.custom_id:payment.patient_data.id})&nbsp;
                         </Link>
                         <span>, {payment.patient_data.gender}</span></small>
                     : <small>{payment.created_at ? moment(payment.created_at).format('lll') : null}</small>)}
                 extra={<Dropdown.Button
                     size={"small"}
                     style={{float: 'right'}}
                     overlay={<Menu>
                         <Menu.Item key="2" onClick={() => that.editModelOpen(payment)}
                                    disabled={(payment.practice != that.props.active_practiceId)}>
                             <Icon type="edit"/>
                             Edit
                         </Menu.Item>
                         <Menu.Item key="3" onClick={() => that.cancelModalOpen(payment)}
                                    disabled={(payment.practice != that.props.active_practiceId) || payment.is_cancelled}>
                             <Icon type="delete"/>
                             Cancel
                         </Menu.Item>
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
                       dataSource={[...payment.invoices,...advancePay]} rowKey={payment.id}/>
            </Col>
        </Row>

        <Modal
            visible={(that.state.editPaymentVisible && that.state.editPayment && that.state.editPayment.id == payment.id)}
            title="Edit Payment"
            footer={null}
            onOk={that.handleSubmitEditPayment}
            onCancel={that.editPaymentClose}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('otp', {
                        rules: [{required: true, message: 'Please input Otp!'}],
                    })(
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Otp"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {that.state.otpSent ? <a style={{float: 'right'}} type="primary" onClick={that.sendOTP}>
                        Resend Otp ?
                    </a> : null}
                    <Button size="small" type="primary" htmlType="submit" onClick={that.handleSubmitEditPayment}>
                        Submit
                    </Button>&nbsp;
                    <Button size="small" onClick={that.editPaymentClose}>
                        Close
                    </Button>
                </Form.Item>
            </Form>
        </Modal>

        <Modal
            visible={(that.state.cancelPaymentVisible && that.state.editPayment && that.state.editPayment.id == payment.id)}
            title="Cancel Payment"
            footer={null}
            onOk={that.handleSubmitCancelPayment}
            onCancel={that.cancelPaymentClose}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('otp', {
                        rules: [{required: true, message: 'Please input Otp!'}],
                    })(
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Otp"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {that.state.otpSent ? <a style={{float: 'right'}} type="primary" onClick={that.sendOTP}>
                        Resend Otp ?
                    </a> : null}
                    <Button size="small" type="primary" htmlType="submit" onClick={that.handleSubmitCancelPayment}>
                        Submit
                    </Button>&nbsp;
                    <Button size="small" onClick={that.cancelPaymentClose}>
                        Close
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
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
