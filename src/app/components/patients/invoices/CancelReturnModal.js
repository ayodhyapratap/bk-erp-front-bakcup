import React from "react";
import {Button, Card, Form, Icon, Input, Modal} from "antd";
import {
    CANCELINVOICE_RESENT_OTP,
    CANCELINVOICE_VERIFY_OTP,
    SINGLE_INVOICES_API
} from "../../../constants/api";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
class CancelReturnModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelIncoiceVisible: this.props.cancelIncoiceVisible,
            otpSent:this.props.otpSent,

        };
    }

    handleSubmitCancelInvoice = (e) => {
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
                        cancelIncoiceVisible: false,
                    });
                    that.deleteInvoice(that.props.patientId, that.props.invoiceId)
                };
                let errorFn = function () {

                };
                postAPI(CANCELINVOICE_VERIFY_OTP, reqData, successFn, errorFn);
            }
        });
    }


    deleteInvoice(patient, invoice) {
        let that = this;
        let reqData = {patient: patient, is_cancelled: true};
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "Invoice cancelled successfully")
            that.props.loadInvoices();
        }
        let errorFn = function () {
        }
        putAPI(interpolate(SINGLE_INVOICES_API, [invoice]), reqData, successFn, errorFn);
    }

    cancelInvoiceClose = () => {
        this.setState({
            cancelIncoiceVisible: false
        })
    }

    sendOTP() {
        let that = this;
        let successFn = function (data) {

        };
        let errorFn = function () {

        };
        getAPI(CANCELINVOICE_RESENT_OTP, successFn, errorFn);
    }

    render() {
        let that = this;
        const {getFieldDecorator} = that.props.form;
        return(
            <Modal
                visible={(that.state.cancelIncoiceVisible && that.props.editInvoice && that.props.editInvoice.id ==that.props.invoice.id)}
                title="Cancel Invoice"
                footer={null}
                onOk={that.handleSubmitCancelInvoice}
                onCancel={that.cancelInvoiceClose}
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
                        {that.props.otpSent ? <a style={{float: 'right'}} type="primary" onClick={that.sendOTP}>
                            Resend Otp ?
                        </a> : null}
                        <Button size="small" type="primary" htmlType="submit" onClick={that.handleSubmitCancelInvoice}>
                            Submit
                        </Button>&nbsp;
                        <Button size="small" onClick={that.cancelInvoiceClose}>
                            Close
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }


}
export default Form.create()(CancelReturnModal);