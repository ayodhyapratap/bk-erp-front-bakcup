import React from "react";
import {Button, Divider, Form, TimePicker, Icon, DatePicker, Input, InputNumber, Radio, Select, Checkbox} from "antd";
import {
    CHECKBOX_FIELD,
    TIME_PICKER,
    SINGLE_CHECKBOX_FIELD,
    COLOR_PICKER,
    TEXT_FIELD,
    INPUT_FIELD,
    DATE_PICKER,
    NUMBER_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    QUILL_TEXT_FIELD
} from "../../constants/dataKeys";
import {REQUIRED_FIELD_MESSAGE} from "../../constants/messages";
import {postAPI, putAPI} from "../../utils/common";
import moment from "moment";
import { SwatchesPicker } from 'react-color';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;
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
            fields: this.props.fields, //Fields data to create the form
            formData: {},
            formProp: this.props.formProp    //Form data to send on form submission
        }
        this.resetFormData = this.resetFormData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.colorChange = this.colorChange.bind(this);
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
                console.log(values);
                if(this.props.defaultValues){
                this.props.defaultValues.forEach(function (object){
                  values[object.key]= object.value;
                })
              }
              if(this.state.colorPickerKey){
                values[this.state.colorPickerKey]=this.state.colorPickerColor;
              }
                that.submitForm(values);
            }
        });
    }

    submitForm(data) {
        let that = this;
        let successFn = function (data) {
            that.state.formProp.successFn(data);
            if(that.props.changeRedirect!==null){
              that.props.changeRedirect();
            }
        };
        let errorFn = function () {
            that.state.formProp.errorFn();
        };
        if(this.props.formProp.method=="post"){
          postAPI(this.props.formProp.action, data, successFn, errorFn);
        }
        else if(this.props.formProp.method=="put"){
          putAPI(this.props.formProp.action, data, successFn, errorFn);
        }
    }

    colorChange(color,key){
    console.log(color,key);
    this.setState({
        colorPickerKey:key,
          colorPickerColor:color.hex,

      });


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
                            return <FormItem label={field.label}  {...formItemLayout}  extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <Input placeholder={field.placeholder} disabled={field.disabled} onChange={that.inputChange}/>
                                )}
                            </FormItem>;

                        case SELECT_FIELD:
                            return <FormItem {...formItemLayout} label={field.label} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <Select placeholder={field.placeholder} disabled={field.disabled} mode={field.mode?field.mode:"default"}>
                                        {field.options.map((option) => <Select.Option
                                            value={option.value}>{option.label}</Select.Option>)}
                                    </Select >
                                )}
                            </FormItem>;

                        case RADIO_FIELD:
                            return <FormItem label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <RadioGroup  disabled={field.disabled}>
                                        {field.options.map((option) => <Radio
                                            value={option.value}>{option.label}</Radio>)}
                                    </RadioGroup>
                                )}
                            </FormItem>;
                        case CHECKBOX_FIELD:
                            return <FormItem label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <CheckboxGroup options={field.options} disabled={field.disabled}/>
                                )}
                            </FormItem>;
                        case SINGLE_CHECKBOX_FIELD:
                            return <FormItem label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key,  { valuePropName: 'checked',
                                 initialValue:field.initialValue},
                                  {
                                    rules: [{ required:  field.required, message:REQUIRED_FIELD_MESSAGE  }],
                                  } )(
                                    <Checkbox  disabled={field.disabled}>{field.follow}</Checkbox>
                                )}
                            </FormItem>;
                        case NUMBER_FIELD:
                            return <FormItem
                                {...formItemLayout}
                                label={field.label} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <InputNumber min={1}  disabled={field.disabled}/>
                                )}
                                <span className="ant-form-text">{field.follow}</span>
                            </FormItem>;
                        case DATE_PICKER:
                            return <FormItem label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key,
                                    { initialValue:field.initialValue?moment(field.initialValue):null},
                                    {
                                      rules: [{ required:  field.required, message:REQUIRED_FIELD_MESSAGE  }],
                                    } )(
                                  <DatePicker  format={field.format}/>
                                )}
                            </FormItem>;
                        case TEXT_FIELD:
                        return <div> <Divider/><FormItem label={field.label}  {...formItemLayout} extra={field.extra}>
                            {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                <TextArea autosize={{ minRows: field.minRows, maxRows: field.maxRows }} placeholder={field.placeholder} disabled={field.disabled} onChange={that.inputChange}/>
                            )}
                            </FormItem>   </div>;

                        case QUILL_TEXT_FIELD:
                        return <div> <Divider/><FormItem label={field.label}  {...formItemLayout} extra={field.extra}>
                            {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                <ReactQuill theme="snow" placeholder={field.placeholder}/>                            )}
                            </FormItem>   </div>;
                        case TIME_PICKER:
                            return <FormItem label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key,
                                    { initialValue:field.initialValue?moment(field.initialValue ,field.format):null},
                                    {
                                      rules: [{ required:  field.required, message:REQUIRED_FIELD_MESSAGE  }],
                                    } )(
                                  <TimePicker  format={field.format}/>
                                )}
                            </FormItem>;
                        case COLOR_PICKER:
                            return <FormItem label={field.label}  {...formItemLayout}  extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                  <SwatchesPicker onChange={(color)=>that.colorChange(color, field.key) }/>
                                )}
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
