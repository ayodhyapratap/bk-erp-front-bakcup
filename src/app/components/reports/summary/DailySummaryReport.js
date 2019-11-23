import React from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Descriptions,
    Row,
    Spin,
    Statistic,
    Table, Tag, Select
} from "antd";
import {getAPI} from "../../../utils/common";
import {INVOICES_API} from "../../../constants/api";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {loadDoctors} from "../../../utils/clinicUtils";

export default class DailySummaryReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            dailySummary: [],
            practiceDoctors: [],

        }
        this.loadDailySummary = this.loadDailySummary.bind(this);
        loadDoctors(this);
    }

    componentDidMount() {
        this.loadDailySummary();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadDailySummary();
            })
    }

    loadDailySummary(page = 1) {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                let rows = [];
                data.results.forEach(function (resultRow) {
                    resultRow.inventory.forEach(function (inventory) {
                        rows.push({
                            ...inventory,
                            invoice: resultRow,
                        });
                    });
                    resultRow.prescription.forEach(function (prescription) {
                        rows.push({
                            ...prescription,
                            invoice: resultRow,
                        });
                    });
                    resultRow.procedure.forEach(function (procedure) {
                        rows.push({
                            ...procedure,
                            invoice: resultRow,
                        });
                    });
                });
                if (data.current == 1) {
                    return {
                        loading: false,
                        dailySummary: rows,
                        nextItemPage: data.next
                    }
                } else {
                    return {
                        loading: false,
                        dailySummary: [...prevState.dailySummary, ...rows],
                        nextItemPage: data.next
                    }
                }
            })

        }

        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams = {
            page: page,
            start: '2012-09-02',
            // start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        };
        if (this.state.doctors) {
            apiParams.staff = this.state.doctors.toString();
        }

        getAPI(INVOICES_API, successFn, errorFn, apiParams);
    }

    filterReport(type, value) {
        this.setState(function (prevState) {
            return {[type]: value}
        }, function () {
            this.loadDailySummary();
        });
    }


    render() {
        let that = this;
        let i = 1;
        let lastInvoiceForSerialNo = null;
        let lastInvoiceForPatientName = null;
        let lastInvoiceForReceipt = null;
        let lastInvoiceForPaymentMode = null;
        let lastInvoiceForAmountPaid = null;
        let lastInvoiceForTotalAmountPaid = null;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex: 'abcd',
            render: (item, record, index) => {
                let obj = {props: {}};
                if (record.invoice.invoice_id == lastInvoiceForSerialNo) {
                    obj.props.rowSpan = 0
                } else {
                    lastInvoiceForSerialNo = record.invoice.invoice_id;
                    obj.children = <span> {i++}</span>;
                    obj.props.rowSpan = record.invoice.inventory.length + record.invoice.prescription.length + record.invoice.procedure.length;
                }
                return obj;
            },
            export: (item, record, index) => index + 1,
            width: 50
        }, {
            title: 'Patient Name',
            key: 'patient_name',
            dataIndex: 'invoice.patient_data.user.first_name',
            render: (item, record, index) => {
                let obj = {props: {}};
                if (record.invoice.invoice_id == lastInvoiceForPatientName) {
                    obj.props.rowSpan = 0
                } else {
                    lastInvoiceForPatientName = record.invoice.invoice_id;
                    obj.children = <span><b>{item} ({record.invoice.patient_data.custom_id})</b></span>;
                    obj.props.rowSpan = record.invoice.inventory.length + record.invoice.prescription.length + record.invoice.procedure.length;
                }
                return obj;
            },
            export: (item, record) => (record.patient_data.user.first_name),
        }, {
            title: 'Treatment & Products',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: 'Cost (INR)',
            key: 'unit_cost',
            dataIndex: 'unit_cost',
            align: 'right',
            render: (item, record) => record.unit_cost ?
                <span>{(record.unit_cost.toFixed(2) * record.unit).toFixed(2)}<br/><small>{record.unit_cost.toFixed(2)}x{record.unit}</small></span> : '--',
            // export: (item, record) => (record.unit_cost ? record.unit_cost.toFixed(2) : '0.00'),
        }, {
            title: 'Discount (INR)',
            key: 'discount_value',
            dataIndex: 'discount_value',
            align: 'right',
            render: (item, record) => <span>{item.toFixed(2)}</span>,
            // export: (item, record) => (record.discount ? record.discount.toFixed(2) : '0.00'),
        }, {
            title: 'Tax',
            dataIndex: 'tax_value',
            key: 'taxes',
            align: 'right',
            render: (item, record) => <span>{item.toFixed(2)}</span>,
            // export: (item, record) => (record.taxes ? record.taxes.toFixed(2) : '0.00'),
        }, {
            title: 'Invoice No.',
            key: 'invoice_id',
            dataIndex: 'invoice.invoice_id',
        }, {
            title: 'Invoice Cost (INR)',
            key: 'invoice_cost',
            dataIndex: 'total',
            align: 'right',
            render: (item, record) => <span>{item.toFixed(2)}</span>,
            // export: (item, record) => (record.cost ? record.cost.toFixed(2) : '0.00'),
        }, {
            title: 'Receipt No',
            key: 'payment_data.payment_id',
            dataIndex: '',
            render: (item, record, index) => {
                let obj = {props: {}};
                if (record.invoice.invoice_id == lastInvoiceForReceipt) {
                    obj.props.rowSpan = 0
                } else {
                    lastInvoiceForReceipt = record.invoice.invoice_id;
                    obj.children =
                        <span>{record.invoice.payments.map(payment => <span>{payment.payment_id}<br/></span>)}</span>;
                    obj.props.rowSpan = record.invoice.inventory.length + record.invoice.prescription.length + record.invoice.procedure.length;
                }
                return obj;
            },
        }, {
            title: 'Mode Of Payment',
            key: 'mode_of_payments',
            dataIndex: 'payment_mode',
            render: (item, record, index) => {
                let obj = {props: {}};
                if (record.invoice.invoice_id == lastInvoiceForPaymentMode) {
                    obj.props.rowSpan = 0
                } else {
                    lastInvoiceForPaymentMode = record.invoice.invoice_id;
                    obj.children =
                        <span>{record.invoice.payments.map(payment => <span>{payment.payment_mode}<br/></span>)}</span>;
                    obj.props.rowSpan = record.invoice.inventory.length + record.invoice.prescription.length + record.invoice.procedure.length;
                }
                return obj;
            },
        }, {
            title: 'Amount Paid (INR)',
            key: 'amount_paid',
            dataIndex: 'pay_amount',
            align: 'right',
        }, {
            title: 'Total Amount Paid',
            key: 'total_amount_paid',
            dataIndex: 'total',
            align: 'right',
            render: (text, record) => <span>{record.total ? record.total.toFixed(2) : '0.00'}</span>,
            export: (item, record) => (record.total ? record.total.toFixed(2) : '0.00'),
        }];

        return <div><h2>Daily Summary Report
        </h2>
            <Card
                bodyStyle={{padding:0}}
                extra={<>
                <span>Doctors :</span>
                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Doctors"
                        onChange={(value) => this.filterReport('doctors', value)}>
                    {this.state.practiceDoctors.map((item) => <Select.Option key={item.id} value={item.id}>
                        {item.user.first_name}</Select.Option>)}
                </Select></>
            }>

                <Table
                    bordered={true}
                    rowKey={(record, index) => {
                        return index
                    }}
                    columns={columns}
                    dataSource={this.state.dailySummary}
                    pagination={false}
                />


                <InfiniteFeedLoaderButton
                    loaderFunction={() => this.loadDailySummary(this.state.nextItemPage)}
                    loading={this.state.loading}
                    hidden={!this.state.nextItemPage}/>
            </Card>
        </div>
    }
}
