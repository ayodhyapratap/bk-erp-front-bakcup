import React from "react";
import {getAPI} from "../../../utils/common";
import {RETURN_INVOICE_REPORTS} from "../../../constants/api";
import {Table} from "antd";
import * as _ from 'lodash';

export default class AllReturnedInvoice extends React.Component{
    constructor(props){
        super(props);
        this.state={
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false
        }
        this.loadReturnInvoice = this.loadReturnInvoice.bind(this);
    }

    componentDidMount(){
         this.loadReturnInvoice();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate ||
            this.props.endDate != newProps.endDate ||
            this.props.patient_groups != newProps.patient_groups ||
            this.props.doctors != newProps.doctors ||
            this.props.income_type != newProps.income_type ||
            this.props.taxes != newProps.taxes ||
            this.props.discount != newProps.discount ||
            this.props.products != newProps.products ||
            this.props.treatments != newProps.treatments ||
            this.props.exclude_cancelled != newProps.exclude_cancelled

        )
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadReturnInvoice();
            })

    }

    startLoading = () =>{
      this.setState({
          loading:true
      })
    };

    stopLoading = () =>{
        this.setState({
            loading:false
        })
    };

    loadReturnInvoice (){
       let that = this;
       this.startLoading();
        let {startDate, endDate} = this.state;
        let {active_practiceId, type, exclude_cancelled, patient_groups, doctors, income_type, taxes, discount, products, treatments} = this.props;

        let apiParams = {
            practice:active_practiceId,
            type:type,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
            // start:"2019-01-01",
            is_cancelled: exclude_cancelled ? true : false,
        };

        if (patient_groups){
            apiParams.groups = patient_groups.toString()
        }

        if (doctors){
            apiParams.doctors = doctors.toString();
        }

        if (income_type) {
            apiParams.income_type = income_type;
        }

        if (treatments){
            apiParams.treatments = treatments.toString()
        }

        if (discount){
            apiParams.discount = discount
        }
        if (taxes){
            apiParams.taxes = taxes.toString()
        }

        if (products){
            apiParams.products = products.toString()
        }

        let successFn =function (data) {
            that.setState({
                report:data,
            })
            that.stopLoading();
        };
        let errorFn = function (data) {
            that.stopLoading();
        };

        getAPI(RETURN_INVOICE_REPORTS ,successFn, errorFn, apiParams)
    };

    render() {
        let {report, loading} = this.state;
        const reportData = [];
        for (let i = 1; i <= report.length; i++) {
            reportData.push({s_no: i,...report[i-1]});
        };

        const columns = [{
                title: 'S. No',
                key: 's_no',
                dataIndex:'s_no',
                render: (item, record) => <span> {record.s_no}</span>,
                width: 50
            },
            {
                title:'Date',
                key:'date',
                render:(item,record)=><span>{_.get(record,'date')}</span>
            },
            {
                title: "Patient Name",
                key: "patientName",
                render:(item,record) =><span>{_.get(record,'patient_data.user.first_name')}</span>
            },
            {
                title:'Patient Id',
                key:'patient_id',
                render:(item,record) =><span>{_.get(record,'patient_data.custom_id')}</span>

            },
            {
                title:'Return Id',
                key:'return_id',
                render:(item, record)=><span>{_.get(record,'return_id')}</span>
            },
            {
                title:'Return By',
                key:'returnBy',
                render:(item, record)=><span>{_.get(record,'staff_data.user.first_name')}</span>
            },
            {
                title:'Total Amount',
                key:'total',
                render:(item, record) =><span>{_.get(record,'total',0).toFixed(2)}</span>
            },
            {
                title:'Return Amount',
                key:'return_value',
                render:(item,record)=><span>{_.get(record,'return_value',0).toFixed(2)}</span>
            },
            {
                title:'Cash Return Amount',
                key:'cash_return',
                render:(item,record)=><span>{_.get(record,'cash_return',0).toFixed(2)}</span>

            }
        ];



        return (<div>
                <h2>All Returned Invoices</h2>

                <Table
                    loading={loading}
                    rowKey={(record)=>record.s_no}
                    pagination={false}
                    columns={columns}
                    expandedRowRender={(record) => <ReportInnerTable record={[...record.inventory, ...record.procedure]}/>}
                    dataSource={reportData}
                />
            </div>
        );
    }
}

function ReportInnerTable(item) {
    const columns = [
        {
            title:'Treatment & Products',
            key:'name',
            render:(item,record)=><span>{_.get(record,'name')}</span>
        },
        {
            title: 'Cost',
            key: 'cost',
            render:(item, record)=><span>{_.get(record,'unit_cost',0).toFixed(2)}</span>
        },
        {
            title:'Unit',
            key:'unit',
            render:(item,record)=><span>{_.get(record,'unit')}</span>
        },{
            title:'Discount',
            key:'discount',
            render:(item, record)=><span>{_.get(record,'discount_value',0).toFixed(2)}</span>
        },
        {
            title:'Tax',
            key:'tax',
            render:(item, record)=><span>{_.get(record,'tax_value',0).toFixed(2)}</span>
        },
        {
            title:'Total',
            key:'total',
            render:(item, record)=><span>{_.get(record,'total',0).toFixed(2)}</span>
        }
    ];
    return(
        <div>
            <Table  columns={columns} dataSource={_.get(item,'record')} pagination={false}/>
        </div>
    )
}

