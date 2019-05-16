import React from "react";
import {Button, Card, Divider, Form, Icon, Popconfirm, Row, Table} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import {DRUG_CATALOG, INVENTORY_ITEM_API,} from "../../../../constants/api";
import {getAPI, interpolate, postAPI} from "../../../../utils/common";
import AddPrescription from "./AddPrescription";
import {DRUG} from "../../../../constants/hardData";
import AddorEditPrescriptionForm from "./AddorEditPrescriptionForm";
import InfiniteFeedLoaderButton from "../../../common/InfiniteFeedLoaderButton";

class Prescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            catalog: null,
            editCatalog: null,
            loading: true,
            loadMorePrescriptions: null
        }
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.loadInitialData = this.loadInitialData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                catalog: data.results,
                loadMorePrescriptions: data.next,
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(INVENTORY_ITEM_API, successFn, errorFn, {
            practice: this.props.active_practiceId,
            item_type: DRUG,
            maintain_inventory: false,
            page: that.state.loadMorePrescriptions || 1
        });
    }

    loadInitialData() {
        let that = this;
        this.setState({
            loadMorePrescriptions: null
        }, function () {
            that.loadData();
        })
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

    editCatalog(record) {
        this.setState({
            editCatalog: record,
            loading: false
        });
        this.props.history.push('/settings/prescriptions/edit')
    }

    render() {
        let that = this;
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'code',
        }, {
            title: 'Dosage',
            dataIndex: 'strength',
            key: 'strength',
            render: (strength, record) => <span>{strength}&nbsp;{record.stength_unit}</span>
        }, {
            title: ' Drug Instructions',
            dataIndex: 'instructions',
            key: 'instructions',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.editCatalog(record)}>
                Edit</a>
                <Divider type="vertical"/>
                  <Popconfirm title="Are you sure delete this prescription?" onConfirm={() => that.deleteObject(record)}
                              okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </span>
            ),
        }];
        return <Row>
            <Switch>
                <Route exact path="/settings/prescriptions/add"
                       render={() => <AddorEditPrescriptionForm  {...this.props} loadData={this.loadInitialData}/>}/>
                <Route exact path="/settings/prescriptions/edit"
                       render={(route) => <AddPrescription  {...this.state}
                                                            loadData={this.loadInitialData} {...this.props} {...route}/>}/>
                <Route>
                    <div>
                        <h2>All presciptions
                            <Link to="/settings/prescriptions/add">
                                <Button type="primary" style={{float: 'right'}}>
                                    <Icon type="plus"/>&nbsp;Add
                                </Button>
                            </Link>
                        </h2>
                        <Card>
                            <Table loading={this.state.loading} columns={columns} dataSource={this.state.catalog}
                                   pagination={false}/>
                        </Card>
                        <InfiniteFeedLoaderButton loaderFunction={this.loadData}
                                                  loading={this.state.loading}
                                                  hidden={!this.state.loadMorePrescriptions}/>
                    </div>
                </Route>
            </Switch>
        </Row>
    }
}

export default Prescriptions;
