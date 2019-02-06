import React from "react";
import {Button, Card, Icon, Modal, Tag, Divider, Popconfirm, Table, Tabs} from "antd";
import {getAPI, interpolate, deleteAPI} from "../../../../utils/common";
import MLMGenerate from "./MLMGenerate"
import {Link, Route, Switch} from "react-router-dom";
import {PRODUCT_MARGIN, ROLE_COMMISION, STAFF_ROLES} from "../../../../constants/api";

const TabPane = Tabs.TabPane;

export default class MlmBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mlmItems: [],
            active_practiceId: this.props.active_practiceId,
        }
        this.loadMlmData = this.loadMlmData.bind(this);
        this.loadRoles = this.loadRoles.bind(this);
    }

    componentDidMount() {
        this.loadMlmData();
        this.loadRoles();
        this.loadProductMargin();
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

    loadProductMargin() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                productMargin: data
            })
        }
        let errorFn = function () {

        }
        getAPI(PRODUCT_MARGIN, successFn, errorFn);
    }


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

        // if (this.state.productLevels) {
        //     this.state.productLevels.forEach(function (level) {
        //         columns.push({
        //                 title: (level.name),
        //                 key: (level.id),
        //                 dataIndex: (level.name),
        //                 render: item => <span>{item ? item : '--'} %</span>
        //             }
        //         );
        //     })
        // }


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
                       render={(route) => <MLMGenerate {...route} loadData={this.loadMlmData} {...this.state}/>}/>
                <Route>
                    <div>
                        <h2>MLM Commissions
                            <Link to="/settings/mlm/generate">
                                <Button type="primary" style={{float: 'right'}}>
                                    <Icon type="plus"/>&nbsp;Add
                                </Button>
                            </Link>
                        </h2>
                        <Card>
                            {this.state.productMargin ?
                                <Tabs type="card">
                                    {this.state.productMargin.map(marginType =>
                                        <TabPane tab={marginType.name} key={marginType.id}>
                                            <Table pagination={false} dataSource={datasource} columns={columns} bordered/>
                                        </TabPane>)}
                                </Tabs> : <h4>No MLM Data</h4>}

                        </Card>
                    </div>
                </Route>
            </Switch>

        </div>
    }
}
