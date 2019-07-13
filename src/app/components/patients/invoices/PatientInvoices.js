import React from "react";
import {
    Button,
    Card,
    Divider,
    Icon,
    Table,
    Tag,
    Row,
    Col,
    Statistic,
    Affix,
    Alert,
    Menu,
    Dropdown,
    Modal,
    Spin, Tooltip
} from "antd";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {
    DRUG_CATALOG, INVOICE_PDF_API,
    INVOICES_API,
    PRESCRIPTION_PDF,
    PRESCRIPTIONS_API,
    PROCEDURE_CATEGORY, SINGLE_INVOICES_API,
    TAXES
} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import AddInvoice from "./AddInvoice";
import AddInvoicedynamic from "./AddInvoicedynamic";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {Link, Redirect} from "react-router-dom";
import {BACKEND_BASE_URL} from "../../../config/connect";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";

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
            loading: true
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

    deleteInvoice(record) {
        let that = this;
        confirm({
            title: 'Are you sure to cancel this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {patient: record.patient,is_cancelled: true};
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Invoice cancelled successfully")
                    that.loadInvoices();
                }
                let errorFn = function () {
                }
                putAPI(interpolate(SINGLE_INVOICES_API, [record.id]), reqData, successFn, errorFn);
            },
            onCancel() {
                console.log('Cancel');
            },
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

export default PatientInvoices;

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
    return <Card
        key={invoice.id}
        style={{marginTop: 10}}
        bodyStyle={{padding: 0}}
        title={<small>{invoice.date ? moment(invoice.date).format('ll') : null}
            {that.state.currentPatient ? null : <span>
            <Link to={"/patient/" + invoice.patient_data.id + "/billing/invoices"}>
                &nbsp;&nbsp; {invoice.patient_data.user.first_name} (ID: {invoice.patient_data.id})&nbsp;
            </Link>, {invoice.patient_data.gender}</span>}
        </small>}
        extra={<Dropdown.Button
            size={"small"}
            style={{float: 'right'}}
            overlay={<Menu>
                <Menu.Item key="1"
                           onClick={() => that.editInvoiceData(invoice)} disabled={!that.props.match.params.id}>
                    <Link to={"/patient/" + invoice.patient_data.id + "/billing/payments/add"}>
                        <Icon type="dollar"/>
                        &nbsp;
                        Pay
                    </Link>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="2" onClick={() => that.editInvoiceData(invoice)}
                           disabled={(invoice.practice != that.props.active_practiceId) || invoice.payments_data || invoice.is_cancelled}>
                    <Icon type="edit"/>
                    Edit
                </Menu.Item>
                <Menu.Item key="3" onClick={() => that.deleteInvoice(invoice)}
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
                <Divider style={{marginBottom: 0}}>INV{invoice.id}</Divider>
                <Statistic title="Paid / Total "
                           value={(invoice.payments_data ? invoice.payments_data : 0)}
                           suffix={"/ " + invoice.total}/>
            </Col>
            <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>
                <Table
                    bordered={true}
                    pagination={false}
                    columns={columns}
                    dataSource={[...invoice.inventory, ...invoice.procedure]}
                    footer={() => invoiceFooter({practice: invoice.practice_data})}/>
            </Col>
        </Row>
    </Card>
}

const columns = [{
    title: 'Treatment & Products',
    dataIndex: 'drug',
    key: 'drug',
    render: (text, record) => (
        <span> <b>{record.inventory ? record.name : null}{record.procedure ? record.name : null}</b>
                    <br/> {record.doctor_data ?
                <Tag color={record.doctor_data ? record.doctor_data.calendar_colour : null}>
                    <b>{"prescribed by  " + record.doctor_data.user.first_name} </b>
                </Tag> : null}
                </span>)
}, {
    title: 'Cost',
    dataIndex: 'unit_cost',
    key: 'unit_cost',
}, {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
}, {
    title: 'Discount',
    dataIndex: 'discount_value',
    key: 'discount_value',
    render: (item, record) => <span>{record.discount_value}</span>
}, {
    title: 'Tax',
    dataIndex: 'tax_value',
    key: 'tax_value',
    render: (item, record) => <span>{record.tax_value}</span>
}, {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
},];
