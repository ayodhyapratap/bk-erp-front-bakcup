import React from "react";
import {Button, Card, Icon, Table} from "antd";
import {getAPI} from "../../../utils/common";
import {INVOICES_API} from "../../../constants/api";
import ReportInnerTable from "../inventory/ReportInnerTable";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

export default class DailySummaryReport extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            report: [],
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
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        };
        getAPI(INVOICES_API, successFn, errorFn,apiParams);
    }



    render() {
        let that=this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'abcd',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
            title:'Patient Name',
            key:'patient_name',
            dataIndex:'patient_data.user.first_name',
            export:(item,record)=>(record.patient_data.user.first_name),
        },{
            title:'Treatments & Products',
            key:'treatments_products',
            dataIndex:'',

        },{
            title:'Cost (INR)',
            key:'cost',
            dataIndex:'cost',
            render: (text, record) => <span>{record.cost ? record.cost.toFixed(2) : null}</span>,
            export:(item,record)=>(record.cost ? record.cost.toFixed(2) : null),
        },{
            title:'Discount (INR)',
            key:'discount',
            dataIndex:'discount',
            render: (text, record) => <span>{record.discount ? record.discount.toFixed(2) : null}</span>,
            export:(item,record)=>(record.discount ? record.discount.toFixed(2) : null),
        },{
            title:'Tax (INR)',
            key:'tax',
            dataIndex:'taxes',
            render: (text, record) => <span>{record.taxes ? record.taxes.toFixed(2) : null}</span>,
            export:(item,record)=>(record.taxes ? record.taxes.toFixed(2) : null),
        },{
            title:'Invoice No.',
            key:'invoice_id',
            dataIndex:'invoice_id',
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
            dataIndex:'',
        },{
            title:'Amount Paid (INR)',
            key:'amount_paid',
            dataIndex:'',
        },{
            title:'Total Amount Paid',
            key:'total_amount_paid',
            dataIndex:'total',
            render: (text, record) => <span>{record.total ? record.total.toFixed(2) : null}</span>,
            export:(item,record)=>(record.total ? record.total.toFixed(2) : null),
        }];
        return <div><h2>Daily Summary Report
        </h2>
            <Card>
                <Table loading={this.state.loading} bordered={true} rowKey={(record) => record.id}
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
