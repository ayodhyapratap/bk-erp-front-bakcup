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
            editingId: value.id,
            editingName: value.name,
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
              <a onClick={() => this.editFunction(record)}>  Edit</a>
                <Divider type="vertical"/>
              </span>
            ),
        }];
        const fields = [{
            label: this.props.name,
            key: "name",
            required: true,
            type: INPUT_FIELD
        },];
        const editfields = [

            {
                label: this.props.name,
                key: "name",
                required: true,
                initialValue:this.state.editingName,
                type: INPUT_FIELD
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
        const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}]
        const editFormDefaultValues = [{"key":"practice", "value":this.props.active_practiceId}, {"key":"id" , "value": this.state.editingId}]

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout defaultValues={defaultValues} formProp={formProp} fields={fields}/>
            <Divider/>
            <Table columns={columns} dataSource={this.state.data}/>
            <Modal
                title="Basic Modal"
                visible={this.state.visible}
                footer={null}
            >
                <TestFormLayout defaultValues={editFormDefaultValues} formProp={formProp} fields={editfields}/>
                <Button key="back" onClick={this.handleCancel}>Return</Button>,

            </Modal>
        </div>
    }
}

export default TableData;
