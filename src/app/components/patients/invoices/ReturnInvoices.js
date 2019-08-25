import React from "react";
import {
    Affix,
    Alert,
    Card,
    Col,
    Divider,
    Modal,
    Row,
    Spin,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Form,
} from "antd";
import {displayMessage, getAPI, interpolate, putAPI, postAPI} from "../../../utils/common";
import {
    INVOICE_RETURN_API,
    DRUG_CATALOG,
    PROCEDURE_CATEGORY,
    TAXES,
} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {Link, Redirect} from "react-router-dom";
import {BACKEND_BASE_URL} from "../../../config/connect";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";

class ReturnInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            returnInvoices: [],
            drug_catalog: null,
            procedure_category: null,
            taxes_list: null,
            loading: true,
        }
        this.loadReturnInvoices = this.loadReturnInvoices.bind(this);
        this.loadDrugCatalog = this.loadDrugCatalog.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.loadTaxes = this.loadTaxes.bind(this);

    }

    componentDidMount() {
        this.loadReturnInvoices();
    }

    loadReturnInvoices(page = 1) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current == 1) {
                that.setState({
                    total: data.count,
                    returnInvoices: data.results,
                    loading: false,
                    loadMoreReturnInvoice: data.next
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        returnInvoices: [...prevState.invoices, ...data.results],
                        loading: false,
                        loadMoreReturnInvoice: data.next
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
        getAPI(INVOICE_RETURN_API, successFn, errorFn, apiParams);
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

   

    // loadPDF = (id) => {
    //     let that = this;
    //     let successFn = function (data) {
    //         if (data.report)
    //             window.open(BACKEND_BASE_URL + data.report);
    //     }
    //     let errorFn = function () {

    //     }
    //     getAPI(interpolate(INVOICE_PDF_API, [id]), successFn, errorFn);
    // }

    // deleteInvoice(patient, invoice) {
    //     let that = this;
    //     let reqData = {patient: patient, is_cancelled: true};
    //     let successFn = function (data) {
    //         displayMessage(SUCCESS_MSG_TYPE, "Invoice cancelled successfully")
    //         that.loadInvoices();
    //     }
    //     let errorFn = function () {
    //     }
    //     putAPI(interpolate(SINGLE_INVOICES_API, [invoice]), reqData, successFn, errorFn);
    // }

    render() {
        console.log("state",this.state);
        
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
                    <Route>
                        <div>
                            <Alert banner showIcon type={"info"}
                                   message={"The invoices return shown are only for the current selected practice!"}/>
                            <Affix offsetTop={0}>
                                <Card bodyStyle={{padding: 0}}
                                      style={{boxShadow: '0 5px 8px rgba(0, 0, 0, 0.09)'}}
                                      title={(this.state.currentPatient ? this.state.currentPatient.user.first_name + " Invoice Return" : "Invoices Return ") + (this.state.total ? `(Total:${this.state.total})` : '')}
                                    //   extra={<Button.Group>
                                    //       <Link to={"/patient/" + this.props.match.params.id + "/billing/invoices/add"}>
                                    //           <Button type={"primary"}>
                                    //               <Icon type="plus"/>Add
                                    //           </Button>
                                    //       </Link>
                                    //   </Button.Group>}>
                                    >
                                </Card>
                            </Affix>
                            {this.state.returnInvoices.map(invoice => InvoiceCard(invoice, that))}
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
                          title={(this.state.currentPatient ? this.state.currentPatient.user.first_name + " Invoice Return" : "Invoice Return ") + (this.state.total ? `(Total:${this.state.total})` : '')}
                        //   extra={<Button.Group>
                        //       <Button type={"primary"} onClick={() => this.props.togglePatientListModal(true)}>
                        //           <Icon type="plus"/>Add
                        //       </Button>
                        //   </Button.Group>}>
                        >
                    </Card>
                </Affix>
                {this.state.returnInvoices.map(invoice => InvoiceCard(invoice, that))}
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

export default Form.create()(ReturnInvoices);

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
            <Link to={"/patient/" + (invoice.patient_data ? invoice.patient_data.id : null) + "/billing/invoices/return"}>
                &nbsp;&nbsp; {invoice.patient_data ? invoice.patient_data.user.first_name : null} (ID: {invoice.patient_data ? invoice.patient_data.id : null})&nbsp;
            </Link>, {invoice.patient_data ? invoice.patient_data.gender : null}</span>}
        </small>}
       >
        <Row gutter={8}>
            <Col xs={24} sm={24} md={6} lg={4} xl={4} xxl={4} style={{padding: 10}}>
                {invoice.is_cancelled ?
                    <Alert message="Cancelled" type="error" showIcon/> : null}
                <Divider style={{marginBottom: 0}}>{invoice.return_id}</Divider>
                <Statistic title="Return"
                           value={(invoice.return_value.toFixed(2))}/>
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

       
    </Card>
}

const columns = [{
    title: 'Treatment & Products',
    dataIndex: 'drug',
    key: 'drug',
    render: (text, record) => (
        <span> <b>{record.name ? record.name : null}</b>
                    <br/> {record.staff_data ?
                <Tag color={record.staff_data ? record.staff_data.calendar_colour : null}>
                    <b>{"return by  " + record.staff_data.user.first_name} </b>
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
