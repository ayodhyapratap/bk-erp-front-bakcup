import {Button, Card,Icon,Divider,Popconfirm} from "antd";
import React from "react";
import {getAPI,deleteAPI,interpolate} from "../../../utils/common";
import {MANUFACTURER_API,SINGLE_MANUFACTURER_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddManufacture from "./AddManufacture";
import {Link} from "react-router-dom";
import CustomizedTable from "../../common/CustomizedTable";

export default class ManufactureList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_practiceId: this.props.active_practiceId,
            manufactures: null
        };
        this.loadData = this.loadData.bind(this);
        this.deleteManufacture =this.deleteManufacture.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                manufactures: data
            })
        }
        let errorFn = function () {

        }
        getAPI(MANUFACTURER_API, successFn, errorFn);
    }

    deleteManufacture(value) {
        var that = this;
        let successFn = function (data) {
            that.loadData();
            console.log("Deleted");
        };
        let errorFn = function () {
        };
        deleteAPI(interpolate(SINGLE_MANUFACTURER_API, [value]), successFn, errorFn);

    }


    render() {
        let that = this;
        const manufactureColoumns = [{
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
                    <Link to={'/inventory/manufacture/edit/' + record.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteManufacture(record.id)} okText="Yes" cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>

                    
                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/inventory/manufacture/add'
                   render={(route) => <AddManufacture {...this.state} {...route} loadData={that.loadData}/>}/>
            <Route exact path='/inventory/manufacture/edit/:id'
                   render={(route) => <AddManufacture {...this.state} {...route} loadData={that.loadData}/>}/>
            <Card title="Manufactures" extra={<Link to={"/inventory/manufacture/add"}> <Button type="primary"><Icon
                type="plus"/> Add</Button></Link>}>
                <CustomizedTable dataSource={this.state.manufactures} columns={manufactureColoumns}/>
            </Card>
        </Switch>
        </div>
    }
}
