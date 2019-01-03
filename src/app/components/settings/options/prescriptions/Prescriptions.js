import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Divider, Form, Icon, Popconfirm, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {Link, Route, Switch} from "react-router-dom";
import {DRUG_CATALOG,} from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate, postAPI} from "../../../../utils/common";
import AddPrescription from "./AddPrescription";

class Prescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            catalog: null,
            editCatalog: null
        }
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                catalog: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn);
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
        postAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), reqData, successFn, errorFn);
    }

    editCatalog(record) {
        this.setState({
            editCatalog: record
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
        }, {
            title: ' Drug Instructions',
            dataIndex: 'instruction',
            key: 'instruction',
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
                       render={() => <AddPrescription  {...this.props} loadData={this.loadData}/>}/>
                <Route exact path="/settings/prescriptions/edit"
                       render={(route) => <AddPrescription  {...this.state} loadData={this.loadData} {...this.props} {...route}/>}/>
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
                            <Table columns={columns} dataSource={this.state.catalog}/>
                        </Card>
                    </div>
                </Route>
            </Switch>
        </Row>
    }
}

export default Prescriptions;
