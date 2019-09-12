import React from "react";
import {Table,Divider,Statistic} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
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
            ||this.props.doctors!=newProps.doctors ||this.props.manufacturers!=newProps.manufacturers ||this.props.suppliers!=newProps.suppliers )
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
                inventoryReports: data.data,
                total:data.total,
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
        };
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

        getAPI(PATIENT_APPOINTMENTS_REPORTS,  successFn, errorFn, apiParams);
    };

    render() {
        let i=1;

        const SummaryColumns = [{
            title:'Total Sales (INR)',
            key:'sale_amount',
            dataIndex:'sale_amount',
        },{
            title:'Total Cost (INR)',
            key:'sale_amount',
            dataIndex:'sale_amount',
        },{
            title:'Total Profit before Tax(INR)',
            key:'tax_with_out',
        },{
            title:'Total Tax(INR)',
            key:'tax_amount'
        },{
            title:'Total Profit after Tax(INR)',
            key:'tax_with',
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
                {moment(record.date).format('MMMM YYYY')}
                  </span>
            ),
        },{
            title:'Sales (INR)',
            key:'sale_amount',
            dataIndex:'sale_amount',
        },{
            title:'Cost',
            key:'cost',
            dataIndex:'cost',
        },{
            title:'Profit before Tax(INR)',
            key:'tax_with_out',
        },{
            title:'Tax(INR)',
            key:'tax_amount'
        },{
            title:'Profit after Tax(INR)',
            key:'tax_with',
        }];

        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
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
                <Bar dataKey='count' barSize={35} fill='#0059b3' stroke="#0059b3" label={renderCustomBarLabel}/>
            </ComposedChart>

            <Table loading={this.state.loading} columns={SummaryColumns} pagination={false} dataSource={this.state.inventoryReports}/>

            <Table loading={this.state.loading} columns={DetailColumns} pagination={false} dataSource={this.state.inventoryReports}/>

        </div>
    }
}
