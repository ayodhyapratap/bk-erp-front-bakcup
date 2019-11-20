import React from "react";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider, Popconfirm, Tag, Select, Col} from "antd";
import {
    SUCCESS_MSG_TYPE,
    INPUT_FIELD, WARNING_MSG_TYPE,
} from "../../../../constants/dataKeys";
import {AGENT_ROLES, ALL_PRACTICE, PATIENT_PROFILE, PATIENTS_LIST} from "../../../../constants/api"
import {Link, Route, Switch} from "react-router-dom";
import {getAPI, displayMessage, interpolate, postAPI, putAPI, makeFileURL} from "../../../../utils/common";
import AddOrEditAgent from "./AddOrEditAgent";
import CustomizedTable from "../../../common/CustomizedTable";
import InfiniteFeedLoaderButton from "../../../common/InfiniteFeedLoaderButton";

// import Col from "antd/es/grid/col";

class AgentRoles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            visible: false,
            data: null,
            loading: true,
            agentRoles: [],
            practiceList: []

        };
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
        this.loadAgentRoles = this.loadAgentRoles.bind(this);
    }

    componentDidMount() {
        this.loadData();
        this.loadAgentRoles();
    }

    loadAgentRoles() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                agentRoles: data,
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(AGENT_ROLES, successFn, errorFn);

    }

    loadData(page = 1) {
        var that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                data: data.results,
                total: data.count,
                nextPage: data.next,
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams = {
            agent: true,
            page
        }
        if (that.state.role)
            apiParams.role = that.state.role;
        if (that.state.approved != null) {
            apiParams.approved = !!that.state.approved;
        }
        apiParams.practice = this.props.active_practiceId;

        getAPI(PATIENTS_LIST, successFn, errorFn, apiParams);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    editObject(record) {
        this.setState({
            editAgentData: record,
            loading: false
        });

        this.props.history.push('/settings/agents/' + record.id + '/edit')

    }

    deleteObject(record) {
        let that = this;
        let reqData = {'id': record.id, is_agent: false}
        let successFn = function (data) {
            that.setState({
                loading: false,
            })
            that.loadData();
        }
        let errorFn = function () {
        };
        putAPI(interpolate(PATIENT_PROFILE, [record.id]), reqData, successFn, errorFn)
    }

    approveAgent = (record) => {
        let that = this;

        let reqData = {'id': record.id, is_approved: true};
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "Agent Approved Successfully!")
            that.setState(function (prevState) {
                let agentList = [];
                prevState.data.forEach(function (agent) {
                    if (agent.id == record.id) {
                        agent.is_approved = true
                    }
                    agentList.push(agent);
                });
                return {
                    data: agentList,
                    approvalLoading: false
                }
            })
        }
        let errorFn = function () {
            that.setState({
                approvalLoading: false
            })
        };
        if (record.role) {
            that.setState({
                approvalLoading: true
            })
            putAPI(interpolate(PATIENT_PROFILE, [record.id]), reqData, successFn, errorFn)
        } else {
            displayMessage(WARNING_MSG_TYPE, "Kindly assign the role before approving!")
        }
    }
    // handleChange=(key,value)=>{
    //     console.log("type",key,value)
    //     this.props.form.setFieldsValue({
    //         [key]: value,
    //     });
    // }
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                that.setState({
                    role: values.role,
                    approved: values.approved,
                }, function () {
                    that.loadData();
                })
            }
        })
    }

    render() {
        let that = this;
        let i = 1;
        const {getFieldDecorator} = this.props.form;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex: 'sno',
            render: (item, record) => <span> {i++}</span>,
            export: (item, record, index) => index + 1,
        },{
            title: 'Name',
            dataIndex: 'user.first_name',
            key: 'name',
            render: (value, record) => <Link to={"/patient/" + record.id + "/profile"}>{value}</Link>,
            export:(item,record)=>(record.user.first_name),
        }, {
            title: 'Email',
            dataIndex: 'user.email',
            key: 'email',
            export:(item,record)=>(record.user.email),
        }, {
            title: 'Mobile',
            dataIndex: 'user.mobile',
            key: 'mobile',
            export:(item,record)=>(record.user.mobile),
        }, {
            title: 'Referrer',
            dataIndex: 'user.referer_data.referer.first_name',
            key: 'referrer',
            render: (value, record) => (value && record.user.referer_data.patient ?
                <Link to={"/patient/" + record.user.referer_data.patient + "/profile"}>{value}</Link> : '--'),
            export:(item,record)=>(record.user.referer?record.user.referer_data.referer.first_name:'--'),
        }, {
            title: 'Role',
            dataIndex: 'role_data.name',
            key: 'role_data',
            export:(item,record)=>(record.role_data.name),
        }, {
            title: 'Aadhar',
            dataIndex: 'aadhar_id',
            key: 'aadhar_id',
            export:(value)=>(value),
        }, {
            title: 'Document',
            dataIndex: 'aadhar_upload',
            key: 'aadhar_upload',
            hideExport:true,
            render: (value) => (value ? <a target="_blank" href={makeFileURL(value)}>Open Document</a> : '--')
        }, {
            title: 'Status',
            dataIndex: 'is_approved',
            key: 'is_approved',
            render: (value, record) => (
                value ? <Tag color="#87d068">Approved</Tag> : <Popconfirm
                    title="Are you sure approve this Advisor?"
                    onConfirm={() => that.approveAgent(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <a href="#" disabled={that.state.approvalLoading}>Approve</a>
                </Popconfirm>
            )
        }, {
            title: 'Action',
            key: 'action',
            hideExport:true,
            render: (text, record) => (
                <span>
              <a onClick={() => this.editObject(record)}>  Edit</a>
                <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteObject(record)} okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </span>
            ),
        }];
        const status = [
            {label: 'Approved', value: true},
            {label: 'Pending', value: false},
            {label: 'All', value: null}
        ];
        return <Switch>
            <Route exact path={"/settings/agents/add"}
                   render={(route) => <AddOrEditAgent  {...this.props} title={"Create Advisor"}
                                                       loadData={this.loadData}/>}/>

            <Route exact path={"/settings/agents/:id/edit"}
                   render={(route) => <AddOrEditAgent  {...this.props} {...this.state} title={"Edit Advisor"}
                                                       loadData={this.loadData}/>}/>
            <Route>
                <Card title={<h4>Advisor <Link to={"/settings/agents/add"}>
                    <Button style={{float: 'right'}} type={"primary"}><Icon type={"plus"}/>
                        Add</Button></Link></h4>}>
                    <Row>
                        <Col style={{float: "right"}}>
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <Form.Item key="role" label="Advisor Role">
                                    {getFieldDecorator("role", {initialValue: this.state.agentRoles ? this.state.agentRoles.id : ''},
                                    )(
                                        <Select placeholder="Advisor Role" style={{minWidth: 150}} allowClear={true}>
                                            {this.state.agentRoles.map((option) => <Select.Option
                                                value={option.id}>{option.name}</Select.Option>)}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item key="approved" label="Status">
                                    {getFieldDecorator("approved", {initialValue: this.state.approved ? this.state.approved : ''},
                                    )(
                                        <Select placeholder="status" style={{minWidth: 150}}>
                                            {status.map(item => <Select.Option
                                                value={item.value}>
                                                {item.label}
                                            </Select.Option>)}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{margin: 5}}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>

                    <CustomizedTable loading={this.state.loading} columns={columns} dataSource={this.state.data}
                                     pagination={false}/>
                    <InfiniteFeedLoaderButton loading={this.state.loading}
                                              loaderFunction={() => that.loadData(that.state.nextPage)}
                                              hidden={!this.state.nextPage}/>
                </Card>
            </Route>

        </Switch>


    }
}

export default Form.create()(AgentRoles);
