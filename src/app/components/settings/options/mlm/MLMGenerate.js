import {
    Form, Input, Button, Card, Table, InputNumber
} from 'antd';
import React from "react";
import {
    AGENT_ROLES,
    GENERATE_MLM_COMMISSON,
    SINGLE_PRODUCT_MARGIN
} from "../../../../constants/api"
import {displayMessage, getAPI, interpolate, postAPI} from "../../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import { Redirect } from 'react-router-dom';

class MLMGenerate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            level_count: 3,
            margin: null,
            editRecord: (this.props.editRecord ? this.props.editRecord : null),
            editId: (this.props.editId ? this.props.editId : null),
            loading:true,
            editRecordMargins:{}
        }
        this.changeRedirect= this.changeRedirect.bind(this);
    }

    componentDidMount() {
        this.loadRoles();
        if (this.state.editRecord && this.state.editId) {
            let editRecordMargins = {}
            this.state.editRecord.forEach(function(record){
                editRecordMargins[record.roleId] = record;
            });
            this.setState({
                editRecordMargins
            })
            this.loadMlmData();

        }
        // this.loadProductlevels();
    }

    loadMlmData() {
        let that = this;
        let successFn = function (data) {
            data.map(function (item) {
                that.setState({
                    margin: item,
                    loading:false
                },function () {
                    that.setLevelCount(item.level_count)
                })
            })

        }
        let errorFn = function () {
            that.setState({
                loading:true
            })

        }
        getAPI(interpolate(GENERATE_MLM_COMMISSON, [this.state.editId]), successFn, errorFn);
    }

    loadRoles() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                staffRoles: data,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        
        getAPI(AGENT_ROLES, successFn, errorFn);
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
            reqData={
                comissions:[],
                name:values.margin_name,
                level_count:values.level_count,
            };
            for (let i = 1; i <= that.state.level_count; i++) {
                this.state.staffRoles.forEach(function(role){
                    reqData.comissions.push({
                        level:i,
                        role:role.id,
                        commision_percent:values[i][role.id]
                    })
                });
            }

            if(that.state.editId) {
                reqData.id = that.state.editId;
                if (that.state.margin.comissions) {
                    that.state.margin.comissions.forEach(function (role,key) {
                        for (let i = 1; i <= that.state.level_count; i++) {

                            if (role.level ==i){
                                reqData.comissions.push({
                                    id:role.id,
                                    ...role,
                                    commision_percent:values[i][role.role]
                                })
                            }
                        }
                        reqData.comissions.shift();
                    });

                }
            }

            if (!err) {
                that.setState({changePassLoading: true, redirect:true});
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, data.message);
                    that.props.loadData();
                    that.props.history.goBack();
                };
                let errorFn = function () {
                };
                postAPI(GENERATE_MLM_COMMISSON, reqData, successFn, errorFn);
            }
        });
    };

    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
    }


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
            level_count: e < 5 ? e : 5
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
                let record = {};
                columns.push({
                    title: 'Level ' + i,
                    dataIndex: 'Level ' + i,
                    key: 'Level ' + i,
                    render: (item, record) => <Form.Item
                        {...formItemLayout}
                        // label={k}
                        required={true}
                        key={`${i}[${record.id}]`}>
                        {getFieldDecorator(`${i}[${record.id}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: (this.state.editRecordMargins && this.state.editRecordMargins[record.id] ? this.state.editRecordMargins[record.id][i] : null)
                        })(
                            <InputNumber min={0} placeholder="Percent Commission"/>
                        )}
                    </Form.Item>
                })
            }

        return (
            <Card title={"Manage MLM Commission"}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item
                        {...formItemLayout}
                        label={"Margin Name"}
                        required={true}
                        key={`margin_name`}>
                        {getFieldDecorator(`margin_name`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: (this.state.margin ? this.state.margin.name : null)
                        })(
                            <Input placeholder="Margin Type Name"/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label={'No of Levels'}
                        required={false}
                        key={`level_count`}

                    >
                        {getFieldDecorator(`level_count`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: this.state.level_count
                        })(
                            <InputNumber min={1} max={5} placeholder="Level Count" onChange={this.setLevelCount}/>
                        )}
                    </Form.Item>
                    <Table loading={this.state.loading} bordered={true} pagination={false} columns={columns} dataSource={this.state.staffRoles}/>
                    <Form.Item>
                        <br/>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Set MLM Commissions
                        </Button>
                    </Form.Item>
                </Form>
                {this.state.redirect&&    <Redirect to='/settings/mlm' />}
            </Card>
            
        );
    }
}

export default Form.create()(MLMGenerate);
