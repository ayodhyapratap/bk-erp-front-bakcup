import {
    Form, Icon, Input, Button, Checkbox, Card, Table, InputNumber
} from 'antd';
import React from "react";
import {ROLE_COMMISION, STAFF_ROLES, PRODUCT_LEVEL, GENERATE_MLM_COMMISSON} from "../../../../constants/api"
import {displayMessage, getAPI, postAPI, putAPI} from "../../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";

class MLMGenerate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            level_count: 3
        }
    }

    componentDidMount() {
        this.loadMlmData();
        this.loadRoles();
        // this.loadProductlevels();
    }

    loadMlmData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                mlmItems: data
            })
        }
        let errorFn = function () {

        }
        getAPI(ROLE_COMMISION, successFn, errorFn);
    }

    loadRoles() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                staffRoles: data
            })
        }
        let errorFn = function () {

        }
        getAPI(STAFF_ROLES, successFn, errorFn);
    }

    // loadProductlevels() {
    //     let that = this;
    //     let successFn = function (data) {
    //         that.setState({
    //             productLevels: data
    //         });
    //         data.forEach(function (item) {
    //             that.add(item.name);
    //         })
    //     }
    //     let errorFn = function () {
    //
    //     }
    //     getAPI(PRODUCT_LEVEL, successFn, errorFn);
    // }


    handleSubmit = (e) => {
        e.preventDefault();
        let that = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            let reqData = {};
            // that.state.productLevels.forEach(function (level) {
            //     reqData[level.name] = {...values[level.name]}
            // });
            reqData[values.margin_name] = [];
            for (let i = 1; i <= that.state.level_count; i++) {
                reqData[values.margin_name].push({level: i, commission_list: {...values[i]}})
            }
            if (!err) {
                console.log(reqData);
                that.setState({changePassLoading: true});
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, data.message);
                    that.props.loadMlmData();
                    that.props.history.push('/mlm');
                };
                let errorFn = function () {
                };
                postAPI(GENERATE_MLM_COMMISSON, reqData, successFn, errorFn);
            }
        });
    };


    add = (level_name) => {
        const {form} = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(level_name);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    setLevelCount = (e) => {
        let that = this;
        that.setState({
            level_count: e
        })
    }

    render() {
        let that = this
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        getFieldDecorator('keys', {initialValue: []});
        let columns = [{
            title: 'Roles',
            dataIndex: 'name',
            key: 'name'
        }];
        if (this.state.level_count)
            for (let i = 1; i <= this.state.level_count; i++) {
                columns.push({
                    title: 'Level ' + i,
                    dataIndex: 'Level ' + i,
                    key: 'Level ' + i,
                    render: (item, record) => <Form.Item
                        {...formItemLayout}
                        // label={k}
                        required={true}
                        key={`${i}[${record.id}]`}
                    >
                        {getFieldDecorator(`${i}[${record.id}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                        })(
                            <InputNumber min={0} max={100} placeholder="Percent Commisson"/>
                        )}
                    </Form.Item>
                })
            }

        return (
            <Card>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item
                        {...formItemLayout}
                        label={"Margin Name"}
                        required={true}
                        key={`margin_name`}>
                        {getFieldDecorator(`margin_name`, {
                            validateTrigger: ['onChange', 'onBlur'],
                        })(
                            <Input placeholder="Margin Type Name"/>
                        )}
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*{...formItemLayout}*/}
                    {/*label={'No of Levels'}*/}
                    {/*required={false}*/}
                    {/*key={`level_count`}*/}

                    {/*>*/}
                    {/*{getFieldDecorator(`level_count`, {*/}
                    {/*validateTrigger: ['onChange', 'onBlur'],*/}
                    {/*})(*/}
                    {/*<InputNumber min={1} max={5} placeholder="Level Count" onChange={this.setLevelCount}/>*/}
                    {/*)}*/}
                    {/*</Form.Item>*/}
                    <Table bordered={true} pagination={false} columns={columns} dataSource={this.state.staffRoles}/>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Set MLM Commissons
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(MLMGenerate);
