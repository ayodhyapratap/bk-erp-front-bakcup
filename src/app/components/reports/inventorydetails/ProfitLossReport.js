import React from "react";
import {Table,Divider,Statistic} from "antd";
import {INVENTORY_RETAILS_REPORT} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart} from 'recharts';

export default class ProfitLossReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryReports:[],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadInventoryRetails = this.loadInventoryRetails.bind(this);
    }
    componentDidMount() {
        this.loadInventoryRetails();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.products!=newProps.products
            ||this.props.doctors!=newProps.doctors ||this.props.manufacturers!=newProps.manufacturers ||this.props.suppliers!=newProps.suppliers ||this.props.patient_groups!=newProps.patient_groups)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadInventoryRetails();
            })

    }

    loadInventoryRetails= () => {
        let that = this;

        let successFn = function (data) {
            that.setState({
                inventoryReports:data,
                loading: false
            });

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
        if(this.props.manufacturers){
            apiParams.manufacturers=this.props.manufacturers.toString();
        }
        if(this.props.suppliers){
            apiParams.suppliers=this.props.suppliers.toString();
        }

        getAPI(INVENTORY_RETAILS_REPORT,  successFn, errorFn, apiParams);
    };

    render() {
        let that=this;
        let inventoryData=that.state.inventoryReports;
        let inventorySummary=[];
            let total_sale=0;
            let total_cost=0;
            let total_tax=0;
            let profit_before_tax=0;
            let profit_after_tax=0;
            for (let indx=0;indx<inventoryData.length;indx++){
                total_cost +=inventoryData[indx].cost;
                total_tax += inventoryData[indx].tax;
                total_sale +=inventoryData[indx].total;
                profit_before_tax +=inventoryData[indx].total - inventoryData[indx].cost;
                profit_after_tax +=inventoryData[indx].total - inventoryData[indx].cost -inventoryData[indx].tax ;
            }
        inventorySummary.push({sale_amount:total_sale,tax_amount:total_tax,cost_amount:total_cost ,profit_before_tax:profit_before_tax ,profit_after_tax:profit_after_tax});

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
                {moment(record.date).format('YYYY-MM-DD')}
                  </span>
            ),
        },{
            title:'Sales (INR)',
            key:'sale_amount',
            dataIndex:'total',
            render:(value,record)=>(<span>{record.total.toFixed(2)}</span>)
        },{
            title:'Cost',
            key:'cost',
            dataIndex:'cost',
            render:(value,record)=>(<span>{record.cost.toFixed(2)}</span>)
        },{
            title:'Profit before Tax(INR)',
            key:'tax_with_out',
            render:(text ,record)=>(
                <span>{(record.total - record.cost).toFixed(2)}</span>
            )
        },{
            title:'Tax(INR)',
            key:'tax',
            dataIndex:'tax',
            render:(value,record)=>(<span>{record.tax.toFixed(2)}</span>)
        },{
            title:'Profit after Tax(INR)',
            key:'tax_with',
            render:(text ,record)=>(
                <span>{(record.total - record.cost -record.tax).toFixed(2)}</span>
            )
        }];

        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value.toFixed(2)}</text>;
        };
        return <div>
            {/*<h2>Monthly Appointment Count*/}
            {/*    /!*<Button.Group style={{float: 'right'}}>*!/*/}
            {/*    /!*<Button><Icon type="mail"/> Mail</Button>*!/*/}
            {/*    /!*<Button><Icon type="printer"/> Print</Button>*!/*/}
            {/*    /!*</Button.Group>*!/*/}
            {/*</h2>*/}

            <ComposedChart width={1000} height={400} data={this.state.inventoryReports}
                           margin={{top: 20, right: 20, bottom: 20, left: 20}}>

                <XAxis dataKey="date" tickFormatter={(value) => {
                    return moment(value).format('DD MMM')
                }}
                       label= {{value:"Data Range", offset:0, margin:{top:10}, position:"insideBottom"}} />
                {/*</XAxis>*/}

                <YAxis label={{ value: 'Sales Profit', angle: -90, position: 'insideLeft' }} />
                <YAxis />
                <Tooltip />
                {/*<Legend />*/}
                <Bar dataKey='tax' barSize={35} fill='#0059b3' stroke="#0059b3" label={renderCustomBarLabel}/>
            </ComposedChart>

            <Table loading={this.state.loading} columns={SummaryColumns} pagination={false} dataSource={inventorySummary}/>

            <Table loading={this.state.loading} columns={DetailColumns} pagination={false} dataSource={this.state.inventoryReports}/>

        </div>
    }
}
