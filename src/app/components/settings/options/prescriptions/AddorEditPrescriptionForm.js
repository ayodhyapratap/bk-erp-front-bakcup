import React from "react";
import {Form, Input, Select, InputNumber, Button, Card} from "antd";
import {REQUIRED_FIELD_MESSAGE} from "../../../../constants/messages";
import {displayMessage, getAPI, interpolate, postAPI} from "../../../../utils/common";
import {DRUG_TYPE_API, DRUG_UNIT_API, INVENTORY_ITEM_API} from "../../../../constants/api";
import {
    DATE_PICKER,
    INPUT_FIELD, MULTI_IMAGE_UPLOAD_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD,
    SINGLE_IMAGE_UPLOAD_FIELD, SUCCESS_MSG_TYPE, TIME_PICKER,
} from "../../../../constants/dataKeys";
import moment from "moment/moment";
import {DRUG} from "../../../../constants/hardData";

class AddorEditPrescriptionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugTypeList: [],
            drugUnitList: [],
            editPrescreption: this.props.editCatalog ? this.props.editCatalog : null
        }
    }

    componentWillMount() {
        this.loadDrugType();
        this.loadDrugUnit();
    }

    loadDrugType() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugTypeList: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(DRUG_TYPE_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadDrugUnit() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugUnitList: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(DRUG_UNIT_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    setFormParams = (type, value) => {
        this.setState({
            [type]: value
        })
    }
    handleSubmit = (option) => {
        let that = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
            }
            let reqData = {
                ...values,
                practice: that.props.active_practiceId,
                maintain_inventory: option,
                item_type: DRUG
            }
            if (that.state.editPrescreption) {
                reqData.id = that.state.editPrescreption.id;
            }
            let successFn = function (data) {

                displayMessage(SUCCESS_MSG_TYPE, "success")
                that.props.loadData();
                let url = '/settings/prescriptions';
                that.props.history.push(url);
            }
            let errorFn = function () {

            }

            postAPI(INVENTORY_ITEM_API, reqData, successFn, errorFn)
        });
    }

    render() {
        const that = this;
        const formItemLayout = (this.props.formLayout ? this.props.formLayout : {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        });
        const {getFieldDecorator} = this.props.form;
        return <Card>
            <Form>
                <h2>{this.props.title}</h2>
                <Form.Item key={'name'} label={'Name'}  {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: that.state.editPrescreption ? that.state.editPrescreption.name : null,
                        rules: [{
                            required: true,
                            message: REQUIRED_FIELD_MESSAGE
                        }]
                    })(
                        <Input placeholder={'Drug Name'}/>
                    )}
                </Form.Item>
                {this.state.drugType && this.state.drugType == INPUT_FIELD ?
                    <Form.Item key={'drug_type_extra'} label={"Drug Type"}  {...formItemLayout}>
                        {getFieldDecorator("drug_type_extra", {
                            initialValue: that.state.editPrescreption ? that.state.editPrescreption.drug_type_extra : null,
                            rules: [{
                                required: true,
                                message: REQUIRED_FIELD_MESSAGE
                            }]
                        })(
                            <Input/>
                        )}
                        <a onClick={() => that.setFormParams('drugType', SELECT_FIELD)}>Choose Drug Type</a>
                    </Form.Item>
                    : <Form.Item key={"drug_type"} {...formItemLayout} label={"Drug Type"}>
                        {getFieldDecorator("drug_type", {
                            initialValue: this.state.editPrescreption ? this.state.editPrescreption.drug_type : null,
                            rules: [{
                                required: true,
                                message: REQUIRED_FIELD_MESSAGE
                            }]
                        })(
                            <Select>
                                {that.state.drugTypeList.map((option) => <Select.Option
                                    value={option.id}>{option.name}</Select.Option>)}
                            </Select>
                        )}
                        <a onClick={() => that.setFormParams('drugType', INPUT_FIELD)}>Add New Drug Type</a>
                    </Form.Item>}
                <Form.Item key={"strength"}{...formItemLayout}
                           label={"Dosage"}>
                    {getFieldDecorator("strength", {
                        initialValue: that.state.editPrescreption ? that.state.editPrescreption.strength : null,
                        rules: [{
                            required: true,
                            message: REQUIRED_FIELD_MESSAGE
                        }]
                    })(
                        <InputNumber min={0}/>
                    )}
                </Form.Item>
                {this.state.drugUnit && this.state.drugUnit == INPUT_FIELD ?
                    <Form.Item key={'unit_type_extra'} label={"Drug Unit"}  {...formItemLayout}>
                        {getFieldDecorator("unit_type_extra", {
                            initialValue: that.state.editPrescreption ? that.state.editPrescreption.unit_type_extra : null,
                            rules: [{
                                required: true,
                                message: REQUIRED_FIELD_MESSAGE
                            }]
                        })(
                            <Input/>
                        )}
                        <a onClick={() => that.setFormParams('drugUnit', SELECT_FIELD)}>Choose Drug Unit</a>
                    </Form.Item>
                    : <Form.Item key={"stength_unit"} {...formItemLayout} label={"Drug Unit"}>
                        {getFieldDecorator("stength_unit", {
                            initialValue: this.state.editPrescreption ? this.state.editPrescreption.stength_unit : null,
                            rules: [{
                                required: true,
                                message: REQUIRED_FIELD_MESSAGE
                            }]
                        })(
                            <Select>
                                {that.state.drugUnitList.map((option) => <Select.Option
                                    value={option.id}>{option.name}</Select.Option>)}
                            </Select>
                        )}
                        <a onClick={() => that.setFormParams('drugUnit', INPUT_FIELD)}>Add New Drug Type</a>
                    </Form.Item>}
                <Form.Item key={"instructions"} {...formItemLayout} label={"Instructions"}>
                    {getFieldDecorator("instructions", {
                        initialValue: that.state.editPrescreption ? that.state.editPrescreption.instructions : null
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} >
                    <Button onClick={() => this.handleSubmit(false)}>Save Drug</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button onClick={() => this.handleSubmit(false)} type={'primary'}>Save & Add to Inventory</Button>
                    &nbsp;&nbsp;&nbsp;
                    {that.props.history ?
                        <Button onClick={() => that.props.history.goBack()}>
                            Cancel
                        </Button> : null}
                </Form.Item>
            </Form>
        </Card>
    }
}

export default Form.create()(AddorEditPrescriptionForm);
