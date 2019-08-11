import React from "react";
import {Button, Card, Col, Divider, Icon, Input, Modal, Popconfirm, Radio, Row, Spin, Table, Tag} from "antd";
import {getAPI, interpolate, putAPI ,startLoadingMessage,stopLoadingMessage} from "../../../utils/common";
import {INVENTORY_ITEM_API, SINGLE_INVENTORY_ITEM_API,INVENTORY_ITEM_EXPORT} from "../../../constants/api";
import {Link, Route, Switch} from "react-router-dom";
import AddorEditInventoryItem from "./AddorEditInventoryItem";
import AddOrConsumeStock from "./AddOrConsumeStock"
import {ADD_STOCK, CONSUME_STOCK, INVENTORY_ITEM_TYPE} from "../../../constants/hardData"
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import moment from "moment";
import PermissionDenied from "../../common/errors/PermissionDenied";
import {
    ERROR_MSG_TYPE,
    SUCCESS_MSG_TYPE,
} from "../../../constants/dataKeys";
import {BACKEND_BASE_URL} from "../../../config/connect";

export default class InventoryItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryItems: [], //All List
            inventoryItemList: [], // Filtered List
            // active_practiceId: this.props.active_practiceId,
            stockModalVisibility: false,
            itemTypeFilter: "ALL",
            itemStockFilter: "ALL",
            loading: true,
            nextItemPage: null
        }
        this.loadData = this.loadData.bind(this);
        this.showAddOrConsumeModal = this.showAddOrConsumeModal.bind(this);
        this.setActionType = this.setActionType.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.excelExport = this.excelExport.bind(this);
        this.pdfExport = this.pdfExport.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(page = 1) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (recData) {
            let data = recData.results;
            that.setState(function (prevState) {
                if (recData.current == 1) {
                    return {
                        inventoryItems: data,
                        loading: false,
                        nextItemPage: recData.next
                    }
                } else {
                    return {
                        inventoryItems: [...prevState.inventoryItems, ...data],
                        loading: false,
                        nextItemPage: recData.next
                    }
                }

            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let reqParams = {
            maintain_inventory: true,
            practice: this.props.active_practiceId,
            page:page
        };
        if (that.state.itemTypeFilter != 'ALL') {
            reqParams.item_type = that.state.itemTypeFilter
        }
        if (that.state.itemStockFilter != 'ALL') {
            reqParams.filter_type = that.state.itemStockFilter
        }
        if (that.state.filterItemName) {
            reqParams.item_name = that.state.filterItemName
        }
        if (that.state.filterItemCode) {
            reqParams.code = that.state.filterItemCode
        }
        getAPI(INVENTORY_ITEM_API, successFn, errorFn, reqParams);
    }

    deleteObject(value) {
        var that = this;
        let reqData = {
            is_active: false
        }
        let successFn = function (data) {
            that.loadData();
        };
        let errorFn = function () {
        };
        putAPI(interpolate(SINGLE_INVENTORY_ITEM_API, [value]), reqData, successFn, errorFn);

    }

    setActionType(type, item_Id) {
        this.setState({
            itemId: item_Id,
            actionType: type,
        })
        this.showAddOrConsumeModal(true);
    }

    showAddOrConsumeModal(type) {
        this.setState({
            stockModalVisibility: type,
        })
    }

    changeFilter = (e) => {
        let that = this;
        this.setState({
            [e.target.name]: e.target.value
        }, function () {
            that.loadData()
        })
    }
    changeInventoryFilters = (key, value) => {
        let that = this;
        that.setState(function (prevState) {
            return {
                [key]: value
            }
        })
    }

    excelExport() {
        let that = this;
        let msg = startLoadingMessage("Generating Report...");
        let successFn = function (data) {
            console.log("datattype",data)
            stopLoadingMessage(msg, SUCCESS_MSG_TYPE, "Report Generated Successfully!!");
            if (data.report_csv)
                window.open(BACKEND_BASE_URL + data.report_csv);
        }
        let errorFn = function () {
            stopLoadingMessage(msg, ERROR_MSG_TYPE, "Report Generation Failed!!");
        }
        let reqParams = {
            maintain_inventory: true,
            practice: this.props.active_practiceId,
        };
        if (that.state.itemTypeFilter != 'ALL') {
            reqParams.item_type = that.state.itemTypeFilter
        }
        if (that.state.itemStockFilter != 'ALL') {
            reqParams.filter_type = that.state.itemStockFilter
        }
        if (that.state.filterItemName) {
            reqParams.item_name = that.state.filterItemName
        }
        if (that.state.filterItemCode) {
            reqParams.code = that.state.filterItemCode
        }
        getAPI(INVENTORY_ITEM_EXPORT, successFn, errorFn, reqParams);
    }
    pdfExport() {
        let that = this;
        let msg = startLoadingMessage("Generating Report...");
        let successFn = function (data) {
            stopLoadingMessage(msg, SUCCESS_MSG_TYPE, "Report Generated Successfully!!");
            if (data.report_pdf)
                window.open(BACKEND_BASE_URL + data.report_pdf);
        }
        let errorFn = function () {
            stopLoadingMessage(msg, ERROR_MSG_TYPE, "Report Generation Failed!!");
        }
        let reqParams = {
            maintain_inventory: true,
            practice: this.props.active_practiceId,
        };
        if (that.state.itemTypeFilter != 'ALL') {
            reqParams.item_type = that.state.itemTypeFilter
        }
        if (that.state.itemStockFilter != 'ALL') {
            reqParams.filter_type = that.state.itemStockFilter
        }
        if (that.state.filterItemName) {
            reqParams.item_name = that.state.filterItemName
        }
        if (that.state.filterItemCode) {
            reqParams.code = that.state.filterItemCode
        }
        getAPI(INVENTORY_ITEM_EXPORT, successFn, errorFn, reqParams);
    }
    render() {
        console.log('props',this.props);
        const taxesdata = {};
        if (this.state.taxes_list) {
            this.state.taxes_list.forEach(function (tax) {
                taxesdata[tax.id] = tax;
            })
        }
        const manufacturerData = {}
        if (this.state.manufacture_list) {
            this.state.manufacture_list.forEach(function (manufacturer) {
                manufacturerData[manufacturer.id] = manufacturer.name;
            })
        }
        const vendorData = {}
        if (this.state.vendor_list) {
            this.state.vendor_list.forEach(function (vendor) {
                vendorData[vendor.id] = vendor.name;
            })
        }
        let that = this;
        let columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            // render: (value,record) => <span>{record.inventory_item.name}</span>
        }, {
            title: 'Item Code',
            dataIndex: 'code',
            key: 'code',
            // render: (value,record) => <span>{record.inventory_item.code}</span>
        }, {
            title: 'Inventory Stock',
            dataIndex: 'total_quantity',
            key: 'total_quantity',
            render:(value, record) => <span>{value} {value <= record.re_order_level ?
                <Tag color="#f50">Low</Tag> : null}</span>
               
        }, {
            title: 'Expired Stock',
            dataIndex: 'item_type_stock',
            key: 'expired_stock',
            export: function (item_type_stock, record) {
                let totalStock = 0;
                let currentDate = moment();
                if (item_type_stock.item_stock)
                    item_type_stock.item_stock.forEach(function (stock) {
                        if (currentDate >= moment(stock.expiry_date, "YYYY-MM-DD"))
                            totalStock += (Number.isInteger(stock.quantity) ? stock.quantity : 0)
                    });
                return totalStock;
            },
            render: function (item_type_stock, record) {
                let totalStock = 0;
                let currentDate = moment();
                if (item_type_stock.item_stock)
                    item_type_stock.item_stock.forEach(function (stock) {
                        if (currentDate >= moment(stock.expiry_date, "YYYY-MM-DD"))
                            totalStock += (Number.isInteger(stock.quantity) ? stock.quantity : 0)
                    });
                return <span>{totalStock}</span>;
            }
        }, {
            title: 'Retail Price (INR)',
            dataIndex: 'retail_without_tax',
            key: 'retail_without_tax',
            render: (value, record) => <span>{record.retail_without_tax}
                </span>
        }, {
            title: 'Tax',
            dataIndex: 'taxes',
            key: 'taxes',
            render: (value, record) => <span>
                {record.taxes_data && record.taxes_data.map(tax =>
                    <Tag>
                        <small> {(tax ? tax.name + "@" + tax.tax_value + "%" : null)}</small>
                    </Tag>
                )}
                </span>
        }, {
            title: 'Item type',
            dataIndex: 'item_type',
            key: 'item_type',
            // render: (value,record) => <span>{record.inventory_item.item_type}</span>
        }, {
            title: 'Reorder Level',
            dataIndex: 're_order_level',
            key: 're_order_level',
            // render: (value, record) => <span>{record.inventory_item.re_order_level}</span>
        }, {
            title: 'Manufacturer',
            key: 'manufacturer',
            export: function (text, record) {
                return record.manufacturer_data ? record.manufacturer_data.name : '';
            },
            render: (text, record) => (
                <span> {record.manufacturer_data ? record.manufacturer_data.name : ''}</span>
            )
        },
            //     {
            //     title:'Action',
            //     render:(item)=>{
            //         return <div>
            //           <a onClick={()=>this.setActionType(ADD_STOCK,item.id)}>Add </a>
            //             <Divider type="vertical"/>
            //             <a onClick={()=>this.setActionType(CONSUME_STOCK,item.id)}>Consume</a>
            //         </div>
            //     }
            // },
            {
                title: 'Actions',
                render: (item) => {
                    return <div>
                        <Link to={"/inventory/edit/" + item.id}>Edit</Link>
                        <Divider type="vertical"/>
                        {/* <Link to={"/inventory/edit-item-type/" + item.id}>Edit stock type </Link>
                        <Divider type="vertical"/> */}
                        {item.total_quantity==0?
                        <Popconfirm title="Are you sure delete this item?"
                                    onConfirm={() => that.deleteObject(item.id)} okText="Yes" cancelText="No">
                            <a>Delete</a>
                        </Popconfirm>:<Tag color="red">Can Not Delete</Tag>}
                    </div>
                }
            }];
        return <div>
            <Switch>
                <Route path="/inventory/add" render={(route)=> (that.props.activePracticePermissions.AddInventoryItem || that.props.allowAllPermissions ?
                    <AddorEditInventoryItem {...route} {...this.props} {...this.state} loadData={this.loadData}/>:<PermissionDenied/>)}/>

                {/* <Route path="/inventory/edit-item-type/:id"
                       render={(route) => <AddOrConsumeStock key={ADD_STOCK}
                       type={ADD_STOCK}
                       loadData={this.loadData}
                       {...this.state} {...route} {...this.props}/>}/> */}

                <Route exact path='/inventory/edit/:id'
                       render={(route) =>(that.props.activePracticePermissions.AddInventoryItem || that.props.allowAllPermissions ?
                        <AddorEditInventoryItem {...this.state} {...this.props} {...route} loadData={this.loadData}/>:<PermissionDenied/>)}/>

                <Route exact path='/inventory/consume-stock' render={(route) => (that.props.activePracticePermissions.AddInventoryStock || that.props.allowAllPermissions?
                    <AddOrConsumeStock key={CONSUME_STOCK} type={CONSUME_STOCK} loadData={this.loadData} {...this.state} {...route} {...this.props}/>:<PermissionDenied/>)}/>

                <Route exact path='/inventory/add-stock' render={(route) => (that.props.activePracticePermissions.ConsumeInventoryStock || that.props.allowAllPermissions ?
                     <AddOrConsumeStock key={ADD_STOCK} type={ADD_STOCK} loadData={this.loadData}{...this.state} {...route} {...this.props}/>:<PermissionDenied/>)}/>

                <Route>
                    <Card title="Inventory List"
                          extra={<Button.Group>
                                <Link to="/inventory/add"><Button type="primary"  disabled={!that.props.activePracticePermissions.AddInventoryItem || that.props.allowAllPermissions}><Icon type="plus"/> Add  Item</Button></Link>

                              <Link to="/inventory/add-stock"> <Button disabled={!that.props.activePracticePermissions.AddInventoryStock} type="primary">Add Stock</Button></Link>
                              <Link to="/inventory/consume-stock"><Button disabled={!that.props.activePracticePermissions.ConsumeInventoryStock} type="primary">Consume Stock</Button></Link>
                          </Button.Group>}>
                        <Row>
                            <Radio.Group name="itemTypeFilter" size="small" defaultValue={"ALL"} buttonStyle="solid"
                                         onChange={this.changeFilter} style={{margin: '10px'}}>
                                <Radio.Button value={"ALL"}>ALL</Radio.Button>
                                {INVENTORY_ITEM_TYPE.map(item =>
                                    <Radio.Button value={item.value}>
                                        {item.label}
                                    </Radio.Button>)}
                            </Radio.Group>
                            <Radio.Group name="itemStockFilter" size="small" defaultValue={"ALL"} buttonStyle="solid"
                                         style={{margin: '10px', float: 'right'}} onChange={this.changeFilter}>
                                <Radio.Button value={"ALL"}>ALL</Radio.Button>
                                <Radio.Button value={"Low"}>Low</Radio.Button>
                                <Radio.Button value={"Expired"}>Expired</Radio.Button>
                            </Radio.Group>
                        </Row>
                        <Row gutter={16} style={{marginBottom: 10}}>
                           
                            <Col span={4} style={{textAlign: "right"}}>
                                <b> Item Name</b>
                            </Col>
                            <Col span={4}>
                                <Input style={{width: '100%'}} value={this.state.filterItemName}
                                       allowClear={true}
                                       disabled={this.state.loading}
                                       onChange={(e) => this.changeInventoryFilters('filterItemName', e.target.value)}/>
                            </Col>
                            <Col span={4} style={{textAlign: "right"}}>
                                <b> Item Code</b>
                            </Col>
                            <Col span={4}>
                                <Input style={{width: '100%'}} value={this.state.filterItemCode}
                                       allowClear={true}
                                       disabled={this.state.loading}
                                       onChange={(e) => this.changeInventoryFilters('filterItemCode', e.target.value)}/>
                            </Col>
                            <Col span={8}>
                                <Button type={"primary"} onClick={this.loadData}> Filter Items</Button>
                            </Col>

                            <Col span={4}>
                                <Button.Group size="small">
                                    <Button disabled={this.state.loading} type="primary" onClick={this.excelExport}><Icon
                                        type="file-excel"/> Excel</Button>
                                    <Button disabled={this.state.loading} type="primary" onClick={this.pdfExport}><Icon
                                        type="file-pdf"/> PDF</Button>
                                </Button.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Table bordered={true}
                                   pagination={false}
                                   hideReport={true}
                                   dataSource={this.state.inventoryItems}
                                   columns={columns}/>
                            <Spin spinning={this.state.loading}>
                                <Row/>
                            </Spin>
                            <InfiniteFeedLoaderButton
                                loaderFunction={() => this.loadData(this.state.nextItemPage)}
                                loading={this.state.loading}
                                hidden={!this.state.nextItemPage}/>
                        </Row>
                        <Modal visible={this.state.stockModalVisibility}
                               title={"Stock" + this.state.actionType}
                               onOk={() => this.showAddOrConsumeModal(false)}
                               onCancel={() => this.showAddOrConsumeModal(false)}
                               footer={null}>
                            <AddOrConsumeStock showAddOrConsumeModal={this.showAddOrConsumeModal}
                                               itemId={this.state.itemId}
                                               actionType={this.state.actionType}/>
                        </Modal>
                    </Card>
                </Route>
            </Switch>

        </div>
    }


}
