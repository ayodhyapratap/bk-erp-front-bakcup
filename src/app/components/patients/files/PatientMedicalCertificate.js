import React from "react";
import {Route} from "react-router";
import { Form, Icon, Input, Button,Checkbox, Card,DatePicker, Radio ,Row,Col,Select} from 'antd';
import {Redirect, Link} from 'react-router-dom'
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import {ATTENDANCE} from "../../../constants/hardData";


const { TextArea } = Input;
const { Option } = Select;
class PatientMedicalCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
           checked:false
        }
        
    console.log(this.props);
    }
    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }
    

    render() {
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
                md: {span: 8},
                lg: {span: 8},
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
                md: { span: 16 },
                lg: { span: 16 },
            },
        };
          
        return (<Card title="ADD MEDICAL LEAVE CERTIFICATE"
                extra={<Button.Group>
                <Button type="primary" htmlType="submit">Save Certificate</Button>
            </Button.Group>}>

            <Form onSubmit={this.handleSubmit} {...formItemLayout}> 

                <Form.Item >
                    {getFieldDecorator('excused_duty', { })(
                        (<Checkbox>Excused from duty</Checkbox>),
                    )}                 
                </Form.Item> 
                <Row>
                    <Col span={6} offset={6}>
                        <Form.Item label="From">
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="till">
                            <DatePicker />
                        </Form.Item>
                        
                    </Col>
                    <Col span={6} >
                        <Form.Item>
                            <Select>
                                <Option value="M">Morning</Option>
                                <Option value="E">Evening</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Select>
                                <Option value="M">Morning</Option>
                                <Option value="E">Evening</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item >
                    {getFieldDecorator('excused_duty', { })(
                        (<Checkbox>Fit for light duty</Checkbox>),
                    )}                 
                </Form.Item> 
                <Row>
                    <Col>
                        <Form.Item label="From">
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="till">
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>
                

                <Form.Item>
                    {getFieldDecorator('excused_duty', { })(
                        (<Checkbox>Proof of attendance at practice</Checkbox>),
                    )}                 
                </Form.Item> 
                <Row>
                        <Form.Item label="on">
                            <DatePicker />
                        </Form.Item>
                        <Col span={4} offset={6}>
                            <Form.Item label="From">
                                <Select>
                                    <Option value="M">5pm</Option>
                                    <Option value="E">8pm</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="till">
                                <Select>
                                    <Option value="M">8</Option>
                                    <Option value="E">9</Option>
                                </Select>
                            </Form.Item>
                        
                        </Col>
                        <Col span={4} >
                            <Form.Item>
                                <Select>
                                    <Option value="M">8</Option>
                                    <Option value="E">9</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Select>
                                    <Option value="M">8</Option>
                                    <Option value="E">9</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                </Row>
                        
                <Form.Item label="Notes">
                    {getFieldDecorator('excused_duty', { })(
                        (<TextArea/>),
                    )}                 
                </Form.Item> 

                
                <Form.Item>
                    <Radio.Group>
                        <Radio value="a">Valid for absence from court attendance  </Radio>
                        <Radio value="b">Invalid for absence from court attendance  </Radio>
                        <Radio value="c">Dont mention</Radio>
                    </Radio.Group>
                </Form.Item>
               
            </Form>
        </Card>

        );
      }
}

export default Form.create()(PatientMedicalCertificate);
