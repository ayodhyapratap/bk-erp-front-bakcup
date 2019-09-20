import React from "react";
import {Empty, Spin} from "antd"
import {INVENTORY_REPORT_API,} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import {LineChart, Line, XAxis, YAxis,Bar, CartesianGrid, Tooltip, Label, Legend, ComposedChart} from 'recharts';
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";

export default class TopInventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportItem_wise: [],
            reportTotal:[],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadDailyInventory = this.loadDailyInventory.bind(this);
    }
    componentDidMount() {
        this.loadDailyInventory();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.product_item!=newProps.product_item ||this.props.consume!=newProps.consume)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadDailyInventory();
            })
    }

    loadDailyInventory() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report:data,
                reportItem_wise: data.item_wise,
                reportTotal:data.total,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            type:that.props.type,
        };
        if(this.props.consume){
            apiParams.consume=this.props.consume.toString();
        }
        if(this.props.product_item){
            apiParams.product=this.props.product_item;
        }
        getAPI(INVENTORY_REPORT_API , successFn, errorFn, apiParams);
    }
    render() {
        let that=this;

        let dailyInvetory=[];
        that.state.reportTotal.forEach(function(itemName){
            that.state.reportItem_wise.map(function(item){
                if(itemName.inventory_item__name == item.inventory_item__name){
                    if(item.type_of_consumption =='SALES' ||item.type_of_consumption =='DAMAGED'){
                        dailyInvetory.push({item:item.inventory_item__name ,type:{
                                sales:item.consume
                            }})
                    }
                    if(item.type_of_consumption =='DAMAGED'){
                        dailyInvetory.push({item:item.inventory_item__name ,type:{
                                damaged:item.consume
                            }})
                    }
                }
            })
        });
        console.log("customizexd",dailyInvetory);


        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'abcd',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
            title: 'Month',
            key: 'date',
            dataIndex:'date',
            render:((item, record) => <span>{moment(record.date).format('MMM YYYY')}</span>),
            export:(item,record)=>(moment(record.date).format('MM YYYY')),
        },{
            title:'Item Name',
            key:'inventory_item__name',
            dataIndex:'inventory_item__name',
        },{
            title:'Type Of Consumption',
            key:'type_of_consumption',
            dataIndex:'type_of_consumption',
        },{
            title:'consume',
            key:'consume',
            dataIndex:'consume',
        }];
        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
        };
        return <div>
            <h2>Top Inventory</h2>
            <Spin size="large" spinning={this.state.loading}>
                {this.state.reportTotal.length>0?
                    <ComposedChart width={1000} height={400} data={this.state.reportTotal}
                                   margin={{top: 20, right: 20, bottom: 20, left: 20}}>


                        <XAxis dataKey="inventory_item__name" />
                        <YAxis label={{ value: 'Top Quantity Consumed', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        {/*<Legend />*/}
                        <Bar dataKey='consume' barSize={35} fill='#0059b3' stroke="#0059b3" label={renderCustomBarLabel}/>
                    </ComposedChart>
                :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
            </Spin>

            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.reportItem_wise}/>
        </div>
    }
}
