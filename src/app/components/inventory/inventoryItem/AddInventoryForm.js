import {Button, Col, Form, Icon, Input, Row} from "antd";
import React from "react";

let id = 0;
export default class AddInventoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dynamicFormItems: []
        }
    }

    hundleSubmit = (e) => {

    }
    add = () => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const that = this;
        const formItemLayout = (this.props.formLayout ? this.props.formLayout : {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        });
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 24, offset: 0},
            },
        }
        getFieldDecorator('keys', {initialValue: []});
        const keys = getFieldValue('keys');
        return <div>
            <Form onSubmit={this.handleSubmit}>
                {keys.map((k, index) => <Row>
                    <Col>
                        <Form.Item
                            {...formItemLayoutWithOutLabel}
                            required={false}
                            key={k}>
                            {getFieldDecorator(`names[${k}]`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "Please input passenger's name or delete this field.",
                                }],
                            })(
                                <Input placeholder="passenger name"/>
                            )}
                        </Form.Item>
                    </Col>
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </Row>)}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                        <Icon type="plus"/> Add field
                    </Button>
                </Form.Item>
                <Form.Item {...formItemLayout}>
                    {/*<Button onClick={this.resetFormData}>Reset</Button>*/}
                    <Button loading={that.state.loading} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    }
}
