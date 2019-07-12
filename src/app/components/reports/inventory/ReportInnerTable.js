import React from "react";
import {Table} from "antd";
import {STOCK_ENTRY} from "../../../constants/api";
import {getAPI} from "../../../utils/common";


export default class ReportInnerTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryList: [],
            loading:true,
        }
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }
    
    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                inventoryList:data.results,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })
        }
        let params={
            bill_number:this.props.bill_number,
            supplier:this.props.supplier,
            date:this.props.date
        }
        if(this.props.bill_number || this.props.supplier){
            getAPI(STOCK_ENTRY,successFn,errorFn,params)
        }
        
        // getAPI(STOCK_ENTRY, successFn, errorFn);
    }

    render() {
        let that =this;
        const columns = [{
            title: 'Item Type',
            key: 'item_type',
            dataIndex: 'inventory_item_data.item_type'
        }, {
            title: 'Batch',
            key: 'batch_number',
            dataIndex: 'batch_number'
        }, {
            title:'name',
            key:'name',
            dataIndex:'inventory_item_data.name'
        },{
            title: 'ADD/CONSUME',
            key: 'item_add_type',
            dataIndex: 'item_add_type'
        }, {
            title:'Type of Consumption',
            key:'type_of_consumption',
            dataIndex:'type_of_consumption'
        },{
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity'
        },{
            title:'Expiry Date',
            key:'expiry_date',
            dataIndex:'expiry_date'
        }];
        
        return <div>
                <Table loading={this.state.loading} bordered={true} rowKey={(record) => record.id} 
                 columns={columns} dataSource={this.state.inventoryList}/>
        </div>
    }
}
