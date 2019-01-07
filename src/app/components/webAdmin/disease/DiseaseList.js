import {Button, Card, Divider, Icon, List, Popconfirm, Table} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI} from "../../../utils/common";
import {BLOG_DISEASE, SINGLE_CONTACT, SINGLE_DISEASE} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddDisease from "./AddDisease";
import {Link} from "react-router-dom";

export default class DiseaseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disease: null
        };
        this.loadDiseases = this.loadDiseases.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
    }

    componentDidMount() {
        this.loadDiseases();
    }

    loadDiseases() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                disease: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_DISEASE, successFn, errorFn);
    }
    deleteObject(record) {
        let that = this;
        let reqData = {};
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadDiseases();
        };
        let errorFn = function () {
        };
        patchAPI(interpolate(SINGLE_DISEASE, [record.id]), reqData, successFn, errorFn)
    }
    render() {
        let that = this;
        let coloumns = [{
            title: 'Disease Name',
            dataIndex: 'disease_name',
            key: 'disease_name'
        },{
            title:'Disease Type',
            dataIndex:'disease_type',
            key:'disease_type'
        },{
            title:'Actions',
            render:(item)=>{
                return <div>
                    <Link to={"/web/disease/edit/"+item.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>
                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/web/disease/add'
                   render={(route) => <AddDisease{...this.state} {...route}/>}/>
            <Route exact path='/web/disease/edit/:id'
                   render={(route) => <AddDisease{...this.state} {...route}/>}/>
            <Card title="Disease"
                  extra={<Link to={"/web/disease/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <Table columns={coloumns} dataSource={this.state.disease}/>

            </Card>
        </Switch>
        </div>
    }
}
