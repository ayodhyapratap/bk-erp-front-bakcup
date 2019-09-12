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
    Table, Tag
} from "antd";
import {getAPI} from "../../../utils/common";
import {INVOICES_API} from "../../../constants/api";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

export default class DailySummaryReport extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            dailySummary:[],

        }
        this.loadDailySummary = this.loadDailySummary.bind(this);
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

    loadDailySummary(page=1) {
        let that = this;
        that.setState({
            loading:true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current==1) {
                    return {
                        loading:false,
                        dailySummary: data.results,
                        nextItemPage: data.next
                    }
                }else{
                    return {
                        loading:false,
                        dailySummary: [...prevState.dailySummary,...data.results],
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
            page:page,
            start:'2012-09-02',
            // start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        };
        getAPI(INVOICES_API, successFn, errorFn,apiParams);
    }



    render() {
        let that=this;

        return <div><h2>Daily Summary Report
        </h2>
            <Card>
                {this.state.dailySummary.map(invoice => InvoiceCard(invoice, that))}
                <Spin spinning={this.state.loading}>
                    <Row/>
                </Spin>
                <InfiniteFeedLoaderButton
                    loaderFunction={() => this.loadDailySummary(this.state.nextItemPage)}
                    loading={this.state.loading}
                    hidden={!this.state.nextItemPage}/>
            </Card>
        </div>
    }
}

function InvoiceCard(invoice, that) {
    let tableObjects = [];
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
    // var invoiceIncome = invoice.reduce(function(prev, cur) {
    //     return prev + cur.count;
    // }, 0);
    // var amountDue = invoice.reduce(function(prev, cur) {
    //     return prev + cur.count;
    // }, 0);
    return <Card>
        <Row gutter={8}>
            <Col xs={24} sm={24} md={6} lg={4} xl={4} xxl={4} style={{padding: 10}}>
                <Statistic title="Patient Name" value={invoice.patient_data.user.first_name}/>
                <p>Invoice Income : <span></span></p>
                <p>Total Payment : <span>{invoice.total.toFixed(2)}</span></p>
                <p>Amount Due : <span></span></p>

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
                        }]}/> :
                    <Table
                        bordered={true}
                        pagination={false}
                        columns={columns}
                        dataSource={[...tableObjects,...invoice.inventory, ...invoice.procedure]}
                    />}
            </Col>
        </Row>


    </Card>
}

let i=1;
const columns = [{
    title: 'S. No',
    key: 'sno',
    dataIndex:'abcd',
    render: (item, record ,index) => <span> {index+1}</span>,
    export:(item,record,index)=>index+1,
    width: 50
}
,{
    title:'Patient Name',
    key:'patient_name',
    dataIndex:'patient_data.user.first_name',
    export:(item,record)=>(record.patient_data.user.first_name),
}
,{
     title: 'Treatment & Products',
     dataIndex: 'treatment',
     key: 'treatment',
     render: (text, record) => (
         <span> <b>{record.name ? record.name : null}</b></span>)
 },{
    title:'Cost (INR)',
    key:'unit_cost',
    dataIndex:'unit_cost',
    render: (item, record) => <span>{record.unit_cost ? record.unit_cost.toFixed(2) : '0.00'}</span>,
    export:(item,record)=>(record.unit_cost ? record.unit_cost.toFixed(2) : '0.00'),
},{
    title:'Discount (INR)',
    key:'discount_value',
    dataIndex:'discount_value',
    render: (item, record) => <span>{record.discount_value ? record.discount_value.toFixed(2) : '0.00'}</span>,
    export:(item,record)=>(record.discount_value ? record.discount_value.toFixed(2) : '0.00'),
}, {
    title: 'Tax',
    dataIndex: 'tax_value',
    key: 'tax_value',
    render: (item, record) => <span>{record.tax_value ? record.tax_value.toFixed(2) : '0.00'}</span>,
    export:(item,record)=>(record.tax_value ? record.tax_value.toFixed(2) : '0.00'),
},{
    title:'Invoice No.',
    key:'invoice_id',
    dataIndex:'invoiceId',
},{
    title: 'Invoice Cost (INR)',
    key: 'invoice_cost',
    dataIndex: ''
},{
    title:'Receipt No',
    key:'receipt_no',
    dataIndex:'',
}, {
    title:'Mode Of Payment',
    key:'mode_of_payments',
    dataIndex:'payment_mode',
},{
    title:'Amount Paid (INR)',
    key:'amount_paid',
    dataIndex:'pay_amount',
},{
    title:'Total Amount Paid',
    key:'total_amount_paid',
    dataIndex:'total',
    render: (text, record) => <span>{record.total ? record.total.toFixed(2) : '0.00'}</span>,
    export:(item,record)=>(record.total ? record.total.toFixed(2) : '0.00'),
}];
