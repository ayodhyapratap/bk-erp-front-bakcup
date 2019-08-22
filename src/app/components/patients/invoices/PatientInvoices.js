import React from "react";
import {
    Affix,
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Dropdown,
    Icon,
    Menu,
    Modal,
    Row,
    Spin,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Form, Input
} from "antd";
import {displayMessage, getAPI, interpolate, putAPI, postAPI} from "../../../utils/common";
import {
    DRUG_CATALOG,
    INVOICE_PDF_API,
    INVOICES_API,
    PROCEDURE_CATEGORY,
    SINGLE_INVOICES_API,
    TAXES,
    CANCELINVOICE_GENERATE_OTP,
    CANCELINVOICE_VERIFY_OTP,
    CANCELINVOICE_RESENT_OTP
} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import AddInvoicedynamic from "./AddInvoicedynamic";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {Link, Redirect} from "react-router-dom";
import {BACKEND_BASE_URL} from "../../../config/connect";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import ReturnInvoice from "./ReturnInvoice";

const confirm = Modal.confirm;

class PatientInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            invoices: [],
            drug_catalog: null,
            procedure_category: null,
            taxes_list: null,
            editInvoice: null,
            loading: true,
            cancelIncoiceVisible: false,
            otpSent: false,
            editIncoiceVisible: false,
            returnIncoiceVisible:false,
        }
        this.loadInvoices = this.loadInvoices.bind(this);
        this.loadDrugCatalog = this.loadDrugCatalog.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.loadTaxes = this.loadTaxes.bind(this);
        this.editInvoiceData = this.editInvoiceData.bind(this);

    }

    componentDidMount() {
        this.loadInvoices();
    }

    loadInvoices(page = 1) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current == 1) {
                that.setState({
                    total: data.count,
                    invoices: data.results,
                    loading: false,
                    loadMoreInvoice: data.next
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        invoices: [...prevState.invoices, ...data.results],
                        loading: false,
                        loadMoreInvoice: data.next
                    }
                })
            }
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
        getAPI(INVOICES_API, successFn, errorFn, apiParams);
    }

    loadDrugCatalog() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drug_catalog: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn)
    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
            })
        }
        let errorFn = function () {


        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadTaxes() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                taxes_list: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(TAXES, [this.props.active_practiceId]), successFn, errorFn);

    }

    editInvoiceData = (record) => {
        let that = this;
        // let id = this.props.match.params.id;
        this.setState({
            editInvoice: record,
        }, function () {
            that.props.history.push("/patient/" + record.patient_data.id + "/billing/invoices/edit/")
        });


    }
    returnInvoiceData = (record) => {
        let that = this;
        // let id = this.props.match.params.id;
        this.setState({
            editInvoice: record,
        }, function () {
            that.props.history.push("/patient/" + record.patient_data.id + "/billing/invoices/return/")
        });

    }
    returnModelOpen(record){
        console.log("return",record)
        let that = this;
        that.setState({
            returnIncoiceVisible: true,
            editInvoice: record,
        });
        let reqData = {
            practice: this.props.active_practiceId,
            type: 'Invoice' + ':' + record.invoice_id + ' ' + 'Return'
        }
        let successFn = function (data) {
            that.setState({
                otpSent: true,
                patientId: record.patient,
                invoiceId: record.id
            })
        }
        let errorFn = function () {

        };
        postAPI(CANCELINVOICE_GENERATE_OTP, reqData, successFn, errorFn);
    }

    returnInvoiceClose = () => {
        this.setState({
            returnIncoiceVisible: false
        })
    }

    handleSubmitReturnInvoice = (e) => {
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
                        returnIncoiceVisible: false,
                    });
                    that.returnInvoiceData(that.state.editInvoice)
                };
                let errorFn = function () {

                };
                postAPI(CANCELINVOICE_VERIFY_OTP, reqData, successFn, errorFn);
            }
        });
    }

   

    loadPDF = (id) => {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(INVOICE_PDF_API, [id]), successFn, errorFn);
    }

    editModelOpen = (record) => {
        let that = this;
        that.setState({
            editIncoiceVisible: true,
            editInvoice: record,
        });
        let reqData = {
            practice: this.props.active_practiceId,
            type: 'Invoice' + ':' + record.invoice_id + ' ' + 'Edit'
        }
        let successFn = function (data) {
            that.setState({
                otpSent: true,
                patientId: record.patient,
                invoiceId: record.id
            })
        }
        let errorFn = function () {

        };
        // postAPI(CANCELINVOICE_GENERATE_OTP, reqData, successFn, errorFn);
    };
    editInvoiceClose = () => {
        this.setState({
            editIncoiceVisible: false
        })
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
                    that.editInvoiceData(that.state.editInvoice)
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
            cancelIncoiceVisible: true,
        });
        let reqData = {
            practice: this.props.active_practiceId,
            type: 'Invoice' + ':' + record.invoice_id + ' ' + ' Cancellation'
        }
        let successFn = function (data) {
            that.setState({
                otpSent: true,
                patientId: record.patient,
                invoiceId: record.id
            })
        }
        let errorFn = function () {

        };
        // postAPI(CANCELINVOICE_GENERATE_OTP, reqData, successFn, errorFn);
    };


    sendOTP() {
        let that = this;
        let successFn = function (data) {

        }
        let errorFn = function () {

        }
        getAPI(CANCELINVOICE_RESENT_OTP, successFn, errorFn);
    }

    cancelInvoiceClose = () => {
        this.setState({
            cancelIncoiceVisible: false
        })
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
                    that.deleteInvoice(that.state.patientId, that.state.invoiceId)
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
            that.loadInvoices();
        }
        let errorFn = function () {
        }
        putAPI(interpolate(SINGLE_INVOICES_API, [invoice]), reqData, successFn, errorFn);
    }

    render() {
        let that = this;
        const drugs = {}
        if (this.state.drug_catalog) {

            this.state.drug_catalog.forEach(function (drug) {
                drugs[drug.id] = (drug.name + "," + drug.strength)
            })
        }
        const procedures = {}
        if (this.state.procedure_category) {
            this.state.procedure_category.forEach(function (procedure) {
                procedures[procedure.id] = procedure.name;
            })
        }

        const taxesdata = {}
        if (this.state.taxes_list) {
            this.state.taxes_list.forEach(function (tax) {
                taxesdata[tax.id] = tax.name;
            })
        }

        if (this.props.match.params.id) {
            return <div>
                <Switch>
                    <Route exact path='/patient/:id/billing/invoices/add'
                           render={(route) => <AddInvoicedynamic {...this.state} {...this.props} {...route}
                                                                 loadData={this.loadInvoices}/>}/>
                    <Route exact path='/patient/:id/billing/invoices/edit'
                           render={(route) => (
                               this.state.editInvoice ?
                                   <AddInvoicedynamic {...this.state} {...route}
                                                      editId={this.state.editInvoice.id}
                                                      loadData={this.loadInvoices}/> :
                                   <Redirect to={"/patient/" + this.props.match.params.id + "/billing/invoices"}/>
                           )}/>
                    <Route exact path='/patient/:id/billing/invoices/return'
                           render={(route) => (
                               this.state.editInvoice ?
                                   <ReturnInvoice {...this.state} {...route}
                                                  editId={this.state.editInvoice.id}
                                                  loadData={this.loadInvoices}/> :
                                   <Redirect to={"/patient/" + this.props.match.params.id + "/billing/invoices"}/>
                           )}/>
                    <Route>
                        <div>
                            <Alert banner showIcon type={"info"}
                                   message={"The invoices shown are only for the current selected practice!"}/>
                            <Affix offsetTop={0}>
                                <Card bodyStyle={{padding: 0}}
                                      style={{boxShadow: '0 5px 8px rgba(0, 0, 0, 0.09)'}}
                                      title={(this.state.currentPatient ? this.state.currentPatient.user.first_name + " Invoice " : "Invoices ") + (this.state.total ? `(Total:${this.state.total})` : '')}
                                      extra={<Button.Group>
                                          <Link to={"/patient/" + this.props.match.params.id + "/billing/invoices/add"}>
                                              <Button type={"primary"}>
                                                  <Icon type="plus"/>Add
                                              </Button>
                                          </Link>
                                      </Button.Group>}>
                                </Card>
                            </Affix>
                            {this.state.invoices.map(invoice => InvoiceCard(invoice, that))}
                            <Spin spinning={this.state.loading}>
                                <Row/>
                            </Spin>
                            <InfiniteFeedLoaderButton
                                loaderFunction={() => this.loadInvoices(this.state.loadMoreInvoice)}
                                loading={this.state.loading}
                                hidden={!this.state.loadMoreInvoice}/>

                        </div>
                    </Route>
                </Switch>
            </div>
        } else {
            return <div>
                <Affix offsetTop={0}>
                    <Card bodyStyle={{padding: 0}}
                          style={{boxShadow: '0 5px 8px rgba(0, 0, 0, 0.09)'}}
                          title={(this.state.currentPatient ? this.state.currentPatient.user.first_name + " Invoice " : "Invoice ") + (this.state.total ? `(Total:${this.state.total})` : '')}
                          extra={<Button.Group>
                              <Button type={"primary"} onClick={() => this.props.togglePatientListModal(true)}>
                                  <Icon type="plus"/>Add
                              </Button>
                          </Button.Group>}>
                    </Card>
                </Affix>
                {this.state.invoices.map(invoice => InvoiceCard(invoice, that))}
                <Spin spinning={this.state.loading}>
                    <Row/>
                </Spin>
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadInvoices(this.state.loadMoreInvoice)}
                                          loading={this.state.loading}
                                          hidden={!this.state.loadMoreInvoice}/>
            </div>
        }

    }
}

export default Form.create()(PatientInvoices);

function invoiceFooter(presc) {
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

function InvoiceCard(invoice, that) {
    let tableObjects = [];
    const {getFieldDecorator} = that.props.form;
    if (invoice.reservation) {
        let medicinesPackages = invoice.reservation_data.medicines.map(item => Object.create({
            ...item,
            unit: 1,
            total: item.final_price,
            unit_cost: item.price,
            discount: 0
        }));
        let mapper = {
            "NORMAL": {total: 'final_normal_price', tax: "normal_tax_value", unit_cost: "normal_price"},
            "TATKAL": {total: 'final_tatkal_price', tax: "tatkal_tax_value", unit_cost: "tatkal_price"}
        }
        tableObjects = [...tableObjects, {
            ...invoice.reservation_data.bed_package,
            unit: 1,
            total: invoice.reservation_data.bed_package ? invoice.reservation_data.bed_package[mapper[invoice.reservation_data.seat_type].total] : null,
            tax_value: invoice.reservation_data.bed_package ? invoice.reservation_data.bed_package[mapper[invoice.reservation_data.seat_type].tax] : null,
            unit_cost: invoice.reservation_data.bed_package ? invoice.reservation_data.bed_package[mapper[invoice.reservation_data.seat_type].unit_cost] : null
        }, ...medicinesPackages]
    }
    return <Card
        key={invoice.id}
        style={{marginTop: 10}}
        bodyStyle={{padding: 0}}
        title={<small>{invoice.date ? moment(invoice.date).format('ll') : null}
            {that.state.currentPatient ? null : <span>
            <Link to={"/patient/" + (invoice.patient_data ? invoice.patient_data.id : null) + "/billing/invoices"}>
                &nbsp;&nbsp; {invoice.patient_data ? invoice.patient_data.user.first_name : null} (ID: {invoice.patient_data ? invoice.patient_data.id : null})&nbsp;
            </Link>, {invoice.patient_data ? invoice.patient_data.gender : null}</span>}
        </small>}
        extra={<Dropdown.Button
            size={"small"}
            style={{float: 'right'}}
            overlay={<Menu>
                <Menu.Item key="1">
                    {/* onClick={() => that.editInvoiceData(invoice)} disabled={!that.props.match.params.id}> */}
                    <Link
                        to={"/patient/" + (invoice.patient_data ? invoice.patient_data.id : null) + "/billing/payments/add"}>
                        <Icon type="dollar"/>
                        &nbsp;
                        Pay
                    </Link>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="2" onClick={() => that.editModelOpen(invoice)}
                           disabled={(invoice.practice != that.props.active_practiceId) || invoice.payments_data || invoice.is_cancelled}>
                    <Icon type="edit"/>
                    Edit
                </Menu.Item>
                {/*<Menu.Item key="5" onClick={() => that.returnModelOpen(invoice)}*/}
                {/*           disabled={(invoice.practice != that.props.active_practiceId) || invoice.payments_data || invoice.is_cancelled}>*/}
                {/*    <Icon type="redo"/>*/}
                {/*    Return*/}
                {/*</Menu.Item>*/}
                <Menu.Item key="3" onClick={() => that.cancelModalOpen(invoice)}
                           disabled={(invoice.practice != that.props.active_practiceId) || invoice.payments_data || invoice.is_cancelled}>
                    <Icon type="delete"/>
                    Cancel
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="4">
                    <Link to={"/patient/" + invoice.patient + "/emr/timeline"}>
                        <Icon type="clock-circle"/>
                        Patient Timeline
                    </Link>
                </Menu.Item>
            </Menu>}>
            <a onClick={() => that.loadPDF(invoice.id)}><Icon
                type="printer"/></a>
        </Dropdown.Button>}>
        <Row gutter={8}>
            <Col xs={24} sm={24} md={6} lg={4} xl={4} xxl={4} style={{padding: 10}}>
                {invoice.is_cancelled ?
                    <Alert message="Cancelled" type="error" showIcon/> : null}
                <Divider style={{marginBottom: 0}}>{invoice.invoice_id}</Divider>
                <Statistic title="Paid / Total "
                           value={(invoice.payments_data ? invoice.payments_data.toFixed(2) : 0)}
                           suffix={"/ " + invoice.total.toFixed(2)}/>
            </Col>
            <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>
                {invoice.type == "Membership Amount." ?
                    <Table
                        bordered={true}
                        pagination={false}
                        columns={columns}
                        dataSource={[{
                            inventory: true,
                            name: "Membership",
                            unit_cost: invoice.total,
                            unit: 1,
                            discount_value: 0,
                            tax_value: 0,
                            total: invoice.total
                        }]}
                        footer={() => invoiceFooter({practice: invoice.practice_data})}/> :
                    <Table
                        bordered={true}
                        pagination={false}
                        columns={columns}
                        dataSource={[...tableObjects, ...invoice.inventory, ...invoice.procedure]}
                        footer={() => invoiceFooter({practice: invoice.practice_data})}/>}
            </Col>
        </Row>

        <Modal
            visible={that.state.cancelIncoiceVisible}
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
                    {that.state.otpSent ? <a style={{float: 'right'}} type="primary" onClick={that.sendOTP}>
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


        <Modal
            visible={that.state.editIncoiceVisible}
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
                    {that.state.otpSent ? <a style={{float: 'right'}} type="primary" onClick={that.sendOTP}>
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

        <Modal
            visible={that.state.returnIncoiceVisible}
            title="Return Invoice"
            footer={null}
            onOk={that.handleSubmitReturnInvoice}
            onCancel={that.returnInvoiceClose}
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
                    <Button size="small" type="primary" htmlType="submit" onClick={that.handleSubmitReturnInvoice}>
                        Submit
                    </Button>&nbsp;
                    <Button size="small" onClick={that.returnInvoiceClose}>
                        Close
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </Card>
}

const columns = [{
    title: 'Treatment & Products',
    dataIndex: 'drug',
    key: 'drug',
    render: (text, record) => (
        <span> <b>{record.name ? record.name : null}</b>
                    <br/> {record.doctor_data ?
                <Tag color={record.doctor_data ? record.doctor_data.calendar_colour : null}>
                    <b>{"prescribed by  " + record.doctor_data.user.first_name} </b>
                </Tag> : null}
                </span>)
}, {
    title: 'Cost',
    dataIndex: 'unit_cost',
    key: 'unit_cost',
    render: (item, record) => <span>{record.unit_cost ? record.unit_cost.toFixed(2) : null}</span>
}, {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
}, {
    title: 'Discount',
    dataIndex: 'discount_value',
    key: 'discount_value',
    render: (item, record) => <span>{record.discount_value ? record.discount_value.toFixed(2) : null}</span>
}, {
    title: 'Tax',
    dataIndex: 'tax_value',
    key: 'tax_value',
    render: (item, record) => <span>{record.tax_value ? record.tax_value.toFixed(2) : null}</span>
}, {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: item => item ? item.toFixed(2) : null
}];
