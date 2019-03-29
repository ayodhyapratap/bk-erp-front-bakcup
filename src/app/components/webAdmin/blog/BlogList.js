import {Button, Card, Divider, Icon, Popconfirm, Table,} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI} from "../../../utils/common";
import {BLOG_POST, SINGLE_POST} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddPost from "./AddPost";
import {Link} from "react-router-dom";

export default class DiseaseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null
        };
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                post: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_POST, successFn, errorFn);
    }

    deleteObject(record) {
        let that = this;
        let reqData = {};
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        };
        let errorFn = function () {
        };
        patchAPI(interpolate(SINGLE_POST, [record.id]), reqData, successFn, errorFn)
    }

    render() {
        let that = this;
        let coloumns = [{
            title: 'Blog Title',
            dataIndex: 'title',
            key: 'post_title'
        }, {
            title: 'Date',
            dataIndex: 'posted_on',
            key: 'post_date' 
        }, {
            title: 'Actions',
            render: (item) => {
                return <div>
                    <Link to={"/web/blog/edit/" + item.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>
                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/web/blog/add'
                   render={(route) => <AddPost {...this.state} {...route}/>}/>
            <Route exact path='/web/blog/edit/:id'
                   render={(route) => <AddPost {...this.state} {...route}/>}/>
            <Card title="Blogs"
                  extra={<Link to={"/web/blog/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <Table dataSource={this.state.post} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
