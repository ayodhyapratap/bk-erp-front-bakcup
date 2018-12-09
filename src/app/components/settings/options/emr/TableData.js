import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {TAXES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../../utils/common";

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            visible: false,
            data: null,
        }
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                data: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(this.props.id, [this.props.active_practiceId]), successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    editFunction(value) {
        this.setState({
            editingId: value,
            visible: true,
        })
    }

    handleCancel = () => {
        this.setState({visible: false});
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
              <a onClick={() => this.editFunction(record.id)}>  Edit</a>
                <Divider type="vertical"/>
              </span>
            ),
        }];
        const fields = [{
            label: this.props.name,
            key: "name",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Practice Number ",
            key: "practice",
            required: true,
            initialValue: this.props.active_practiceId,
            type: NUMBER_FIELD
        },];
        const editfields = [
            {
                label: "id",
                key: "id",
                required: true,
                initialValue: this.state.editingId,
                type: NUMBER_FIELD
            },
            {
                label: this.props.name,
                key: "name",
                required: true,
                type: INPUT_FIELD
            }, {
                label: "Practice Number ",
                key: "practice",
                required: true,
                initialValue: this.props.active_practiceId,
                type: NUMBER_FIELD
            },];
        const formProp = {
            successFn: function (data) {
                that.handleCancel();
                that.loadData();
                console.log(data);
                console.log("sucess");
            },
            errorFn: function () {

            },
            action: interpolate(this.props.id, [this.props.active_practiceId]),
            method: "post",
        };
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout formProp={formProp} fields={fields}/>
            <Divider/>
            <Table columns={columns} dataSource={this.state.data}/>
            <Modal
                title="Basic Modal"
                visible={this.state.visible}
                footer={null}
            >
                <TestFormLayout formProp={formProp} fields={editfields}/>
                <Button key="back" onClick={this.handleCancel}>Return</Button>,

            </Modal>
        </div>
    }
}

export default TableData;
