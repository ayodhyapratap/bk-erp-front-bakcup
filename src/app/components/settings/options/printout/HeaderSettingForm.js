import React from 'react';
import {Form, Input, Radio, Avatar, Button, Upload, Icon, message, Row, Col} from 'antd';
import {postAPI, interpolate, getAPI, makeURL} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API, FILE_UPLOAD_API, PRINT_PREVIEW_RENDER} from "../../../../constants/api";
import {HEADER_INCLUDE, LOGO_TYPE, LOGO_ALIGMENT, LOGO_INCLUDE} from "../../../../constants/hardData";

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

class HeaderSettingForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            sub_type: this.props.sub_type,
            user: UserList[0],
            color: colorList[0],
            print_setting: {}
        };

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    changeImage = () => {
        const index = UserList.indexOf(this.state.user);
        this.setState({
            user: index < UserList.length - 1 ? UserList[index + 1] : UserList[0],
            color: index < colorList.length - 1 ? colorList[index + 1] : colorList[0],
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let that = this;
        let data = {};
        this.props.form.validateFields((err, formData) => {
            if (!err) {
                let image = null;
                // if (formData['logo_path'].file.response)
                //     image = formData['logo_path'].file.response.image_path;

                let reqData = {
                    type: this.state.type,
                    sub_type: this.state.sub_type,
                    id: this.state.print_setting.id, ...formData,
                    logo_path: image
                }

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
            console.log("all retrive", JSON.stringify(that.state.print_setting));
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.props.active_practiceId, that.state.type, that.state.sub_type]), successFn, errorFn);
    }


    onChanged = (name, value) => {
        this.setState({
            [name]: value
        });

    }

    render() {
        let that = this;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        const {getFieldDecorator} = this.props.form;
        const singleUploadprops = {
            name: 'image',
            data: {
                name: 'hello',
                // logo_path:file.response.image_path,
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
        const headerInclude = HEADER_INCLUDE.map((header_include) => <Radio
            value={header_include.value}>{header_include.title}</Radio>)
        const logoType = LOGO_TYPE.map((logo_type) => <Radio value={logo_type.value}>{logo_type.value}</Radio>)
        const logoAlignment = LOGO_ALIGMENT.map((logo_alignment) => <Radio
            value={logo_alignment.value}>{logo_alignment.value}</Radio>)
        const logoInclude = LOGO_INCLUDE.map((logo_include) => <Radio
            value={logo_include.value}>{logo_include.title}</Radio>)
        let PreviewParamsURL = '?type=' + this.props.type + '&sub_type=' + this.props.sub_type;
        if (this.state.print_setting) {
            let keys = Object.keys(this.state.print_setting);
            keys.forEach(function (key) {
                if (that.state.print_setting[key])
                    PreviewParamsURL += '&' + key + '=' + that.state.print_setting[key]
            });
        }
        return (<Row gutter={16}>
                <Col span={12}>
                    <Form onSubmit={this.handleSubmit} key={this.state.print_setting.id}>
                        <h2>Customize Header</h2>

                        <Form.Item key={'header_include'} {...formItemLayout}
                                   label={(<span>Include Header&nbsp;</span>)}>
                            {getFieldDecorator('header_include', {initialValue: this.state.print_setting.header_include})
                            (
                                <Radio.Group onChange={(e) => this.onChanged('isHeaderNot', e.target.value)}>
                                    {headerInclude}
                                </Radio.Group>
                            )
                            }
                        </Form.Item>

                        <Form.Item key={'header_text'} {...formItemLayout} label={(<span>Header&nbsp;</span>)}>
                            {getFieldDecorator('header_text', {
                                initialValue: this.state.print_setting.header_text
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item key={'header_left_text'} {...formItemLayout} label={(<span>Left Text&nbsp;</span>)}>
                            {getFieldDecorator('header_left_text', {
                                initialValue: this.state.print_setting.header_left_text
                            })(
                                <Input/>
                            )}
                        </Form.Item>

                        <Form.Item key={'header_right_text'} {...formItemLayout}
                                   label={(<span>Right Text&nbsp;</span>)}>
                            {getFieldDecorator('header_right_text', {initialValue: this.state.print_setting.header_right_text})
                            (<Input/>)
                            }
                        </Form.Item>

                        <Form.Item key={'logo_include'} {...formItemLayout} label={(<span>Include Logo&nbsp;</span>)}>
                            {getFieldDecorator('logo_include', {initialValue: this.state.print_setting.logo_include})
                            (
                                <Radio.Group onChange={(e) => this.onChanged('islogoNot', e.target.value)}>
                                    {logoInclude}
                                </Radio.Group>
                            )
                            }
                        </Form.Item>

                        <Form.Item key={'logo_path'} {...formItemLayout} label={(<span>Logo&nbsp;</span>)}>
                            {getFieldDecorator('logo_path')
                            (<Upload {...singleUploadprops} >
                                <Button>
                                    <Icon type="upload"/> Click to Upload
                                </Button>
                            </Upload>)}
                            {/*<Avatar style={{backgroundColor: this.state.color}} size="large">*/}
                            {/*{this.state.user}*/}
                            {/*</Avatar>*/}

                        </Form.Item>

                        <Form.Item key={'logo_type'} {...formItemLayout} label={(<span>Type&nbsp;</span>)}>
                            {getFieldDecorator('logo_type', {initialValue: this.state.print_setting.logo_type})(
                                <Radio.Group onChange={(e) => this.onChanged('logo_type', e.target.value)}>
                                    {logoType}
                                </Radio.Group>
                            )}
                        </Form.Item>

                        <Form.Item key={'logo_alignment'} {...formItemLayout} label={(<span>Alignment&nbsp;</span>)}>
                            {getFieldDecorator('logo_alignment', {initialValue: this.state.print_setting.logo_alignment})
                            (
                                <Radio.Group onChange={(e) => this.onChanged('alignType', e.target.value)}>
                                    {logoAlignment}
                                </Radio.Group>
                            )
                            }
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

export default HeaderSettingForm;
