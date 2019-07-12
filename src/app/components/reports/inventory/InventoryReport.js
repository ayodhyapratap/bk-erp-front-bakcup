import React from "react";
import {Button, Card, Row, Table, Tag} from "antd";
import {BILL_SUPPLIER} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import CustomizedTable from "../../common/CustomizedTable";
import ReportInnerTable from "../../reports/inventory/ReportInnerTable"
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

export default class InventoryReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            billSuplier: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            nextItemPage:null
        }
        this.loadBillSupplier = this.loadBillSupplier.bind(this);
    }

    componentDidMount() {
        this.loadBillSupplier();
    }
    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadBillSupplier();
            })

    }
    loadBillSupplier(page=1) {
        let that = this;
        that.setState({
            loading:true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current==1) {
                    return {
                        loading:false,
                        billSuplier: data.results,
                        nextItemPage: data.next
                    }
                }else{
                    return {
                        loading:false,
                        billSuplier: [...prevState.billSuplier,...data.results],
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
        getAPI(BILL_SUPPLIER, successFn, errorFn,{
            page:page,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        });
    }

    expandIcon(props) {
        return <Button onClick={e => props.onExpand(props.record, e)}>
            view detail
        </Button>
    }

    render() {
        let that = this;
        const columns = [{
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            render: (value) => <span>{value ? value : ''}</span>
        }, {
            title: 'Bill Number',
            key: 'bill_number',
            dataIndex: 'bill_number'
        }, {
            title: 'Supplier ',
            key: 'name',
            dataIndex: 'supplier_data.name'
        }];

        return <div>
            <h2>Inventory Report</h2>
            <Card bodyStyle={{padding:0}}>
                <Table loading={this.state.loading} bordered={true} rowKey={(record) => record.id}
                                 expandedRowRender={(record) => <ReportInnerTable {...record} {...that.props} />}
                                 columns={columns}
                                 dataSource={this.state.billSuplier}
                                 pagination={false}
                            />
                <InfiniteFeedLoaderButton
                    loaderFunction={() => this.loadBillSupplier(this.state.nextItemPage)}
                    loading={this.state.loading}
                    hidden={!this.state.nextItemPage}/>
            </Card>
        </div>
    }
}
