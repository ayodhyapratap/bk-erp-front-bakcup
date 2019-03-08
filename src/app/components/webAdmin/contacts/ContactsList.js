import {Button, Card, Divider, Icon, Popconfirm, Table} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI} from "../../../utils/common";
import {BLOG_CONTACTUS, SINGLE_CONTACT} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddContacts from "./AddContacts";

export default class ContactsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: null
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
                contacts: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_CONTACTUS, successFn, errorFn);
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
        patchAPI(interpolate(SINGLE_CONTACT, [record.id]), reqData, successFn, errorFn)
    }

    render() {
        let that = this;
        let coloumns = [{
            title: 'Rank',
            dataIndex: 'contact_rank',
            key: 'rank'
        }, {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        }, {
            title: 'Phone',
            dataIndex: 'phone_no',
            key: 'phone'
        },
            {
                title: 'Actions',
                render: (item) => {
                    return <div>
                        <Link to={"/web/contact/edit/" + item.id}>Edit</Link>
                        <Divider type="vertical"/>
                        <Popconfirm title="Are you sure delete this item?"
                                    onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                            <a>Delete</a>
                        </Popconfirm>
                    </div>
                }
            }];
        return <div><Switch>
            <Route exact path='/web/contact/add'
                   render={(route) => <AddContacts {...this.state} {...route} loadData={this.loadData}/>}/>
            <Route exact path='/web/contact/edit/:id'
                   render={(route) => <AddContacts {...this.state} {...route} loadData={this.loadData}/>}/>
            <Card title="Contacts"
                  extra={<Link to={"/web/contact/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <Table dataSource={this.state.contacts} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
