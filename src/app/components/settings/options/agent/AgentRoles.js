import React from "react";
import {Button, Card, Divider, Icon, Popconfirm, Table} from 'antd';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import CustomizedTable from "../../../common/CustomizedTable";
import AddOrEditAgentRoles from "./AddOrEditAgentRoles";
import {getAPI, interpolate, makeFileURL, postAPI} from "../../../../utils/common";
import {AGENT_ROLES} from "../../../../constants/api";

export default class AgentRoles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            roles: []
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
                roles: data
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false,
            })
        }
        getAPI(interpolate(AGENT_ROLES, [this.props.active_practiceId]), successFn, errorFn);
    }

    editObject = (record) => {
        this.setState({
            editRole: record,
            loading: false
        });
        this.props.history.push('/settings/agent-roles/'+ record.id+'/edit')
    }


    deleteObject(record) {
        let that = this;
        let reqData ={
            id:record.id,
            'is_active' :false};
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        }
        postAPI(interpolate(AGENT_ROLES, [record.id]), reqData, successFn, errorFn);
    }
    

    render() {
        console.log("state",this.state)
        let that = this;
        let columns = [ {
            title: "Role Name",
            dataIndex: 'name',
            key: 'name'
        },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.editObject(record)}>
                Edit</a>
                <Divider type="vertical"/>
                  <Popconfirm title="Are you sure delete this agent role" onConfirm={() => that.deleteObject(record)}
                              okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </span>
            ),
        }]
        return <Switch>
            <Route exact path={"/settings/agent-roles/add"}
                   render={(route) => <AddOrEditAgentRoles  {...route}
                                                            loadData={this.loadData}/>}/>
            <Route exact path={"/settings/agent-roles/:id/edit"}
                   render={(route) => 
                       <AddOrEditAgentRoles {...this.state} {...this.props} {...route} loadData={this.loadData}/>
                   }/>
            <Route>
                <Card
                    title={<h4>Agent Roles <Link to={"/settings/agent-roles/add"}><Button style={{float: 'right'}}
                                                                                            type={"primary"}><Icon
                        type={"plus"}/> Add</Button></Link></h4>}>
                    <Table rowKey={this.state.roles.id} dataSource={this.state.roles} pagination={false} loading={this.state.loading}
                                     columns={columns}/>
                </Card>
            </Route>
        </Switch>
    }
}
