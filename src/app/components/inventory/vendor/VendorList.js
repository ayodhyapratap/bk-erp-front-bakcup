import {Button, Card, Icon,Popconfirm,Divider} from "antd";
import React from "react";
import {getAPI, interpolate,putAPI} from "../../../utils/common";
import {VENDOR_API ,SINGLE_VENDOR_API}from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddVendor from "./AddVendor";
import {Link} from "react-router-dom";
import CustomizedTable from "../../common/CustomizedTable";

export default class VendorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_practiceId: this.props.active_practiceId,
            vendors: null
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                vendors: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(VENDOR_API, [this.props.active_practiceId]), successFn, errorFn);
    }
    deleteVendor(value){
        var that = this;
        let reqData={...value, 'is_active':false}
        console.log("is_active",reqData);
        let successFn = function (data) {
            that.loadData();
            console.log("Deleted");
        }
        let errorFn = function () {
        };
        putAPI(interpolate(SINGLE_VENDOR_API, [value]),reqData, successFn, errorFn);
    }
    render() {
        let that = this;
        const vendorsColoumns = [{
            title: 'Name',
            key: 'name',
            dataIndex: 'name'
        }, {
            title: 'Details',
            key: 'details',
            dataIndex: 'description'
        }, {
            title: 'Action',
            render: function (record) {
                return <div>
                    <Link to={'/inventory/vendor/edit/' + record.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteVendor(record.id)} okText="Yes" cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>

                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/inventory/vendor/add'
                   render={(route) => <AddVendor {...this.state} {...route} loadData={that.loadData}/>}/>
            <Route exact path='/inventory/vendor/edit/:id'
                   render={(route) => <AddVendor {...this.state} {...route} loadData={that.loadData}/>}/>
            <Card title="Vendors" extra={<Link to={"/inventory/vendor/add"}> <Button type="primary"><Icon
                type="plus"/> Add</Button></Link>}>
                <CustomizedTable columns={vendorsColoumns} dataSource={this.state.vendors}/>
            </Card>
        </Switch>
        </div>
    }
}
