import React from "react";
import {Button, Card, Form, Icon, Input, Modal} from "antd";
import {CANCELINVOICE_RESENT_OTP, CANCELINVOICE_VERIFY_OTP} from "../../../constants/api";
import {getAPI, postAPI} from "../../../utils/common";
class EditReturnModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otpSent:this.props.otpSent,
            returnIncoiceVisible: this.props.returnIncoiceVisible,
            editIncoiceVisible: this.props.editIncoiceVisible,


        };
    }

    handleSubmitEditInvoice = (e) => {
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
                        editIncoiceVisible: false,
                    });
                    that.editInvoiceData(that.props.editInvoice)
                };
                let errorFn = function () {

                };
                postAPI(CANCELINVOICE_VERIFY_OTP, reqData, successFn, errorFn);
            }
        });
    };

    editInvoiceData = (record) => {
        let that = this;
        // let id = this.props.match.params.id;
        this.setState({
            editInvoice: record,
        }, function () {
            that.props.history.push("/patient/" + record.patient_data.id + "/billing/invoices/edit/")
        });
    };

    editInvoiceClose = () => {
        this.setState({
            editIncoiceVisible: false
        })
    };
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
                visible={(that.state.editIncoiceVisible && that.props.editInvoice && that.props.editInvoice.id == that.props.invoice.id)}
                title="Edit Invoice"
                footer={null}
                onOk={that.handleSubmitEditInvoice}
                onCancel={that.editInvoiceClose}
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
                        <Button size="small" type="primary" htmlType="submit" onClick={that.handleSubmitEditInvoice}>
                            Submit
                        </Button>&nbsp;
                        <Button size="small" onClick={that.editInvoiceClose}>
                            Close
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }


}
export default Form.create()(EditReturnModal);