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
    constructor(props){
        super(props)
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            dailySummary:[],
            practiceDoctors:[],

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
        if (this.state.doctors) {
            apiParams.staff = this.state.doctors.toString();
        }

        getAPI(INVOICES_API, successFn, errorFn,apiParams);
    }

    filterReport(type, value) {
        this.setState(function (prevState) {
            return {[type]: value}
        }, function () {
            this.loadDailySummary();
        });
    }


    render() {
        let that=this;
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
            dataIndex:'discount',
            render: (item, record) => <span>{record.discount ? record.discount.toFixed(2) : '0.00'}</span>,
            export:(item,record)=>(record.discount ? record.discount.toFixed(2) : '0.00'),
        }, {
            title: 'Tax',
            dataIndex: 'tax_value',
            key: 'taxes',
            render: (item, record) => <span>{record.taxes ? record.taxes.toFixed(2) : '0.00'}</span>,
            export:(item,record)=>(record.taxes ? record.taxes.toFixed(2) : '0.00'),
        },{
            title:'Invoice No.',
            key:'invoice_id',
            dataIndex:'invoice_id',
        },{
            title: 'Invoice Cost (INR)',
            key: 'invoice_cost',
            dataIndex: 'cost',
            render:(item,record)=><span>{record.cost?record.cost.toFixed(2):'0.00'}</span>,
            export:(item,record)=>(record.cost ? record.cost.toFixed(2) : '0.00'),
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

        return <div><h2>Daily Summary Report
        </h2>
            <Card  extra={<>
                <spa>Doctors : </spa>
                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Doctors"
                        onChange={(value)=>this.filterReport('doctors',value)}>
                    {this.state.practiceDoctors.map((item) => <Select.Option value={item.id}>
                        {item.user.first_name}</Select.Option>)}
                </Select></>
            }>

                <Table
                    rowKey={(record, index) => {return index}}
                    columns={columns}
                    dataSource={this.state.dailySummary}
                />


                <InfiniteFeedLoaderButton
                    loaderFunction={() => this.loadDailySummary(this.state.nextItemPage)}
                    loading={this.state.loading}
                    hidden={!this.state.nextItemPage}/>
            </Card>
        </div>
    }
}
