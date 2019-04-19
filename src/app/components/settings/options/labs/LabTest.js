import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Divider, Form, Icon, Popconfirm, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {Link, Route, Switch} from "react-router-dom";
import {LABTEST_API, OFFERS, PRODUCT_MARGIN} from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate, postAPI} from "../../../../utils/common";
import AddorEditLab from "./AddorEditLab";

class LabTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tests: null,
            editTest: null,
            loading:true,
            productMargin:null
        };
        this.editLabs = this.editLabs.bind(this);
        this.loadData = this.loadData.bind(this);
        this.deleteTest = this.deleteTest.bind(this);
        this.loadProductMargin =this.loadProductMargin.bind(this);
    }

    componentDidMount() {
        this.loadData();
        this.loadProductMargin();
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                tests: data,
                loading:false
            })
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        getAPI(interpolate(LABTEST_API, [that.props.active_practiceId]), successFn, errorFn);
    }

    editLabs(record) {
        let that = this;
        this.setState({
            editTest: record,
            loading:false
        }, function () {
            that.props.history.push('/settings/labs/edit');
        })


    }
    deleteTest(record) {
        let that = this;
        let reqData = record;
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        }
        postAPI(interpolate(LABTEST_API, [this.props.active_practiceId]), reqData, successFn, errorFn);
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
        let that = this;
        const product_margin={}
        if(this.state.productMargin){
            this.state.productMargin.forEach(function (margin) {
                product_margin[margin.id] = (margin.name)
            })
        }
        console.log("table",product_margin)
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'code',
        }, {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
        }, {
            title: ' Test Instructions',
            dataIndex: 'instruction',
            key: 'instruction',
        }, {
            title: ' MLM Margin',
            key: 'margin',
            render: (text, record) => (
                <span> {product_margin[record.margin]}</span>
            )
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span><a onClick={() => that.editLabs(record)}>
                Edit</a>
                <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this test?" onConfirm={() => that.deleteTest(record)}
                                okText="Yes" cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>
              </span>
            ),
        }];
        return <Row>
            <Switch>
                <Route exact path={'/settings/labs/add'}
                       render={() => <AddorEditLab {...that.state} loadData={this.loadData}{...this.props}/>}/>
                <Route exact path={'/settings/labs/edit'}
                       render={() => <AddorEditLab {...that.state} loadData={this.loadData} {...this.props}/>}/>
                <Route exact path={'/settings/labs'}>
                    <div>
                        <h2>Lab Tests
                            <Link to="/settings/labs/add">
                                <Button type="primary" style={{float: 'right'}}>
                                    <Icon type="plus"/>&nbsp;Add
                                </Button>
                            </Link>
                        </h2>
                        <Card>
                            <Table loading={this.state.loading} columns={columns} dataSource={this.state.tests}/>
                        </Card>
                    </div>
                </Route>
            </Switch>

        </Row>
    }
}

export default LabTest;
