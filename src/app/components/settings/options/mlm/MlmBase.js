import React from "react";
import {Button, Card, Icon, Modal, Tag, Divider, Popconfirm, Table} from "antd";
import {getAPI, interpolate, deleteAPI} from "../../../../utils/common";
import MLMGenerate from "./MLMGenerate"
import {Link, Route, Switch} from "react-router-dom";
import {ROLE_COMMISION, STAFF_ROLES, PRODUCT_LEVEL} from "../../../../constants/api"


export default class MlmBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mlmItems: [],
            active_practiceId: this.props.active_practiceId,
        }
    }

    componentDidMount() {
        this.loadMlmData();
        this.loadRoles();

    }

    loadMlmData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                mlmItems: data
            })
        }
        let errorFn = function () {

        }
        getAPI(ROLE_COMMISION, successFn, errorFn);
    }

    loadRoles() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                staffRoles: data
            })
        }
        let errorFn = function () {

        }
        getAPI(STAFF_ROLES, successFn, errorFn);
    }

    // loadProductlevels() {
    //     let that = this;
    //     let successFn = function (data) {
    //         that.setState({
    //             productLevels: data
    //         })
    //     }
    //     let errorFn = function () {
    //
    //     }
    //     getAPI(PRODUCT_LEVEL, successFn, errorFn);
    // }


    render() {
        const rolesdata = {}
        if (this.state.staffRoles) {
            this.state.staffRoles.forEach(function (role) {
                rolesdata[role.id] = role.name;
            })
        }
        let columns = [{
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
        }];

        if (this.state.productLevels) {
            this.state.productLevels.forEach(function (level) {
                columns.push({
                        title: (level.name),
                        key: (level.id),
                        dataIndex: (level.name),
                        render: item => <span>{item ? item : '--'} %</span>
                    }
                );
            })
        }


        let that = this;

        let datasource = [];
        if (that.state.staffRoles) {
            that.state.staffRoles.forEach(function (role) {
                let roledata = {"role": role.name};
                if (that.state.productLevels) {
                    that.state.productLevels.forEach(function (level) {
                        if (that.state.mlmItems) {
                            for (let i = 0; i < that.state.mlmItems.length; i++) {
                                let item = that.state.mlmItems[i];
                                if (item.role == role.id && item.level == level.id) {
                                    roledata[level.name] = item.commision_percent;
                                    break;
                                }
                            }
                        }
                    })
                }
                datasource.push(roledata);
            })
        }
        return <div>
            <Switch>
                <Route path="/settings/mlm/generate"
                       render={(route) => <MLMGenerate {...route} loadData={this.loadMlmData}{...this.state}/>}/>
                <Route>
                    <Card title="MLM List"
                          extra={<div>
                              <Link to="/settings/mlm/generate"><Button type="primary">Set MLM Commission</Button></Link>
                          </div>}>
                        <Table dataSource={datasource} columns={columns} bordered/>

                    </Card>
                </Route>
            </Switch>

        </div>
    }
}
