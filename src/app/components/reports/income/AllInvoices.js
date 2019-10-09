import React from "react";
import {Table, Divider, Statistic, Tag} from "antd";
import {INCOME_REPORTS, INVENTORY_RETAILS_REPORT, PATIENTS_LIST} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart} from 'recharts';

export default class AllInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryReports:[],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            invoiceReports:[],
        };
        this.loadInvoices = this.loadInvoices.bind(this);
        // this.loadPatientList = this.loadPatientList.bind(this);
    }
    componentDidMount() {
        this.loadInvoices();
        // this.loadPatientList();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.products!=newProps.products || this.props.income_type!=newProps.income_type
            ||this.props.is_cancelled!=newProps.is_cancelled ||this.props.discount!=newProps.discount
            ||this.props.doctors!=newProps.doctors ||this.props.taxes!=newProps.taxes ||this.props.suppliers!=newProps.suppliers ||this.props.patient_groups!=newProps.patient_groups)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadInvoices();
            })

    }

    loadInvoices= () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                invoiceReports:data,
                loading: false
            });
            // if (data.reservation){
            //     that.setState(function (prevData) {
            //         // console.log(data.)
            //     })
            // }

        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            practice:that.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            type:that.props.type,
            is_cancelled:this.props.is_cancelled ? true : false,
        };
        if (that.props.income_type){
            apiParams.income_type= that.props.income_type;
        }
        if(that.props.discount){
            apiParams.discount=that.props.discount;
        }
        if(this.props.patient_groups){
            apiParams.groups=this.props.patient_groups.toString();
        }
        if(this.props.products){
            apiParams.products=this.props.products.toString();
        }
        if(this.props.doctors){
            apiParams.doctors=this.props.doctors.toString();
        }
        if(this.props.taxes){
            apiParams.taxes=this.props.taxes.toString();
        }
        // if(this.props.suppliers){
        //     apiParams.suppliers=this.props.suppliers.toString();
        // }

        getAPI(INCOME_REPORTS,  successFn, errorFn, apiParams);
    };

    // loadPatientList(){
    //     let that=this;
    //     let successFn = function (data) {
    //         that.setState({
    //             patientList:data,
    //             loading: false
    //         });
    //
    //     };
    //     let errorFn = function () {
    //         that.setState({
    //             loading: false
    //         })
    //     };
    //     getAPI(PATIENTS_LIST,successFn,errorFn);
    // }

    render() {
        let that = this;
        let inventoryData=this.state.invoiceReports;
        let inventorySummary=[];
        let total_sale=0;
        let total_cost=0;
        let total_tax=0;
        let profit_before_tax=0;
        let profit_after_tax=0;
        for (let indx=0;indx<inventoryData.length;indx++){
            total_cost +=inventoryData[indx].cost;
            total_tax += inventoryData[indx].taxes;
            total_sale +=inventoryData[indx].total;
            profit_before_tax +=inventoryData[indx].total - inventoryData[indx].cost;
            profit_after_tax +=inventoryData[indx].total - inventoryData[indx].cost -inventoryData[indx].taxes ;
        }
        inventorySummary.push({sale_amount:total_sale,tax_amount:total_tax,cost_amount:total_cost ,profit_before_tax:profit_before_tax ,profit_after_tax:profit_after_tax});


        let tableObjects=[];
        let newData=[];
        inventoryData.map((invoice)=>{
            if (invoice.reservation){
                let medicinesPackages= invoice.reservation_data.medicines.map((item)=>({
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

            newData.push({...invoice,treatment:[...tableObjects,...invoice.procedure,...invoice.inventory]})
        });


        let i=1;
        const SummaryColumns = [{
            title:'Total Sales (INR)',
            key:'sale_amount',
            dataIndex:'sale_amount',
            render:(value,record)=>(<span>{record.sale_amount.toFixed(2)}</span>)
        },{
            title:'Total Cost (INR)',
            key:'cost_amount',
            dataIndex:'cost_amount',
            render:(value,record)=>(<span>{record.cost_amount.toFixed(2)}</span>)
        },{
            title:'Total Profit before Tax(INR)',
            key:'tax_with_out',
            dataIndex:'profit_before_tax',
            render:(value,record)=>(<span>{record.profit_before_tax.toFixed(2)}</span>)
        },{
            title:'Total Tax(INR)',
            key:'tax_amount',
            dataIndex:"tax_amount",
            render:(value ,record)=>(<span>{record.tax_amount.toFixed(2)}</span>)
        },{
            title:'Total Profit after Tax(INR)',
            key:'tax_with',
            dataIndex:"profit_after_tax",
            render:(value,record)=>(<span>{record.profit_after_tax.toFixed(2)}</span>)
        }];

        const DetailColumns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.created_at).format('ll')}
                  </span>
            ),
        },{
            title:'Invoice Number',
            key:'invoice_id',
            dataIndex:'invoice_id',
        },{
            title:'Patient',
            key:'patient',
            dataIndex:'patient',
            render:(value,record)=>(<span>{record.patint_data?record.patint_data.user.first_name:record.patient}</span>)
        },{
            title:'Treatments & Products',
            key:'treatments',
            render: (text, record) => <span>{record.treatment.map((item) =>
                <Tag>{item.name}</Tag>
            )}</span>
        }];


        return <div>
            <h2>All Invoices</h2>



            <Table loading={this.state.loading} columns={SummaryColumns} pagination={false} dataSource={inventorySummary}/>

            <Table loading={this.state.loading} columns={DetailColumns} pagination={false} dataSource={newData}/>

        </div>
    }
}
