import React from 'react';
import {Form, Input, InputNumber, Button, Row, Col} from 'antd';
import {postAPI, interpolate, getAPI, makeURL} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API, PRINT_PREVIEW_RENDER} from "../../../../constants/api";

const {TextArea} = Input;

class FooterSetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            sub_type: this.props.sub_type,
            print_setting: {}

        }
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let that = this;
        let data = {};
        this.props.form.validateFields((err, formData) => {
            if (!err) {
                let reqData = {
                    type: this.state.type,
                    sub_type: this.state.sub_type,
                    id: this.state.print_setting.id, ...formData
                }
                console.log("test", reqData);
                let successFn = function (data) {
                    if (data) {
                        console.log(data)
                    }
                };
                let errorFn = function () {
                };
                postAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.props.active_practiceId]), reqData, successFn, errorFn);
            }
        });
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            if (data.length)
                that.setState({
                    print_setting: data[0],
                })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.props.active_practiceId, that.state.type, that.state.sub_type]), successFn, errorFn);

    }

    render() {
        let that = this;
        const formItemLayout = {
            labelCol: {
                xs: {span: 8},
                sm: {span: 8},
                md: {span: 8},
                lg: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
                sm: {span: 16},
                md: {span: 16},
                lg: {span: 16},
            },
        };
        const {getFieldDecorator} = this.props.form;
        let PreviewParamsURL = '?preview=true&type=' + this.props.type + '&sub_type=' + this.props.sub_type;
        if (this.state.print_setting) {
            let keys = Object.keys(this.state.print_setting);
            keys.forEach(function (key) {
                if (that.state.print_setting[key])
                    PreviewParamsURL += '&' + key + '=' + that.state.print_setting[key]
            });
        }
        return (<Row gutter={16}>
                <Col span={12}>
                    <Form onSubmit={this.handleSubmit}>
                        <h2>Footer Setup</h2>
                        <Form.Item key={'footer_margin_top'} {...formItemLayout}
                                   label={(<span>Top Margin&nbsp;</span>)}>
                            {getFieldDecorator('footer_margin_top', {
                                initialValue: this.state.print_setting.footer_margin_top
                            })(
                                <InputNumber min={0} max={10}/>
                            )}
                        </Form.Item>
                        <Form.Item key={'footer_text'} {...formItemLayout}
                                   label={(<span>Full Width Content&nbsp;</span>)}>
                            {getFieldDecorator('footer_text', {
                                initialValue: this.state.print_setting.footer_text
                            })(
                                <TextArea rows={3}/>
                            )}
                        </Form.Item>

                        <Form.Item key={'footer_left_text'} {...formItemLayout}
                                   label={(<span>Left Signature&nbsp;</span>)}>
                            {getFieldDecorator('footer_left_text', {
                                initialValue: this.state.print_setting.footer_left_text
                            })(
                                <TextArea/>
                            )}
                        </Form.Item>

                        <Form.Item key={'footer_right_text'} {...formItemLayout}
                                   label={(<span>Right Signature&nbsp;</span>)}>
                            {getFieldDecorator('footer_right_text', {
                                initialValue: this.state.print_setting.footer_right_text
                            })(
                                <TextArea/>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>

                    </Form>
                </Col>
                <Col span={12} style={{textAlign: 'center'}}>
                    <iframe
                        src={makeURL(PRINT_PREVIEW_RENDER + PreviewParamsURL)} style={{width: '100%', height: '100%', boxShadow: '-2px 0px 4px #B8B8B8'}}/>
                </Col>

            </Row>

        );
    }
}

export default FooterSetting;
