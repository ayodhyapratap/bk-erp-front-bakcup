import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider, Popconfirm} from "antd";
import {
    SUCCESS_MSG_TYPE,
    CHECKBOX_FIELD,
    INPUT_FIELD,
    RADIO_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD
} from "../../../../constants/dataKeys";
import {EXPENSE_TYPE, ROOM_TYPE} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate, postAPI} from "../../../../utils/common";
import CustomizedTable from "../../../common/CustomizedTable";

class RoomTypes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            visible: false,
            rooms: null,
            loading: true,
            showDeleted: false,
            deletedLoading: false,
            deletedRooms: []
        };
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    loadData(deleted = false) {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            if (deleted) {
                that.setState({
                    deletedRooms: data,
                    deletedLoading: false
                })
            } else {
                that.setState({
                    rooms: data,
                    loading: false
                })
            }
        };
        let errorFn = function () {
            if (deleted) {
                that.setState({
                    deletedLoading: false
                })
            } else {
                that.setState({
                    loading: false
                })
            }
        };
        if (deleted) {
            getAPI(ROOM_TYPE, successFn, errorFn, {deleted: true,practice:this.props.active_practiceId});
        } else {
            getAPI(ROOM_TYPE, successFn, errorFn,{practice:this.props.active_practiceId});
        }
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    editTax(value) {
        this.setState({
            editingId: value.id,
            editingName: value.name,
            editingValue: value.tax_value,
            loading: false,
            visible: true,
        })
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    deleteObject(record,type) {
        let that = this;
        let reqData = record;
        reqData.is_active = type;
        let successFn = function (data) {
            that.loadData();
            if (that.state.showDeleted) {
                that.loadData(true);
            }
        }
        let errorFn = function () {
        };
        postAPI(ROOM_TYPE, reqData, successFn, errorFn)
    }

    showDeletedExpenses = () => {
        this.setState({
            showDeleted: true,
            deletedLoading: true
        });
        this.loadData(true)
    }

    render() {
        let that = this;
        const columns = [{
            title: 'Room Type',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                record.is_active?<span>

              <a onClick={() => this.editTax(record)}>  Edit</a>
                <Divider type="vertical"/>
                <Popconfirm title="Are you sure to delete this?"
                            onConfirm={() => that.deleteObject(record,false)} okText="Yes" cancelText="No">
                  <a>Delete</a>
              </Popconfirm>
              </span> : <span>
                    <Popconfirm title="Are you sure show this?"
                                onConfirm={() => that.deleteObject(record,true)} okText="Yes" cancelText="No">
                  <a>Show</a>
              </Popconfirm>
                </span>
            ),
        }];
        const fields = [{
            label: "Room Type",
            key: "name",
            required: true,
            type: INPUT_FIELD
        },];
        const editfields = [{
            label: "Expense name",
            key: "name",
            required: true,
            initialValue: this.state.editingName,
            type: INPUT_FIELD
        },];
        const formProp = {
            successFn: function (data) {
                that.handleCancel();
                that.loadData();
                console.log(data);
                console.log("sucess");
                displayMessage(SUCCESS_MSG_TYPE, "success")
            },
            errorFn: function () {

            },
            action: interpolate(EXPENSE_TYPE, [this.props.active_practiceId]),
            method: "post",
        }
        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId}];
        const editFormDefaultValues = [{"key": "practice", "value": this.props.active_practiceId}, {
            "key": "id",
            "value": this.state.editingId
        }];
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <h2>Room Types</h2>
            <Card>
                <TestFormLayout defaultValues={defaultValues} formProp={formProp} fields={fields}/>
                <Divider/>
                <CustomizedTable loading={this.state.loading} columns={columns} dataSource={this.state.expenses}/>
                {/*{this.state.showDeleted ?*/}
                    {/*<div>*/}
                        {/*<CustomizedTable loading={this.state.deletedLoading} columns={columns}*/}
                                         {/*dataSource={this.state.deletedExpenses}/>*/}
                    {/*</div> :*/}
                    {/*<h4><a onClick={() => this.showDeletedExpenses()}>Show Deleted Expenses</a></h4>}*/}
            </Card>
            <Modal
                title="Basic Modal"
                visible={this.state.visible}
                footer={null}
            >

                <TestFormLayout title="edit Expence" defaultValues={editFormDefaultValues} formProp={formProp}
                                fields={editfields}/>
                <Button key="back" onClick={this.handleCancel}>Return</Button>,

            </Modal>
        </div>
    }
}

export default RoomTypes;
