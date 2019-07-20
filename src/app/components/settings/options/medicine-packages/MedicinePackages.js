import React from "react";
import {Button, Card, Divider, Icon, Popconfirm} from 'antd';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import CustomizedTable from "../../../common/CustomizedTable";
import {getAPI, interpolate, makeFileURL, postAPI} from "../../../../utils/common";
import {MEDICINE_PACKAGES} from "../../../../constants/api";
import AddorEditMedicinePackages from "./AddorEditMedicinePackages";

export default class MedicinePackages extends React.Component {
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
        let errorFn = function () {
            that.setState({
                loading: false,
            })
        }
        getAPI(interpolate(MEDICINE_PACKAGES, [this.props.active_practiceId]), successFn, errorFn);
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
        postAPI(interpolate(MEDICINE_PACKAGES, [this.props.active_practiceId]), reqData, successFn, errorFn);
    }

    editObject = (record) => {
        this.setState({
            editPackage: record,
            loading: false
        });
        this.props.history.push('/settings/medicine-packages/edit')
    }

    render() {
        let that = this;
        let columns = [{
            dataIndex: 'image',
            key: 'image',
            render: (value) => value ?
                <img src={makeFileURL(value)} alt="" style={{maxWidth: 200, maxHeight: 100}}/> : null
        },{
            title: "Package Name",
            dataIndex: 'name',
            key: 'name'
        }, {
            title: "Days",
            dataIndex: 'no_of_days',
            key: 'no_of_days'
        }, {
            title: "Price (INR) + Tax",
            dataIndex: 'final_price',
            key: 'price'
        },
        // {
        //     title: "Final Price (INR)",
        //     dataIndex: 'final_price',
        //     key: 'final_price'
        // },
         {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.editObject(record)}>
                Edit</a>
                <Divider type="vertical"/>
                  <Popconfirm title="Are you sure delete this item?" onConfirm={() => that.deleteObject(record)}
                              okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </span>
            ),
        }]
        return <Switch>
            <Route path={"/settings/medicine-packages/add"}
                   render={(route) => <AddorEditMedicinePackages {...this.state}{...this.props} {...route}
                                                                 loadData={this.loadData}/>}/>
            <Route path={"/settings/medicine-packages/edit"}
                   render={(route) => (this.state.editPackage ?
                       <AddorEditMedicinePackages {...this.state} {...this.props} {...route}
                                                  loadData={this.loadData}/> :
                       <Redirect to={"/settings/medicine-packages"}/>)
                   }/>
            <Route>
                <Card
                    title={<h4>Medicine Packages <Link to={"/settings/medicine-packages/add"}><Button
                        style={{float: 'right'}}
                        type={"primary"}><Icon
                        type={"plus"}/> Add</Button></Link></h4>}>
                    <CustomizedTable dataSource={this.state.packages} loading={this.state.loading}
                                     columns={columns}/>
                </Card>
            </Route>
        </Switch>
    }
}
