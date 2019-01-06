import React from "react";
import {
    Button,
    Divider,
    Form,
    TimePicker,
    Icon,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    Select,
    Checkbox,
    Upload,
    message
} from "antd";
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
    QUILL_TEXT_FIELD, WARNING_MSG_TYPE, SINGLE_IMAGE_UPLOAD_FIELD
} from "../../constants/dataKeys";
import {REQUIRED_FIELD_MESSAGE} from "../../constants/messages";
import {displayMessage, makeURL, postAPI, putAPI} from "../../utils/common";
import moment from "moment";
import {SwatchesPicker} from 'react-color';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {FILE_UPLOAD_API} from "../../constants/api";

const {TextArea} = Input;
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
            formProp: this.props.formProp,    //Form data to send on form submission
            disabled: false,
            loading: false,
        }

        this.resetFormData = this.resetFormData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.colorChange = this.colorChange.bind(this);
    }

    componentDidMount() {
        this.resetFormData();
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
                if (this.props.defaultValues) {
                    this.props.defaultValues.forEach(function (object) {
                        values[object.key] = object.value;
                        console.log(object);
                    })
                }
                if (this.state.colorPickerKey) {
                    values[this.state.colorPickerKey] = this.state.colorPickerColor;
                }
                that.props.fields.forEach(function (formFields) {
                    if (formFields.type == SINGLE_IMAGE_UPLOAD_FIELD) {
                        let key = formFields.key;
                        console.log(values[key]);
                        if (values[key] && values[key].file && values[key].file.response)
                            values[key] = values[key].file.response.image
                        else
                            values[key] = formFields.initialValue;
                    } else if (formFields.type == TIME_PICKER) {
                        let key = formFields.key;
                        if (formFields.format) {
                            values[key] = moment(values[key]).format(formFields.format);
                        }
                    }
                });
                console.log("Fields in the form", values);
                that.submitForm(values);
            }
        });
    }

    submitForm(data) {
        let that = this;
        this.setState({
          disabled:true,
          loading:true,
        });
        let successFn = function (data) {
            that.state.formProp.successFn(data);
            that.setState({
              disabled:false,
              loading:false,
            });
            if (that.props.changeRedirect) {
                that.props.changeRedirect();
            }
        };
        let errorFn = function () {
            that.state.formProp.errorFn();
            that.setState({
              disabled:false,
              loading:false,
            });
        };
        if (this.props.formProp.method == "post") {
            postAPI(this.props.formProp.action, data, successFn, errorFn);
        }
        else if (this.props.formProp.method == "put") {
            putAPI(this.props.formProp.action, data, successFn, errorFn);
        }
    }

    colorChange(color, key) {
        console.log(color, key);
        this.setState({
            colorPickerKey: key,
            colorPickerColor: color.hex,
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
                            return <FormItem key={field.key} label={field.label}  {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <Input placeholder={field.placeholder} disabled={field.disabled?field.disabled:that.state.disabled}
                                           onChange={that.inputChange}/>
                                )}
                            </FormItem>;
                        case SELECT_FIELD:
                            return <FormItem key={field.key} {...formItemLayout} label={field.label} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <Select placeholder={field.placeholder} disabled={field.disabled?field.disabled:that.state.disabled}
                                            mode={field.mode ? field.mode : "default"}>
                                        {field.options.map((option) => <Select.Option
                                            value={option.value}>{option.label}</Select.Option>)}
                                    </Select>
                                )}
                            </FormItem>;
                        case RADIO_FIELD:
                            return <FormItem key={field.key} label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <RadioGroup disabled={field.disabled?field.disabled:that.state.disabled}>
                                        {field.options.map((option) => <Radio
                                            value={option.value}>{option.label}</Radio>)}
                                    </RadioGroup>
                                )}
                            </FormItem>;
                        case CHECKBOX_FIELD:
                            return <FormItem key={field.key} label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <CheckboxGroup options={field.options} disabled={field.disabled?field.disabled:that.state.disabled}/>
                                )}
                            </FormItem>;
                        case SINGLE_CHECKBOX_FIELD:
                            return <FormItem key={field.key} label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, {
                                        valuePropName: 'checked',
                                        initialValue: field.initialValue
                                    },
                                    {
                                        rules: [{required: field.required, message: REQUIRED_FIELD_MESSAGE}],
                                    })(
                                    <Checkbox disabled={field.disabled?field.disabled:that.state.disabled}>{field.follow}</Checkbox>
                                )}
                            </FormItem>;
                        case NUMBER_FIELD:
                            return <FormItem key={field.key}
                                {...formItemLayout}
                                label={field.label} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <InputNumber min={field.min} max={field.max} disabled={field.disabled?field.disabled:that.state.disabled}/>
                                )}
                                <span className="ant-form-text">{field.follow}</span>
                            </FormItem>;
                        case DATE_PICKER:
                            return <FormItem key={field.key} label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key,
                                    {initialValue: field.initialValue ? moment(field.initialValue) : null},
                                    {
                                        rules: [{required: field.required, message: REQUIRED_FIELD_MESSAGE}],
                                    })(
                                    <DatePicker format={field.format}/>
                                )}
                            </FormItem>;
                        case TEXT_FIELD:
                            return <div>
                                <FormItem key={field.key} label={field.label}  {...formItemLayout} extra={field.extra}>
                                    {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                        <TextArea autosize={{minRows: field.minRows, maxRows: field.maxRows}}
                                                  placeholder={field.placeholder} disabled={field.disabled?field.disabled:that.state.disabled}
                                                  onChange={that.inputChange}/>
                                    )}
                                </FormItem>
                            </div>;
                        case QUILL_TEXT_FIELD:
                            return <div>
                                <Divider/>
                                <FormItem key={field.key} label={field.label}  {...formItemLayout} extra={field.extra}>
                                    {getFieldDecorator(field.key, {
                                        initialValue: (field.initialValue && field.initialValue.length ? field.initialValue : ''),
                                        rules: [{
                                            required: field.required,
                                            message: REQUIRED_FIELD_MESSAGE
                                        }]
                                    })(
                                        <ReactQuill theme="snow" placeholder={field.placeholder}/>)}
                                </FormItem>
                            </div>;
                        case TIME_PICKER:
                            return <FormItem key={field.key} label={field.label} {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, {
                                    initialValue: field.initialValue ? moment(field.initialValue, field.format) : null,
                                    rules: [{required: field.required, message: REQUIRED_FIELD_MESSAGE}],
                                })(
                                    <TimePicker format={field.format}/>
                                )}
                            </FormItem>;
                        case COLOR_PICKER:
                            return <FormItem key={field.key} label={field.label}  {...formItemLayout} extra={field.extra}>
                                {getFieldDecorator(field.key, fieldDecorators(field, that.state.formData))(
                                    <div>
                                        <SwatchesPicker style={{width: '100%'}}
                                                        onChange={(color) => that.colorChange(color, field.key)}/>
                                        {that.state.colorPickerKey ? <div style={{
                                            margin: '10px',
                                            backgroundColor: that.state.colorPickerColor,
                                            height: '40px',
                                            width: '40px'
                                        }}/> : null}
                                    </div>
                                )}
                            </FormItem>;
                        case SINGLE_IMAGE_UPLOAD_FIELD:
                            const props = {
                                name: 'image',
                                data: {
                                    name: 'hello'
                                },
                                action: makeURL(FILE_UPLOAD_API),
                                headers: {
                                    authorization: 'authorization-text',
                                },
                                onChange(info) {
                                    if (info.file.status !== 'uploading') {
                                        console.log(info.file, info.fileList);
                                    }
                                    if (info.file.status === 'done') {
                                        message.success(`${info.file.name} file uploaded successfully`);
                                    } else if (info.file.status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }
                                },
                            };
                            return <Form.Item key={field.key} {...formItemLayout} label={field.label}>
                                {getFieldDecorator(field.key, {valuePropName: field.key,})(
                                    <Upload {...props}>
                                        <Button>
                                            <Icon type="upload"/> Select File
                                        </Button>
                                        {field.initialValue ?
                                            <img src={field.initialValue} style={{maxWidth: '100%'}}/> : null}
                                    </Upload>
                                )}
                            </Form.Item>;
                        default:
                            return null;
                    }
                }) : null}
                <FormItem {...formItemLayout}>
                    {/*<Button onClick={this.resetFormData}>Reset</Button>*/}
                    <Button loading={that.state.loading} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </Form>
        </div>
    }
}

export default DynamicFieldsForm;
