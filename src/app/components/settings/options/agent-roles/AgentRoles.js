import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider, Popconfirm} from "antd";
import {
    CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD
} from "../../../../constants/dataKeys";
import {AGENT_ROLES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate, postAPI} from "../../../../utils/common";

class AgentRoles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            visible: false,
            data: null,
            loading:true
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
            that.setState({
                data: data,
                loading:false
            })
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        getAPI(interpolate(AGENT_ROLES, [this.props.active_practiceId]), successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    editFunction(value) {
        this.setState({
            editingId: value.id,
            editingName: value.name,
            visible: true,
            loading:false
        })
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    deleteObject(record) {
        let that = this;
        let reqData = record;
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        };
        postAPI(interpolate(AGENT_ROLES, [this.props.active_practiceId]), reqData, successFn, errorFn)
    }

    render() {
        let that = this;
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
              <a onClick={() => this.editFunction(record)}>  Edit</a>
                <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteObject(record)} okText="Yes" cancelText="No">
                      <a>Delete</a>
                  </Popconfirm>
              </span>
            ),
        }];
        const fields = [{
            label:"Role Name",
            key: "name",
            placeholder:"Agent roles",
            required: true,
            type: INPUT_FIELD
        },];
        const editfields = [{
            label:"Role Name",
            key: "name",
            required: true,
            initialValue: this.state.editingName,
            type: INPUT_FIELD
        }];
        const formProp = {
            successFn: function (data) {
                that.handleCancel();
                that.loadData();
                console.log("sucess");
                displayMessage(SUCCESS_MSG_TYPE, "success")

            },
            errorFn: function () {

            },
            action: interpolate(AGENT_ROLES, [this.props.active_practiceId]),
            method: "post",
        };
        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId}]
        const editFormDefaultValues = [{"key": "practice", "value": this.props.active_practiceId}, {
            "key": "id",
            "value": this.state.editingId
        }]

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Card title='Add Agent Roles'>
            <TestFormLayout defaultValues={defaultValues} formProp={formProp} fields={fields}/>
            <Divider/>
            <Table loading={this.state.loading} columns={columns} dataSource={this.state.data}/>
            <Modal
                title={"Edit Agent Roles"}
                visible={this.state.visible}
                footer={null}
                onCancel={this.handleCancel}>
                <TestFormLayout defaultValues={editFormDefaultValues} formProp={formProp} fields={editfields} />
                <Button key="back" onClick={this.handleCancel}>Return</Button>
            </Modal>
        </Card>
    }
}

export default AgentRoles;
