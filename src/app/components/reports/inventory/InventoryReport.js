import React from "react";
import {Button, Card, Row, Table, Tag,Form, Input,Select ,Checkbox,Col} from "antd";
import {BILL_SUPPLIER,SUPPLIER_API} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import CustomizedTable from "../../common/CustomizedTable";
import ReportInnerTable from "../../reports/inventory/ReportInnerTable"
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

class InventoryReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            billSuplier: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            nextItemPage:null,
            supplierList: []
        }
        this.loadBillSupplier = this.loadBillSupplier.bind(this);
        this.loadSupplierList = this.loadSupplierList.bind(this);
    }

    componentDidMount() {
        this.loadBillSupplier();
        this.loadSupplierList();
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
        let apiParams = {
            page:page,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        }
        if(that.state.bill_number)
        apiParams.bill_number = that.state.bill_number
        if(that.state.supplier)
        apiParams.supplier = that.state.supplier
        if(that.state.invoice)
        apiParams.invoice = 1
        if(that.state.inventory)
        apiParams.inventory = 1
        getAPI(BILL_SUPPLIER, successFn, errorFn,apiParams);
    }
   
    expandIcon(props) {
        return <Button onClick={e => props.onExpand(props.record, e)}>
            view detail
        </Button>
    }
    loadSupplierList() {
        let that = this;
        let params = {practice: this.props.active_practiceId}
        let successFn = function (data) {
            that.setState({
                supplierList: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SUPPLIER_API, [this.props.active_practiceId]), successFn, errorFn, params);
    }
    handleChange(key,value){
        this.props.form.setFieldsValue({
            [key]: value,
        });
    }
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                that.setState({
                    bill_number:values.bill_number,
                    supplier:values.supplier.toString(),
                    inventory:values.inventory,
                    invoice:values.invoice
                },function(){
                    that.loadBillSupplier();
                })
            }
        })
    }
    render() {
        let that = this;
        const {getFieldDecorator} = this.props.form;
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
            <Card bodyStyle={{padding:0}} 
                extra={<div>
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item label="Invoice">
                        {getFieldDecorator('invoice', {initialValue:true
                        })(<Checkbox/>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="Inventory">
                        {getFieldDecorator('inventory', {
                        })(<Checkbox/>
                            )
                        }
                    </Form.Item>
                        <Form.Item label="Bill Number">
                            {getFieldDecorator('bill_number',{})
                            (<Input placeholder="Bill Numbers"/>)
                        }
                        </Form.Item>
                        <Form.Item key="supplier"  label="Supplier" >
                        {getFieldDecorator("supplier", {initialValue: this.state.supplierList?this.state.supplierList.name:null},
                            {rules: [{ required: true, message: 'This field required!' }], 
                            onChange:this.handleChange, }
                        )(
                           <Select placeholder="Supplier" style={{minWidth:150}} mode="multiple">
                                {this.state.supplierList.map(item => <Select.Option
                                    value={item.id}>
                                    {item.name}
                                </Select.Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{margin: 5}}>
                            Submit
                        </Button>
                    </Form.Item>
                    </Form>
                </div>}>
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
export default Form.create()(InventoryReport);