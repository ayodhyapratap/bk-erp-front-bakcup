import React from "react";
import {Button, Card, Icon, Tabs, Divider, Tag, Row, Table, Popconfirm} from "antd";
import {PROCEDURE_CATEGORY} from "../../../../constants/api"
import {Route, Link, Switch} from "react-router-dom";
import {getAPI, interpolate, postAPI} from "../../../../utils/common";
import EditProcedure from "./EditProcedure";
import PermissionDenied from "../../../common/errors/PermissionDenied";


const {Column, ColumnGroup} = Table;
const TabPane = Tabs.TabPane;

class RecentProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'staff',
            procedure_category: null,
            editingProcedureData: null,
            loading:true
        };
        this.loadProcedures = this.loadProcedures.bind(this);
    }

    componentDidMount() {
        this.loadProcedures();
    }

    loadProcedures() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
                loading:false
            })
        };
        let errorFn = function () {
        };

        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    deleteObject(record) {
        let that = this;
        let reqData = record;
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadProcedures();
        }
        let errorFn = function () {
        };
        postAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), reqData, successFn, errorFn)
    }

    editProcedure(record) {
        this.setState({
            editingProcedureData: record,
            loading:false
        });
        let url = '/settings/procedures/' + record.id + '/editprocedure';
        this.props.history.push(url);

    }


    render() {
        let that = this;
        return <Switch>
            <Route exact path="/settings/procedures/:id/editprocedure"
                render={(route) => (that.props.activePracticePermissions.SettingsProcedureCatalog || that.props.allowAllPermissions ?
                    <EditProcedure  {...that.props} {...that.state}{...route}
                        loadProcedures={that.loadProcedures}/> : <PermissionDenied/>
                   )}/>
            <Row>
                <h2>Procedures
                    <Link to="/settings/procedures/addprocedure">
                        <Button type="primary" style={{float: 'right'}}>
                            <Icon type="plus"/>&nbsp;Add Procedure
                        </Button>
                    </Link>
                </h2>
                <Card>
                    <Tabs defaultActiveKey="procedurecatalog">
                        <TabPane tab={<span><Icon type="android"/>Procedure Catalog</span>} key="procedurecatalog">
                            <Table loading={this.state.loading} dataSource={this.state.procedure_category}>
                                <Column
                                    title="Procedure Name"
                                    dataIndex="name"
                                    key="name"
                                />
                                <Column
                                    title="Procedure Unit Cost"
                                    dataIndex="cost"
                                    key="cost"
                                />
                                <Column
                                    title="MLM Margin"
                                    dataIndex="margin"
                                    key="margin"
                                />
                                <Column
                                    title="Applicable Taxes"
                                    dataIndex="taxes"
                                    key="taxes"
                                    render={taxes => (
                                        <span>
                                        {taxes.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                                    </span>
                                    )}
                                />
                                <Column
                                    title="Standard Notes"
                                    dataIndex="default_notes"
                                    key="default_notes"
                                />
                                <Column
                                    title="Action"
                                     key="action"
                                    render={(text, record) => (
                                        <span>
                                            <a onClick={() => this.editProcedure(record)}>Edit</a>
                                        <Divider type="vertical"/>
                                        <Popconfirm title="Are you sure delete this?"
                                                    onConfirm={() => that.deleteObject(record)} okText="Yes"
                                                    cancelText="No">
                                            <a>Delete</a>
                                        </Popconfirm>
                                    </span>
                                    )}
                                />

                            </Table>
                        </TabPane>

                    </Tabs>

                </Card>
            </Row>
        </Switch>
    }
}

export default RecentProcedure;
