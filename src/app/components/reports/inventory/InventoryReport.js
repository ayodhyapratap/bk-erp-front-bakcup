import React from "react";
import {Card,Tag} from "antd";
import {BILL_SUPPLIER} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";
import ReportInnerTable from "../../reports/inventory/ReportInnerTable"

export default class InventoryReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            billSuplier:null
        }
        this.loadBillSupplier =this.loadBillSupplier.bind(this);
    }

    componentDidMount() {
        this.loadBillSupplier();
    }
    loadBillSupplier(){
        let that = this;
        let successFn = function (data) {
            that.setState({
                billSuplier:data.results,
            })
            
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(BILL_SUPPLIER, successFn, errorFn);
    }
    render() {
        let that =this;
        const columns = [{
            title: 'Bill Number',
            key: 'bill_number',
            dataIndex: 'bill_number'
        }, {
            title: 'Supplier ',
            key: 'name',
            dataIndex: 'supplier_data.name'
        }, {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            render:(value)=><span>{value ? value:''}</span>
        }];

       const pagination={
            position: 'both',
            pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            size: "small",
            showTotal: function (total, range) {
                return <Tag>Showing <b>{range[0]}</b> to <b>{range[1]}</b> of <b>{total}</b> items</Tag>
            }
       }
        return <div>
            <h2>Inventory Report</h2>
            <Card>
                <CustomizedTable loading={this.state.loading} bordered={true} rowKey={(record) => record.id} 
                expandedRowRender={(record) =>  <ReportInnerTable {...record} {...that.props} />} columns={columns} 
                dataSource={this.state.billSuplier}
                pagination={pagination} />
            </Card>
        </div>
    }
}
