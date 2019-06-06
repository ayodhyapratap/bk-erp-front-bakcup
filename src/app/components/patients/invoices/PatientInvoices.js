import React from "react";
import {Button, Card, Divider, Icon, Table, Tag, Row, Col, Statistic, Alert, Menu, Dropdown, Modal, Spin} from "antd";
import {getAPI, interpolate, postAPI} from "../../../utils/common";
import {DRUG_CATALOG, INVOICES_API, PRESCRIPTIONS_API, PROCEDURE_CATEGORY, TAXES} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import AddInvoice from "./AddInvoice";
import AddInvoicedynamic from "./AddInvoicedynamic";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {Link} from "react-router-dom";

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
        this.loadDrugCatalog();
        this.loadProcedureCategory()
        this.loadTaxes();

    }

    loadInvoices(page = 1) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setState({
                invoices: data.results,
                loading: false,
                loadMoreInvoice: data.next
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
            console.log("get table");
            that.setState({
                taxes_list: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(TAXES, [this.props.active_practiceId]), successFn, errorFn);

    }

    editInvoiceData(record) {
        this.setState({
            editInvoice: record,
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/billing/invoices/edit")

    }

    deleteInvoice(record) {
        let that = this;
        confirm({
            title: 'Are you sure to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {"id": record.id, is_active: false};
                let successFn = function (data) {
                    that.loadInvoices();
                }
                let errorFn = function () {
                }
                postAPI(interpolate(INVOICES_API, [that.props.match.params.id]), reqData, successFn, errorFn);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
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
        console.log(taxesdata)

        const columns = [{
            title: 'Treatment & Products',
            dataIndex: 'drug',
            key: 'drug',
            render: (text, record) => (
                <span> <b>{record.inventory ? record.inventory_item_data.name : null}{record.procedure ? record.procedure_data.name : null}</b>
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

        if (this.props.match.params.id) {
            return <div>
                <Switch>
                    <Route exact path='/patient/:id/billing/invoices/add'
                           render={(route) => <AddInvoicedynamic {...this.state} {...this.props} {...route}
                                                                 loadData={this.loadInvoices}/>}/>
                    <Route exact path='/patient/:id/billing/invoices/edit'
                           render={(route) => <AddInvoice {...this.state} {...route}/>}/>
                    <Route>
                        <div>
                            <Alert banner showIcon type={"info"}
                                   message={"The invoices shown are only for the current selected practice!"}/>
                            <Card
                                bodyStyle={{padding: 0}}
                                style={{marginBottom: '20px'}}
                                title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Invoice" : "Invoice"}
                                extra={<Button.Group>
                                    <Link to={"/patient/" + this.props.match.params.id + "/billing/invoices/add"}>
                                        <Button type={"primary"}>
                                            <Icon type="plus"/>Add
                                        </Button>
                                    </Link>
                                </Button.Group>}>
                            </Card>
                            {this.state.invoices.map(invoice => <div style={{marginBottom: '20px'}}>
                                <Card>
                                    <h4>{invoice.date ? moment(invoice.date).format('ll') : null}
                                        <Dropdown.Button
                                            size={"small"}
                                            style={{float: 'right'}}
                                            overlay={<Menu>
                                                <Menu.Item key="1" onClick={() => that.editPrescriptionData(invoice)}>
                                                    <Link
                                                        to={"/patient/" + this.props.match.params.id + "/billing/payments/add"}>
                                                        <Icon type="money"/>
                                                        Pay
                                                    </Link>
                                                </Menu.Item>
                                                <Menu.Divider/>
                                                <Menu.Item key="2"
                                                           disabled={(invoice.practice != this.props.active_practiceId)}>
                                                    <Icon type="edit"/>
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item key="3" onClick={() => that.deleteInvoice(invoice)}
                                                           disabled={(invoice.practice != this.props.active_practiceId)}>
                                                    <Icon type="delete"/>
                                                    Delete
                                                </Menu.Item>
                                                <Menu.Divider/>
                                                <Menu.Item key="4">
                                                    <Icon type="clock-circle"/>
                                                    Patient Timeline
                                                </Menu.Item>
                                            </Menu>}>
                                            <Icon type="printer"/>
                                        </Dropdown.Button>
                                    </h4>
                                    <Row gutter={8}>
                                        <Col xs={24} sm={24} md={6} lg={4} xl={4} xxl={4}>
                                            {invoice.is_cancelled ?
                                                <Alert message="Cancelled" type="error" showIcon/> : null}
                                            <Divider>INV{invoice.id}</Divider>
                                            <Statistic title="Paid / Total " value={invoice.payments_data}
                                                       suffix={"/ " + invoice.total}/>
                                        </Col>
                                        <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>
                                            <Table
                                                bordered={true}
                                                pagination={false} loading={this.state.loading}
                                                columns={columns}
                                                dataSource={[...invoice.inventory, ...invoice.procedure]}/>
                                        </Col>
                                    </Row>

                                </Card>
                            </div>)}
                            <Spin spinning={this.state.loading}>
                                <Row>
                                </Row>
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
                <Alert banner showIcon type={"info"}
                       message={"The invoices shown are only for the current selected practice!"}/>
                {this.state.invoices.map(invoice => <div style={{marginBottom: '20px'}}>
                    <Card>
                        <h4>{invoice.date ? moment(invoice.date).format('ll') : null}
                            <Dropdown.Button
                                size={"small"}
                                style={{float: 'right'}}
                                overlay={<Menu>
                                    <Menu.Item key="1" onClick={() => that.editPrescriptionData(invoice)}>
                                        <Link
                                            to={"/patient/" + this.props.match.params.id + "/billing/payments/add"}>
                                            <Icon type="money"/>
                                            Pay
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2" disabled={(invoice.practice != this.props.active_practiceId)}>
                                        <Icon type="edit"/>
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={() => that.deleteInvoice(invoice)}
                                               disabled={(invoice.practice != this.props.active_practiceId)}>
                                        <Icon type="delete"/>
                                        Delete
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="4">
                                        <Icon type="clock-circle"/>
                                        Patient Timeline
                                    </Menu.Item>
                                </Menu>}>
                                <Icon type="printer"/>
                            </Dropdown.Button>
                        </h4>
                        <Row gutter={8}>
                            <Col xs={24} sm={24} md={6} lg={4} xl={4} xxl={4}>
                                {invoice.is_cancelled ?
                                    <Alert message="Cancelled" type="error" showIcon/> : null}
                                <Divider>INV{invoice.id}</Divider>
                                <Statistic title="Paid / Total " value={invoice.payments_data}
                                           suffix={"/ " + invoice.total}/>
                            </Col>
                            <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>
                                <Table
                                    bordered={true}
                                    pagination={false} loading={this.state.loading}
                                    columns={columns}
                                    dataSource={[...invoice.inventory, ...invoice.procedure]}/>
                            </Col>
                        </Row>

                    </Card>
                </div>)}
                <Spin spinning={this.state.loading}>
                    <Row>
                    </Row>
                </Spin>
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadInvoices(this.state.loadMoreInvoice)}
                                          loading={this.state.loading}
                                          hidden={!this.state.loadMoreInvoice}/>

            </div>
        }

    }
}

export default PatientInvoices;
