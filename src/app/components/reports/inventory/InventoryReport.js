import React from "react";
import {Card, Table} from "antd";
import {STOCK_ENTRY} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";

export default class InventoryReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryList: []
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
                inventoryList: data
            })
        }
        let errorFn = function () {
        }
        getAPI(STOCK_ENTRY, successFn, errorFn);
    }

    render() {
        const columns = [{
            title: 'Item Code',
            key: 'item_code',
            dataIndex: 'item_code'
        }, {
            title: 'Item Type',
            key: 'item_type',
            dataIndex: 'item_type'
        }, {
            title: 'Batch',
            key: 'batch_number',
            dataIndex: 'batch_number'
        }, {
            title: 'ADD/CONSUME',
            key: 'item_add_type',
            dataIndex: 'item_add_type'
        }, {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity'
        }, {
            title: 'Date',
            key: 'created_at',
            dataIndex: 'created_at',
            render:(value)=><span>{moment(value).format('DD-MM-YYYY')}</span>
        }];
        return <div>
            <h2>Inventory Report</h2>
            <Card>
                <Table bordered={true} pagination={false} columns={columns} dataSource={this.state.inventoryList}/>
            </Card>
        </div>
    }
}
