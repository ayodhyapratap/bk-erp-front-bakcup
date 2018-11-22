import React from "react";
import {Button, Form, Icon, Input, InputNumber, Radio, Select, Checkbox} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, NUMBER_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../constants/dataKeys";
import {REQUIRED_FIELD_MESSAGE} from "../../constants/messages";
import {postAPI} from "../../utils/common";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
var fieldDecorators = function (field, formData) {
    return {
        initialValue: formData[field.key],
        rules: [{
            required: field.required,
            message: REQUIRED_FIELD_MESSAGE
        }]
    }
}

class DynamicFieldsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: this.props.fields,     //Fields data to create the form
            formData: {}        //Form data to send on form submission
        }
        this.resetFormData = this.resetFormData.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        this.resetFormData();
    }

    initialiseFormData() {

    }

    resetFormData() {
        let formData = {};
        this.state.fields.forEach(function (field) {
            formData[field.key] = field.initialValue
        });
        this.setState({
            formData: formData
        })
    }

    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                that.submitForm(values);
            }
        });
    }

    submitForm(data) {
        let successFn = function(){

        };
        let errorFn = function(){

        };
      //  postAPI(,data,successFn,errorFn);
    }

    render() {
        const that = this;
        const formItemLayout = (this.props.formLayout ? this.props.formLayout : {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        });
        const {getFieldDecorator} = this.props.form;
        return <div>
            <Form onSubmit={this.handleSubmit}>
                {this.props.title ? <h2>{this.props.title}</h2> : null}
                {this.state.fields ? this.state.fields.map(function (field) {
                    switch (field.type) {
                        case INPUT_FIELD:
                            return <FormItem label={field.label}  {...formItemLayout}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <Input placeholder={field.placeholder} onChange={that.inputChange}/>
                                )}
                            </FormItem>;

                        case SELECT_FIELD:
                            return <FormItem {...formItemLayout} label={field.label}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <Select placeholder={field.placeholder}>
                                        {field.options.map((option) => <Select.Option
                                            value={option.value}>{option.label}</Select.Option>)}
                                    </Select>
                                )}
                            </FormItem>;

                        case RADIO_FIELD:
                            return <FormItem label={field.label} {...formItemLayout}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <RadioGroup>
                                        {field.options.map((option) => <Radio
                                            value={option.value}>{option.label}</Radio>)}
                                    </RadioGroup>
                                )}
                            </FormItem>;
                        case CHECKBOX_FIELD:
                            return <FormItem label={field.label} {...formItemLayout}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <CheckboxGroup options={field.options}/>
                                )}
                            </FormItem>;
                        case NUMBER_FIELD:
                            return <FormItem
                                {...formItemLayout}
                                label={field.label}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <InputNumber min={1} max={10}/>
                                )}
                                <span className="ant-form-text">{field.label}</span>
                            </FormItem>;
                        default:
                            return null;
                    }
                }) : null}
                <FormItem {...formItemLayout}>
                    {/*<Button onClick={this.resetFormData}>Reset</Button>*/}
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </Form>
        </div>
    }
}

export default DynamicFieldsForm;
