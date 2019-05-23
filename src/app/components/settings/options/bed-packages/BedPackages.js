import React from "react";
import {Button, Card, Divider, Icon, Popconfirm} from 'antd';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import CustomizedTable from "../../../common/CustomizedTable";
import AddorEditBedPackages from "./AddorEditBedPackages";
import {postAPI} from "../../../../utils/common";
import {INVENTORY_ITEM_API} from "../../../../constants/api";

export default class BedPackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            packages: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                loading: false,
                packages: data
            })
        }
        let erroFn = function () {
            that.setState({
                loading: false,
            })
        }
    }

    deleteObject(record) {
        let that = this;
        let reqData = record;
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        }
        postAPI(INVENTORY_ITEM_API, reqData, successFn, errorFn);
    }

    editObject=(record)=> {
        this.setState({
            editPackage: record,
            loading: false
        });
        this.props.history.push('/settings/bed-packages/edit')
    }

    render() {
        let that = this;
        let columns = [{
            title: "Package Name",
            dataIndex: 'name',
            key: 'name'

        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.editObject(record)}>
                Edit</a>
                <Divider type="vertical"/>
                  <Popconfirm title="Are you sure delete this prescription?" onConfirm={() => that.deleteObject(record)}
                              okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </span>
            ),
        }]
        return <Switch>
            <Route path={"/settings/bed-packages/add"}
                   render={(route) => <AddorEditBedPackages {...this.state}{...this.props} {...route}/>}/>
            <Route path={"/settings/bed-packages/edit"}
                   render={(route) => (this.state.editPackage ?
                       <AddorEditBedPackages {...this.state} {...this.props} {...route}/> :
                       <Redirect to={"/settings/bed-packages"}/>)
                   }/>
            <Route>
                <Card
                    title={<h4>Bed Packages <Link to={"/settings/bed-packages/add"}><Button style={{float: 'right'}}
                                                                                            type={"primary"}><Icon
                        type={"plus"}/> Add</Button></Link></h4>}>
                    <CustomizedTable dataSource={this.state.packages} loading={this.state.loading}
                                     columns={columns}/>
                </Card>
            </Route>
        </Switch>
    }
}
