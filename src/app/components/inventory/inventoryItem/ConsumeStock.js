import React from "react";
import {
    Button,
    Card,
    Form,
    Input,
    Icon,
    Modal,
    List,
    Row,
    Col,
    Tag,
    Divider,
    Popconfirm,
    Table,
    Tabs,
    InputNumber, Select,
} from "antd";
import {getAPI, interpolate, deleteAPI} from "../../../utils/common";

import {INVENTORY_ITEM_TYPE, DRUG, SUPPLIES, EQUIPMENT} from "../../../constants/hardData";
import {
    INVENTORY_ITEM_API,
    SINGLE_INVENTORY_ITEM_API,
    MANUFACTURER_API,
    TAXES,
    VENDOR_API
} from "../../../constants/api";
import {takeWhile, dropWhile} from 'lodash';

const TabPane = Tabs.TabPane;

let tableFormFields = {
    id: null,
    quantity: 0,
    batch: null
};

class ConsumeStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableFormValues: []
        }

    }

    componentDidMount() {
        this.loadInventoryItemList();

    }

    loadInventoryItemList() {
        let that = this;
        let successFn = function (data) {
            let drugItems = [];
            let equipmentItems = [];
            let supplesItems = [];
            data.forEach(function (item) {
                if (item.item_type == DRUG) {
                    drugItems.push(item);
                }
                if (item.item_type == SUPPLIES) {
                    supplesItems.push(item);
                }
                if (item.item_type == EQUIPMENT) {
                    equipmentItems.push(item);
                }
            });
            that.setState({
                items: {
                    [DRUG]: drugItems,
                    [EQUIPMENT]: equipmentItems,
                    [SUPPLIES]: supplesItems,
                }
            })

        }
        let errorFn = function () {
        }
        getAPI(INVENTORY_ITEM_API, successFn, errorFn);
    }

    ///formdata

    remove = (k) => {
        this.setState(function (prevState) {
            // console.log(dropWhile(prevState.tableFormValues, ['id', k]));
            return {
                tableFormValues: [...dropWhile([...prevState.tableFormValues], ['id', k])]
            }
        });
    }

    add = (item) => {
        // const {form} = this.props;
        // can use data-binding to get
        // const keys = form.getFieldValue('keys');
        // const nextKeys = keys.concat(++id);
        // can use data-binding to set
        // important! notify form to detect changes
        // form.setFieldsValue({
        //     keys: nextKeys,
        // });
        this.setState(function (prevState) {
            return {
                tableFormValues: [...prevState.tableFormValues,
                    {
                        ...tableFormFields,
                        ...item,
                        id: Math.random(),
                    }]
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }


    render() {
        let that = this;
        const {getFieldDecorator, getFieldValue, getFieldsValue} = this.props.form;
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
        const formItemLayoutWithOutLabel = {
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
        let consumeRow = [{
            title: 'Item Name',
            key: 'item_name',
            dataIndex: 'name'
        }, {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (item,record) => <Form.Item
                key={`quantity[${record.id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`quantity[${record.id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={0} placeholder="quantity"/>
                )}
            </Form.Item>
        }, {
            title: 'Batch',
            key: 'batch',
            dataIndex: 'batch',
            render: (item,record) => <Form.Item
                key={`batch[${record.id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`batch[${record.id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <Select placeholder="Batch Number"/>
                )}
            </Form.Item>
        }, {
            title: 'Action',
            key: 'id',
            dataIndex: 'id',
            render: (value) => <a onClick={() => that.remove(value)}>Delete</a>
        }];
        return <div>
            <Card>
                <Row gutter={16}>
                    <Col span={7}>
                        <Tabs size="small">
                            {INVENTORY_ITEM_TYPE.map(itemType => <TabPane tab={itemType.label} key={itemType.value}>
                                <List size={"small"}
                                      itemLayout="horizontal"
                                      dataSource={this.state.items ? this.state.items[itemType.value] : []}
                                      renderItem={item => (
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={item.name}/>
                                              <Button type="primary" size="small" shape="circle"
                                                      onClick={() => this.add(item)} icon={"arrow-right"}/>
                                          </List.Item>)}/>
                            </TabPane>)}
                        </Tabs>
                    </Col>
                    <Col span={17}>
                        <Form onSubmit={this.handleSubmit}>
                            <Table pagination={false}
                                   bordered={true}
                                   dataSource={this.state.tableFormValues}
                                   columns={consumeRow}/>
                            {/*<List>{formItems}</List>*/}
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Card>

        </div>

    }
}

export default Form.create()(ConsumeStock);
