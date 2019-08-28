import React from "react";
import {Button, Card, Icon, Table, Tabs, Row} from "antd";
import {getAPI, interpolate, postAPI, patchAPI, deleteAPI, putAPI} from "../../../../utils/common";
import MLMGenerate from "./MLMGenerate"
import {Link, Route, Switch} from "react-router-dom";
import {PRODUCT_MARGIN, ROLE_COMMISION, SINGLE_PRODUCT_MARGIN, AGENT_ROLES} from "../../../../constants/api";

const TabPane = Tabs.TabPane;

export default class MlmBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mlmItems: [],
            productMargin: [],
            active_practiceId: this.props.active_practiceId,
            loading: true
        }
        console.log("mlm", this.state.active_practiceId);
        this.loadMlmData = this.loadMlmData.bind(this);
        this.loadRoles = this.loadRoles.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
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
                mlmItems: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(ROLE_COMMISION, successFn, errorFn);
    }

    loadRoles() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                staffRoles: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(AGENT_ROLES, successFn, errorFn);
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

    editObject(id, record) {
        this.setState({
            editId: id,
            editRecord: record,
            loading: false
        }, function () {
            this.props.history.push('/settings/mlm/edit');
        })
    }

    deleteObject(record) {
        let that = this;
        let reqData = {...record, is_active: false};
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadProductMargin();
        }
        let errorFn = function () {
        }
        putAPI(interpolate(SINGLE_PRODUCT_MARGIN, [record.id]), reqData, successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that = this;
        const rolesdata = {}
        if (this.state.staffRoles) {
            this.state.staffRoles.forEach(function (role) {
                rolesdata[role.id] = role.name;
            })
        }
        let columns = {}

        that.state.productMargin.forEach(function (productMargin) {
            columns[productMargin.id] = [{
                title: 'Role',
                key: 'role',
                dataIndex: 'role',
            }];
            for (let level = 1; level <= productMargin.level_count; level++) {
                columns[productMargin.id].push({
                    title: 'Level ' + level,
                    key: level,
                    dataIndex: level,
                    render: (value) => <span>{value}%</span>
                })
            }
        })


        let datasource = {};

        that.state.productMargin.forEach(function (productMargin) {
            datasource[productMargin.id] = [];

            if (that.state.staffRoles) {
                that.state.staffRoles.forEach(function (role) {
                    let roledata = {"role": role.name};
                    if (productMargin.level_count) {
                        for (let level = 1; level <= productMargin.level_count; level++) {
                            if (that.state.mlmItems) {
                                for (let i = 0; i < that.state.mlmItems.length; i++) {
                                    let item = that.state.mlmItems[i];
                                    if (item.margin.id == productMargin.id && item.level == level && role.id == item.role) {
                                        roledata[level] = item.commision_percent;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    datasource[productMargin.id].push(roledata);
                })
            }
        });
        return <div>
            <Switch>
                <Route exact path="/settings/mlm/generate"
                       render={(route) => <MLMGenerate {...route}
                                                       loadData={this.loadMlmData} {...this.state}/>}/>
                {this.state.editId && this.state.editRecord ?
                    <Route exact path="/settings/mlm/edit"
                           render={(route) => <MLMGenerate {...route}
                                                           loadData={this.loadMlmData} {...this.state}/>}/> : null}
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
                                            <Row>
                                                <Button.Group>
                                                    <Button type="primary"
                                                            onClick={() => this.editObject(marginType.id, datasource[marginType.id])}><Icon
                                                        type="edit"/> Edit</Button>
                                                    <Button type="danger"
                                                            onClick={() => that.deleteObject(marginType)}><Icon
                                                        type="delete"/> Delete</Button>
                                                </Button.Group>
                                            </Row>
                                            <Table loading={this.state.loading} pagination={false}
                                                   dataSource={datasource[marginType.id]}
                                                   rowKey="role"
                                                   columns={columns[marginType.id]}
                                                   bordered/>
                                        </TabPane>)}
                                </Tabs> : <h4>No MLM Data</h4>}

                        </Card>
                    </div>
                </Route>
            </Switch>

        </div>
    }
}
