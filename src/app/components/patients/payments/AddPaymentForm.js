import React from "react";
import {Button, Card, Col, Divider, InputNumber, List, Popconfirm, Row, Select} from 'antd';
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
import {INVOICES_API, PATIENT_PAYMENTS_API, PAYMENT_MODES} from "../../../constants/api";
import {WARNING_MSG_TYPE} from "../../../constants/dataKeys";

class AddPaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoicesList: [],
            invoiceLoading: true,
            addedInvoiceId: {},
            addedInvoice: [],
            paymentModes: [],
            totalPayableAmount: 0,
            invoicePayments: {},
            totalPayingAmount: 0,
            selectedPaymentMode: null
        }
    }

    componentWillMount() {
        let that = this;
        if (this.props.editPayment && this.props.editPayment.invoices) {
            let addedInvoicesId = {};
            let addedInvoice = [];
            let totalPayingAmount = 0;
            this.props.editPayment.invoices.forEach(function (inv) {
                addedInvoicesId[inv.invoice] = true;
                addedInvoice.push({...inv, ...inv.invoice_data});
                totalPayingAmount += inv.pay_amount + inv.pay_amount_wallet
            })
            this.setState({
                addedInvoiceId: addedInvoicesId,
                addedInvoice: addedInvoice,
                // totalPayingAmount : totalPayingAmount
            },function(){
                    that.calculateInvoicePayments();
                    that.setPaymentAmount(totalPayingAmount);
            })


        }
        this.loadInvoices();
        this.loadPaymentModes();
    }

    loadPaymentModes = () => {
        var that = this;
        let successFn = function (data) {
            that.setState({
                paymentModes: data,
                selectedPaymentMode: data.length ? data[0].id : null
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PAYMENT_MODES, [this.props.active_practiceId]), successFn, errorFn);
    }
    loadInvoices = () => {
        let that = this;
        that.setState({
            invoiceLoading: true
        });
        let successFn = function (data) {
            that.setState(function (prevState) {
                return {
                    invoicesList: [...data.results, ...prevState.addedInvoice],
                    invoiceLoading: false,
                    loadMoreInvoice: data.next
                }
            }, function () {
                that.calculateInvoicePayments();
            })
        }
        let errorFn = function () {
            that.setState({
                invoiceLoading: false
            })

        }
        getAPI(INVOICES_API, successFn, errorFn, {
            page: that.state.loadMoreInvoice || 1,
            is_cancelled: false,
            is_pending: true,
            patient: this.props.match.params.id,
            practice: this.props.active_practiceId
        });
    }
    addInvoiceToPayments = (id) => {
        let that = this;
        this.setState(function (prevState) {
            let foundInvoice = null;
            prevState.invoicesList.forEach(function (invoice) {
                if (invoice.id == id)
                    foundInvoice = invoice
            })
            if (foundInvoice)
                return {
                    addedInvoice: [...prevState.addedInvoice, foundInvoice],
                    addedInvoiceId: {...prevState.addedInvoiceId, [id]: true},
                    invoicePayments: {...prevState.addedInvoiceId, [id]: 0}
                }
            return null
        }, function () {
            that.calculateInvoicePayments()
        })
    }

    removeInvoiceToPayments = (id) => {
        let that = this;
        this.setState(function (prevState) {
            let foundInvoice = [];
            prevState.addedInvoice.forEach(function (invoice) {
                if (invoice.id != id)
                    foundInvoice.push(invoice)
            })
            if (foundInvoice)
                return {
                    addedInvoice: foundInvoice,
                    addedInvoiceId: {...prevState.addedInvoiceId, [id]: false},
                }
            return null
        }, function () {
            that.calculateInvoicePayments();
        })
    }
    calculateInvoicePayments = () => {
        this.setState(function (prevState) {
            let payable = 0;
            let totalPayingAmount = prevState.totalPayingAmount;
            let invoicePayments = {};
            prevState.addedInvoice.forEach(function (invoice) {
                // invoice.inventory.forEach(function (invent) {
                //     payable += invent.total
                // });
                // invoice.procedure.forEach(function (proc) {
                //     payable += proc.unit * proc.total
                // });
                let invoicePayableAmount = invoice.total - invoice.payments_data + invoice.pay_amount + invoice.pay_amount_wallet
                payable += invoicePayableAmount;
                if (totalPayingAmount >= invoicePayableAmount) {
                    totalPayingAmount -= invoicePayableAmount;
                    invoicePayments[invoice.id] = invoicePayableAmount;
                } else {
                    invoicePayments[invoice.id] = totalPayingAmount;
                    totalPayingAmount = 0;
                }

            });

            return {
                totalPayableAmount: payable.toFixed(2),
                invoicePayments: invoicePayments
            }
        });
    }
    setPaymentAmount = (value) => {
        let that = this;
        this.setState({
            totalPayingAmount: value
        }, function () {
            that.calculateInvoicePayments();
        })
    }
    changeSelectedPaymentMode = (e) => {
        this.setState({
            selectedPaymentMode: e
        })
    }
    handleSubmit = (e) => {
        if (!this.state.totalPayingAmount) {
            displayMessage(WARNING_MSG_TYPE, "Payment Amount of O INR is not allowed.");
            return false
        }
        this.setState({
            loading: true
        })
        let that = this;
        let reqData = {
            "invoices": [],
            "bank": "",
            "number": 0,
            "is_advance": false,
            "is_active": true,
            "is_cancelled": false,
            "practice": that.props.active_practiceId,
            "patient": that.props.match.params.id,
            "payment_mode": that.state.selectedPaymentMode
        }
        let invoices = Object.keys(that.state.invoicePayments);
        invoices.forEach(function (invoiceId) {
            reqData.invoices.push({
                "pay_amount": that.state.invoicePayments[invoiceId],
                "is_active": true,
                "invoice": invoiceId
            })
        })
        let successFn = function (data) {
            that.setState({
                loading: false
            });
            if (that.props.loadData)
                that.props.loadData();
            that.props.history.push("/patient/" + that.props.match.params.id + "/billing/payments")
        }
        let errorFn = function () {
            that.setState({
                loading: false
            });
        }
        if(this.props.editPayment){
            reqData.id = this.props.editPayment.id
        }
        postAPI(PATIENT_PAYMENTS_API, reqData, successFn, errorFn)
    }

    render() {
        let that = this;
        return <div>
            <Row gutter={8}>
                <Col xs={24} sm={24} md={16} lg={16} xl={18} xxl={18}>
                    <Card>
                        <Row>
                            <Col span={24}>
                                {/*<Statistic title="Paid / Total " value={93} suffix={"/ " + invoice.total}/>*/}
                                {/*</Col>*/}
                                {/*<Col xs={24} sm={24} md={16} lg={16} xl={18} xxl={18}>*/}

                                <table style={{width: '100%'}}>
                                    <tr style={{borderBottom: '2px solid #ccc'}}>
                                        <td style={{width: '20%'}}>
                                            <small>INVOICE NO</small>
                                        </td>
                                        <td style={{width: '20%'}}>
                                            <small>PROCEDURE</small>
                                        </td>
                                        <td style={{width: '20%', textAlign: 'right'}}>
                                            <small>DUE (INR)</small>
                                        </td>
                                        <td style={{width: '20%', textAlign: 'right'}}>
                                            <small>PAY NOW (INR)</small>
                                        </td>
                                        <td style={{width: '20%', textAlign: 'right'}}>
                                            <small>DUE AFTER PAYMENT (INR)</small>
                                        </td>
                                    </tr>
                                    {/*{this.props.editPayment ? <>*/}

                                    {/*    {this.props.editPayment.invoices ? this.props.editPayment.invoices.map(invoice =>*/}
                                    {/*        <tr style={{borderBottom: '2px solid #ccc'}}>*/}

                                    {/*            <td>*/}
                                    {/*                <Button size={'small'} type={'danger'} shape={'circle'}*/}
                                    {/*                        icon={'close'}*/}
                                    {/*                        style={{position: 'absolute', right: '-35px'}}*/}
                                    {/*                        onClick={() => this.removeInvoiceToPayments(invoice.invoice_data.id)}/>*/}
                                    {/*                <h3>{invoice.invoice_data.invoice_id}</h3>*/}
                                    {/*                {invoice.invoice_data.date}*/}
                                    {/*            </td>*/}

                                    {/*            <td>*/}

                                    {/*                {invoice.invoice_data.procedure.map(proc => proc.procedure_data.name + ", ")}*/}
                                    {/*                {invoice.invoice_data.inventory.map(proc => proc.inventory_item_data.name + ", ")}*/}
                                    {/*                {invoice.invoice_data.reservation ? invoice.type + "," : null}*/}
                                    {/*                {invoice.invoice_data.reservation_data && invoice.invoice_data.reservation_data.medicines ? invoice.invoice_data.reservation_data.medicines.map(item => item.name + ',') : null}*/}
                                    {/*            </td>*/}
                                    {/*            <td style={{textAlign: 'right'}}>*/}
                                    {/*                <b>{(invoice.invoice_data.total - invoice.invoice_data.payments_data).toFixed(2)}</b>*/}
                                    {/*            </td>*/}
                                    {/*            <td style={{textAlign: 'right'}}>*/}
                                    {/*                <b>{that.state.invoicePayments[invoice.invoice_data.id]}</b></td>*/}
                                    {/*            <td style={{textAlign: 'right'}}>*/}
                                    {/*                <b>{(invoice.invoice_data.total - invoice.invoice_data.payments_data - that.state.invoicePayments[invoice.invoice_data.id]).toFixed(2)}</b>*/}
                                    {/*            </td>*/}
                                    {/*        </tr>*/}
                                    {/*    ) : null}*/}

                                    {/*</> : null}*/}
                                    {this.state.addedInvoice.map(invoice =>
                                        <tr style={{borderBottom: '2px solid #ccc'}}>
                                            <td>
                                                <Button size={'small'} type={'danger'} shape={'circle'} icon={'close'}
                                                        style={{position: 'absolute', right: '-35px'}}
                                                        onClick={() => this.removeInvoiceToPayments(invoice.id)}/>
                                                <h3>{invoice.invoice_id}</h3>
                                                {invoice.date}
                                            </td>
                                            <td>
                                                {invoice.procedure.map(proc => proc.procedure_data.name + ", ")}
                                                {invoice.inventory.map(proc => proc.inventory_item_data.name + ", ")}
                                                {invoice.reservation ? invoice.type + "," : null}
                                                {invoice.reservation_data && invoice.reservation_data.medicines ? invoice.reservation_data.medicines.map(item => item.name + ',') : null}
                                            </td>
                                            <td style={{textAlign: 'right'}}>
                                                <b>{(invoice.total - invoice.payments_data + invoice.pay_amount + invoice.pay_amount_wallet).toFixed(2)}</b></td>
                                            <td style={{textAlign: 'right'}}>
                                                <b>{that.state.invoicePayments[invoice.id]}</b></td>
                                            <td style={{textAlign: 'right'}}>
                                                <b>{(invoice.total - invoice.payments_data + invoice.pay_amount + invoice.pay_amount_wallet - that.state.invoicePayments[invoice.id]).toFixed(2)}</b>
                                            </td>
                                        </tr>
                                    )}
                                </table>
                            </Col>
                        </Row>
                        <Row style={{borderBottom: '2px dashed #ccc', marginTop: '20px'}}>
                            <Col span={6}><h3>Total Payable :</h3></Col>
                            <Col span={6}><h2>{this.state.totalPayableAmount}</h2></Col>
                        </Row>
                        <Row gutter={16} style={{marginTop: '20px'}}>
                            <Col span={6}><h3>Pay Now:</h3></Col>
                            <Col span={6}>
                                <InputNumber min={0} step={1} max={this.state.totalPayableAmount}
                                            value={this.state.totalPayingAmount} onChange={this.setPaymentAmount}/>
                            </Col>
                            <Col span={6}>
                                <Select style={{width: '100%'}} value={this.state.selectedPaymentMode}
                                        onChange={this.changeSelectedPaymentMode}>
                                    {this.state.paymentModes.map(mode => <Select.Option value={mode.id}>
                                        {mode.mode}
                                    </Select.Option>)}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Popconfirm
                                    title={"Are you sure to take payment of INR " + this.state.totalPayingAmount + "?"}
                                    onConfirm={this.handleSubmit}>
                                    <Button type={'primary'}>Save Payments</Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={6} lg={8} xl={6} xxl={6}>
                    <List loading={this.state.invoiceLoading} dataSource={this.state.invoicesList}
                          renderItem={invoice => (that.state.addedInvoiceId[invoice.id] ?
                              <div/> :
                              <Card hoverable
                                    onClick={() => this.addInvoiceToPayments(invoice.id)}
                                    style={{marginBottom: '10px'}}>
                                  <table style={{width: '100%'}}>
                                      <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}><h4>{invoice.invoice_id}</h4></td>
                                          <td style={{textAlign: 'right'}}><b>{invoice.date}</b></td>
                                      </tr>
                                  </table>
                                  <Divider style={{margin: 0}}/>
                                  <table style={{width: '100%'}}>
                                      {invoice.procedure.map(proc => <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}>{proc.procedure_data.name}</td>
                                          <td style={{textAlign: 'right'}}>
                                              <b>{(proc.unit * proc.unit_cost).toFixed(2)}</b></td>
                                      </tr>)}
                                      {invoice.inventory.map(proc => <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}>{proc.inventory_item_data.name}</td>
                                          <td style={{textAlign: 'right'}}>
                                              <b>{(proc.unit * proc.unit_cost).toFixed(2)}</b></td>
                                      </tr>)}
                                      {invoice.reservation ?
                                          <tr>
                                              <td style={{maxWidth: 'calc(100% - 60px)'}}>{invoice.type}</td>
                                              <td style={{textAlign: 'right'}}>
                                                  <b>{invoice.reservation_data.bed_package_price ? invoice.reservation_data.bed_package_price.toFixed(2) : null}</b>
                                              </td>
                                          </tr> : null}

                                      {invoice.reservation_data && invoice.reservation_data.medicines ? <>
                                              {invoice.reservation_data.medicines.map(item => <tr>
                                                  <td style={{maxWidth: 'calc(100% - 60px)'}}>{item.name}</td>
                                                  <td style={{textAlign: 'right'}}><b>{item.final_price.toFixed(2)}</b></td>
                                              </tr>)}
                                          </>
                                          : null}
                                  </table>
                                  <Divider style={{margin: 0}}/>
                                  <table style={{width: '100%'}}>
                                      <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}>Invoice Amount</td>
                                          <td style={{textAlign: 'right'}}><b>{invoice.total.toFixed(2)}</b></td>
                                      </tr>
                                      <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}>Paid Amount</td>
                                          <td style={{textAlign: 'right'}}>
                                              <b>{invoice.payments_data ? invoice.payments_data.toFixed(2) : 0}</b></td>
                                      </tr>
                                      <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}><b>Amount Due</b></td>
                                          <td style={{textAlign: 'right'}}>
                                              <b>{(invoice.total - invoice.payments_data).toFixed(2)}</b></td>
                                      </tr>
                                  </table>
                              </Card>)}/>
                </Col>
            </Row>
        </div>
    }
}

export default AddPaymentForm;
