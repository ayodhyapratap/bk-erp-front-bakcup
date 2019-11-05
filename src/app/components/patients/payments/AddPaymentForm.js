import React from "react";
import {Button, Card, Col, Divider, InputNumber, List, Popconfirm, Row, Select,DatePicker} from 'antd';
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {
    AVAILABLE_ADVANCE, BULK_PAYMENT_API,
    INVOICES_API,
    PATIENT_PAYMENTS_API,
    PAYMENT_MODES,
    SINGLE_PAYMENT_API
} from "../../../constants/api";
import {WARNING_MSG_TYPE} from "../../../constants/dataKeys";
import moment from "moment";
import {PROCEDURES} from "../../../constants/hardData";

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
            totalPayingFromAdvanceAmount: 0,
            selectedPaymentMode: null,
            availableAdvance: null,
            advanceToBeSent:0,
            selectDate:moment(),
        }
        this.loadEditPyament = this.loadEditPyament.bind(this);
    }

    componentWillMount() {
        let that = this;
        if (that.props.editPayment && that.props.editPayment.invoices) {
            that.loadEditPyament(that.props.editPayment.invoices);
            // let addedInvoicesId = {};
            // let addedInvoice = [];
            // let totalPayingAmount = 0;
            // this.props.editPayment.invoices.forEach(function (inv) {
            //     console.log("Item",inv);
            //     addedInvoicesId[inv.invoice] = true;
            //     addedInvoice.push({...inv, ...inv.invoice_data});
            //     totalPayingAmount += inv.pay_amount + inv.pay_amount_wallet
            // })
            // that.setState({
            //     addedInvoiceId: addedInvoicesId,
            //     addedInvoice: addedInvoice,
            //     // totalPayingAmount : totalPayingAmount
            // }, function () {
            //     console.log("Infinity Loop");
            //     that.calculateInvoicePayments();
            //     that.setPaymentAmount(totalPayingAmount);
            // })


        }
        this.loadInvoices();
        this.loadPaymentModes();
        this.loadAvailableAdvance();
    }

    loadEditPyament=(editPayment)=>{
        let that=this;
        let addedInvoicesId = {};
        let addedInvoice = [];
        let totalPayingAmount = 0;
        this.setState(function (prevState) {
            editPayment.forEach(function (inv) {
                console.log("Item",inv);
                addedInvoicesId[inv.invoice] = true;
                addedInvoice.push({...inv, ...inv.invoice_data});
                totalPayingAmount += inv.pay_amount + inv.pay_amount_wallet;

            },function () {
                that.calculateInvoicePayments();
                that.setPaymentAmount(totalPayingAmount);
            });
            return{
                addedInvoice:addedInvoice,
                addedInvoiceId: addedInvoicesId,
            }
        });



    };
    loadAvailableAdvance = () => {
        let that = this;
        let sucessFn = function (data) {
            that.setState({
                availableAdvance: data
            });
        }
        let errorFn = function () {

        }
        getAPI(interpolate(AVAILABLE_ADVANCE, [that.props.match.params.id]), sucessFn, errorFn, {
            practice_id: this.props.active_practiceId
        })
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
            let totalPayingAmount = prevState.totalPayingAmount + prevState.totalPayingFromAdvanceAmount;
            let invoicePayments = {};
            prevState.addedInvoice.forEach(function (invoice) {
                // invoice.inventory.forEach(function (invent) {
                //     payable += invent.total
                // });
                // invoice.procedure.forEach(function (proc) {
                //     payable += proc.unit * proc.total
                // });
                let invoicePayableAmount = invoice.total - invoice.payments_data;
                if (invoice.pay_amount)
                    invoicePayableAmount += invoice.pay_amount;
                if (invoice.pay_amount_wallet)
                    invoicePayableAmount += invoice.pay_amount_wallet;
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
                advanceToBeSent : totalPayingAmount,
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
    setPaymentFromAdvanceAmount = (value) => {
        let that = this;
        this.setState({
            totalPayingFromAdvanceAmount: value
        }, function () {
            that.calculateInvoicePayments();
        })
    }
    changeSelectedPaymentMode = (e) => {
        this.setState({
            selectedPaymentMode: e
        })
    };
    selectedDate=(value)=>{
      let that=this;
      that.setState({
          selectDate:value,
      })
    };
    handleSubmit = (e) => {
        if (!this.state.totalPayingAmount) {
            displayMessage(WARNING_MSG_TYPE, "Payment Amount of O INR is not allowed.");
            return false
        }
        this.setState({
            loading: true
        })
        let that = this;
        let newPayment = {
            "invoices": [],
            "bank": "",
            "number": 0,
            "is_active": true,
            "is_cancelled": false,
            "practice": that.props.active_practiceId,
            "patient": that.props.match.params.id,
            "payment_mode": that.state.selectedPaymentMode,
            advance_value: that.state.advanceToBeSent,
            "is_advance": !!that.state.advanceToBeSent,
            "date":moment(that.state.selectDate).format("YYYY-MM-DD"),
        }
        let reqData = []
        if (that.state.totalPayingAmount - that.state.totalPayableAmount > 1) {
            reqData.advance_value = that.state.totalPayingAmount - that.state.totalPayableAmount;
            reqData.is_advance = true;
        }
        let invoices = Object.keys(that.state.invoicePayments);
        let invoicePayments = {...that.state.invoicePayments};
        let totalAmountPayingFromAdvance = that.state.totalPayingFromAdvanceAmount;
        let consumedInvoices = 0;
        if (totalAmountPayingFromAdvance) {
            that.state.availableAdvance.data.forEach(function (availableAdvancePayments) {
                let maxConsumeAmount = totalAmountPayingFromAdvance;
                if (availableAdvancePayments.advance_value < maxConsumeAmount) {
                    maxConsumeAmount = availableAdvancePayments.advance_value;
                }
                while (totalAmountPayingFromAdvance && invoices.length > consumedInvoices) {
                    if (invoicePayments[invoices[consumedInvoices]] && maxConsumeAmount > invoicePayments[invoices[consumedInvoices]]) {
                        availableAdvancePayments.advance_value -= invoicePayments[invoices[consumedInvoices]];
                        availableAdvancePayments.invoices.push({
                            "pay_amount_advance": invoicePayments[invoices[consumedInvoices]],
                            "pay_amount": invoicePayments[invoices[consumedInvoices]],
                            "is_active": true,
                            "invoice": invoices[consumedInvoices],
                        });
                        consumedInvoices++;
                        totalAmountPayingFromAdvance -= invoicePayments[invoices[consumedInvoices]];
                        invoicePayments[invoices[consumedInvoices]] -= invoicePayments[invoices[consumedInvoices]];
                    } else if (invoicePayments[invoices[consumedInvoices]]) {
                        availableAdvancePayments.invoices.push({
                            "pay_amount_advance": maxConsumeAmount,
                            "pay_amount": maxConsumeAmount,
                            "is_active": true,
                            "invoice": invoices[consumedInvoices],
                        });

                        invoicePayments[invoices[consumedInvoices]] -= maxConsumeAmount;
                        totalAmountPayingFromAdvance -= maxConsumeAmount;
                        availableAdvancePayments.advance_value -= maxConsumeAmount;
                    }
                }
                reqData.push(availableAdvancePayments);
            });
        }

        for (; invoices.length > consumedInvoices; consumedInvoices++) {
            newPayment.invoices.push({
                "pay_amount": invoicePayments[invoices[consumedInvoices]],
                "type": "Invoice",
                "is_active": true,
                "invoice": invoices[consumedInvoices],
            });
        }
        if (this.props.editPayment && this.props.editPayment.id)
            newPayment.id = this.props.editPayment.id;
        if (newPayment.invoices.length || newPayment.id || newPayment.is_advance) {
            reqData.push(newPayment);
        }
        let successFn = function (data) {
            that.setState({
                loading: false
            });
            // if (that.props.loadData)
            that.props.loadData();
            that.props.history.push("/patient/" + that.props.match.params.id + "/billing/payments")
        };
        let errorFn = function () {
            that.setState({
                loading: false
            });
        };
        postAPI(BULK_PAYMENT_API, reqData, successFn, errorFn)
    };

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
                                    <tbody>
                                    <tr style={{borderBottom: '2px solid #ccc'}}>
                                        <td style={{width: '20%'}}>
                                            <small>INVOICE NO</small>
                                        </td>
                                        <td style={{width: '20%'}}>
                                            <small>PROCEDURE</small>
                                        </td>
                                        <td style={{width: '20%', textAlign: 'right'}}>
                                            <small>DUE(INR)</small>
                                        </td>
                                        <td style={{width: '20%', textAlign: 'right'}}>
                                            <small>PAY NOW(INR)</small>
                                        </td>
                                        <td style={{width: '20%', textAlign: 'right'}}>
                                            <small>DUE AFTER PAYMENT(INR)</small>
                                        </td>
                                    </tr>

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
                                                <b>{(invoice.total - invoice.payments_data + (invoice.pay_amount || 0) + (invoice.pay_amount_wallet || 0)).toFixed(2)}</b>
                                            </td>
                                            <td style={{textAlign: 'right'}}>
                                                <b>{that.state.invoicePayments[invoice.id]}</b></td>
                                            <td style={{textAlign: 'right'}}>
                                                <b>{(invoice.total - invoice.payments_data + (invoice.pay_amount || 0) + (invoice.pay_amount_wallet || 0) - that.state.invoicePayments[invoice.id]).toFixed(2)}</b>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row style={{borderBottom: '2px dashed #ccc', marginTop: '20px'}}>
                            <Col span={6}><h3>Total Payable :</h3></Col>
                            <Col span={6}><h2>{this.state.totalPayableAmount}</h2></Col>
                        </Row>
                        <Row gutter={16} style={{marginTop: '20px'}}>
                            <Col span={12}>
                                <Row>
                                    <Col span={12}>
                                        <h3>Amount From Advance :<br/>
                                            <small>Available: {this.state.availableAdvance ? this.state.availableAdvance.max_allowed : 0} INR</small>
                                        </h3>
                                    </Col>
                                    <Col span={12}>
                                        <InputNumber min={0} step={1}
                                                     max={this.state.availableAdvance ? this.state.availableAdvance.max_allowed : 0}
                                                     disabled={!this.state.availableAdvance || !this.state.availableAdvance.max_allowed}
                                                     value={this.state.totalPayingFromAdvanceAmount}
                                                     onChange={this.setPaymentFromAdvanceAmount}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <h3>Pay Now:</h3></Col>
                                    <Col span={12}>
                                        <InputNumber min={0} step={1}
                                                     value={this.state.totalPayingAmount}
                                                     onChange={this.setPaymentAmount}/>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span={6}>
                                <Select style={{width: '100%'}} value={this.state.selectedPaymentMode}
                                        onChange={this.changeSelectedPaymentMode}>
                                    {this.state.paymentModes.map(mode => <Select.Option value={mode.id} key={mode.id}>
                                        {mode.mode}
                                    </Select.Option>)}
                                </Select>

                                <Row>
                                    <Col span={6}>
                                        <br/>
                                        <span> &nbsp;&nbsp;on&nbsp;&nbsp;</span>
                                        <DatePicker style={{width:150}} defaultValue={moment()}  onChange={(value) => that.selectedDate(value)}/>
                                    </Col>
                                </Row>
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
                                      <tbody>
                                      <tr>
                                          <td style={{maxWidth: 'calc(100% - 60px)'}}><h4>{invoice.invoice_id}</h4></td>
                                          <td style={{textAlign: 'right'}}><b>{invoice.date}</b></td>
                                      </tr>
                                      </tbody>
                                  </table>
                                  <Divider style={{margin: 0}}/>
                                  <table style={{width: '100%'}}>
                                      <tbody>
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
                                      </tbody>
                                  </table>
                                  <Divider style={{margin: 0}}/>
                                  <table style={{width: '100%'}}>
                                      <tbody>
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
                                      </tbody>
                                  </table>

                              </Card>)}/>
                </Col>
            </Row>
        </div>
    }
}

export default AddPaymentForm;
