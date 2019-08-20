import {Button, Card,Icon,Divider,Popconfirm} from "antd";
import React from "react";
import {getAPI,deleteAPI,interpolate,putAPI} from "../../../utils/common";
import {MANUFACTURER_API,SINGLE_MANUFACTURER_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddManufacture from "./AddManufacture";
import {Link} from "react-router-dom";
import CustomizedTable from "../../common/CustomizedTable";
import PermissionDenied from "../../common/errors/PermissionDenied";

export default class ManufactureList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_practiceId: this.props.active_practiceId,
            manufactures: null,
            loading:true
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
                manufactures: data,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        getAPI(MANUFACTURER_API, successFn, errorFn);
    }

    deleteManufacture(value) {
        var that = this;
        let reqDate={...value,
            'is_active':false
        }
        let successFn = function (data) {
            that.setState({
                loading:false
            })
            that.loadData();
        };
        let errorFn = function () {
        };
        putAPI(interpolate(SINGLE_MANUFACTURER_API, [value]), reqDate,successFn, errorFn);

    }


    render() {
        console.log(this.state)
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
                    {that.props.activePracticePermissions.EditManufacturer || that.props.allowAllPermissions ?
                    <Link to={'/inventory/manufacture/edit/' + record.id}>Edit</Link>:null}
                    <Divider type="vertical"/>
                    {that.props.activePracticePermissions.DeleteManufacturer || that.props.allowAllPermissions ?
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteManufacture(record.id)} okText="Yes" cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>:null}

                    
                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/inventory/manufacture/add'
                   render={(route) =>(that.props.activePracticePermissions.EditManufacturer || that.props.allowAllPermissions ? <AddManufacture {...this.state} {...route} {...this.props} loadData={that.loadData}/>:<PermissionDenied/>)}/>
            <Route  path='/inventory/manufacture/edit/:id'
                   render={(route) =>(that.props.activePracticePermissions.EditManufacturer || that.props.allowAllPermissions ? <AddManufacture {...this.state}  {...this.props} {...route} loadData={that.loadData}/>:<PermissionDenied/>)}/>
            <Card title="Manufacturers" extra={<Link to={"/inventory/manufacture/add"}> <Button type="primary" disabled={!that.props.activePracticePermissions.EditManufacturer}><Icon
                type="plus"/> Add</Button></Link>}>
                <CustomizedTable loading={this.state.loading} dataSource={this.state.manufactures} columns={manufactureColoumns} hideReport={!that.props.activePracticePermissions.ExportManufacturer}/>
            </Card>
        </Switch>
        </div>
    }
}
