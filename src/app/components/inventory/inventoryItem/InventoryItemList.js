import React from "react";
import {Button, Card, Icon, Tag, Divider, Popconfirm, Table} from "antd";
import {getAPI, interpolate, deleteAPI} from "../../../utils/common";
import {INVENTORY_API, SINGLE_INVENTORY_API, MANUFACTURER_API, TAXES, VENDOR_API} from "../../../constants/api";
import {Link, Route, Switch} from "react-router-dom";
import AddorEditInventoryItem from "./AddorEditInventoryItem";

export default class InventoryItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryItemList: [],
            active_practiceId:this.props.active_practiceId,
        }
        this.loadData = this.loadData.bind(this);
    }
    componentDidMount(){
      this.loadData();
      this.loadTaxes();
      this.loadManufactureList();
      this.loadVendorList();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                inventoryItemList: data
            })
        }
        let errorFn = function () {
        }
        getAPI(INVENTORY_API, successFn, errorFn);
    }
    loadManufactureList() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                manufacture_list: data
            })
        }
        let errorFn = function () {

        }
        getAPI(MANUFACTURER_API, successFn, errorFn);
    }
    loadTaxes(){
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                taxes_list:data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate( TAXES, [this.props.active_practiceId]), successFn, errorFn);

    }

    loadVendorList() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                vendor_list: data
            })
        }
        let errorFn = function () {

        }
        getAPI(VENDOR_API, successFn, errorFn);
    }

    deleteObject(value){
      var that = this;
      let successFn = function (data) {
        that.loadData();
        console.log("Deleted");
      };
      let errorFn = function () {
      };
      deleteAPI(interpolate(SINGLE_INVENTORY_API,[value]), successFn, errorFn);

    }

    render() {
      const taxesdata={}
      if(this.state.taxes_list){
          this.state.taxes_list.forEach(function (tax) {
              taxesdata[tax.id]=tax.name;
          })
      }
      const manufacturerData={}
      if(this.state.manufacture_list){
          this.state.manufacture_list.forEach(function (manufacturer) {
              manufacturerData[manufacturer.id]=manufacturer.name;
          })
      }
      const vendorData={}
      if(this.state.vendor_list){
          this.state.vendor_list.forEach(function (vendor) {
              vendorData[vendor.id]=vendor.name;
          })
      }
      let that =this;
      let columns = [{
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
      },{
          title:'code',
          dataIndex:'code',
          key:'code'
      },{
          title:'Stocking Unit',
          dataIndex:'stocking_unit',
          key:'stocking_unit'
      },{
          title:'Retail Price',
          dataIndex:'retail_price',
          key:'retail_price'
      },{
          title:'Item type',
          dataIndex:'item_type',
          key:'item_type'
      },{
          title:'Reorder Level',
          dataIndex:'re_order_level',
          key:'re_order_level'
      }, {
      title: 'Taxes',
      key: 'taxes',
      dataIndex:"taxes",
      render: taxes => (
                  <span>
            {taxes.map(tax => <Tag color="blue" key={tax}>{taxesdata[tax]}</Tag>)}
          </span>
          ),
      }, {
      title: 'Manufacturer',
      key: 'manufacturer',
      render:(text, record) => (
          <span> {manufacturerData[record.manufacturer]}</span>
      )
      }, {
      title: 'Vendor',
      key: 'vendor',
      render:(text, record) => (
          <span> {vendorData[record.vendor]}</span>
      )
      },{
          title:'Actions',
          render:(item)=>{
              return <div>
                  <Link to={"/inventory/edit/"+item.id}>Edit</Link>
                  <Divider type="vertical"/>
                  <Popconfirm title="Are you sure delete this item?"
                              onConfirm={() => that.deleteObject(item.id)} okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </div>
          }
      }];
        return <div>
            <Switch>
                <Route path="/inventory/add" render={(route) => <AddorEditInventoryItem {...route} {...this.state}/>}/>
                <Route exact path='/inventory/edit/:id'
                       render={(route) => <AddorEditInventoryItem {...this.state} {...route}/>}/>
                <Route>
                    <Card title="Inventory List"
                          extra={<Link to="/inventory/add"><Button><Icon type="plus"/> Add</Button></Link>}>
                        <Table dataSource={this.state.inventoryItemList} columns={columns}/>
                    </Card>
                </Route>
            </Switch>

        </div>
    }


}
