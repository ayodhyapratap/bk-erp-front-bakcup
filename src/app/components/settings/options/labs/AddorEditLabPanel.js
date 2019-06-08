import React from "react";
import {Card, Divider, Row, Col, Input,Button,InputNumber,Select} from "antd";
import {Redirect, Route} from "react-router-dom";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {LABTEST_API,LABPANEL_API} from "../../../../constants/api";
import {displayMessage, getAPI,postAPI ,interpolate,} from "../../../../utils/common";
import {Form} from "antd/lib/index";
import {WARNING_MSG_TYPE} from "../../../../constants/dataKeys";
const { Option } = Select;
class AddorEditLab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           panelCost:0,
           tests:[],
           selectedTest:{},
        };
        this.loadTests = this.loadTests.bind(this);
    }
    componentDidMount() {
        this.loadTests();
    }

    loadTests(){
        let that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                tests: data,
                loading: false
            })
            console.log(JSON.stringify(that.state.tests));
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(LABTEST_API, [that.props.active_practiceId]), successFn, errorFn);
    }
    

    onChangeHandler=(value)=>{
        this.setState({

            panelCost:value,
        })
    }
    onChangeSelect = (e)=>{
        this.setState(function(prevState){
            if(prevState.selectedTest[e]){
                displayMessage(WARNING_MSG_TYPE, "Item Already Added");
                return {};
            }
            let testObject = null;
            for(let i=0;i<prevState.tests.length;i++){
                if(prevState.tests[i].id==e){
                    testObject = prevState.tests[i];
                    break;
                }
            }
            if(testObject){
                return {selectedTest:{...prevState.selectedTest,[e]:testObject}}
            }
          return {}


        })
        
    }
    removeLabPanel = (id) => {
        this.setState(function (prevState) {
            return {
               
            }
        });
        console.log("id",id)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let that = this;
        this.props.form.validateFields((err, formData) => {
            if (!err) {
                let reqData = {...formData ,tests:Object.keys(this.state.selectedTest)}
                console.log("test", reqData);
                let successFn = function (data) {
                    if (data) {
                        console.log(data)
                    }
                };
                let errorFn = function () {
                };
                postAPI(interpolate(LABPANEL_API, [that.props.active_practiceId]), reqData, successFn, errorFn);
            }
        });
    }
    onChangeCostCalculate(){

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
        let testKeys = Object.keys(this.state.selectedTest);
        let TotalCost =0;
         testKeys.forEach(function(key){TotalCost+=parseInt(that.state.selectedTest[key].cost)});
        console.log("total cost",TotalCost);
        const {getFieldDecorator} = this.props.form;
        const testOption = this.state.tests.map((test) => <Select.Option value={test.id}>{test.name}</Select.Option>)
        return <Row>
            <Col span={18}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item  label={"Panel Name"} {...formItemLayout}>
                        {getFieldDecorator('name', {
                        
                        })(
                        <Input />
                        )}
                    </Form.Item>
                
                    <Form.Item label={(<span>Test Name</span>)} {...formItemLayout}>
                        <Select style={{width:'100%'}} onChange={this.onChangeSelect} >
                            {testOption}
                        </Select>
                        
                        <div>{testKeys ? testKeys.map((key)=><p key={key}>{that.state.selectedTest[key].name} <span style={{paddingLeft: '50%'}}>{this.state.selectedTest[key].cost}</span>
                           <Button icon={"close"} style={{float:'right'}} onClick={() => this.removeLabPanel(that.state.selectedTest[key].id)} type={"danger"} shape="circle"
                        size="small"/></p>): null}</div>
                    </Form.Item>
                    
                    <Form.Item  label={(<span>Panel Cost</span>)} {...formItemLayout}>
                        {getFieldDecorator('cost', {
                            initialValue:TotalCost,
                            // onChange:this.onChangeHandler,
                            
                        })(
                            <InputNumber/>
                           
                        )}
                         <span className="ant-form-text"> Total : {typeof TotalCost === 'number'  ? TotalCost : 0}</span>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button onClick={this.handleReset}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Col>

            
        </Row>
    }
}
export default Form.create()(AddorEditLab);