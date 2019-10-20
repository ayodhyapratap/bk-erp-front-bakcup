import React from "react";
import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Spin} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {SEARCH_PATIENT} from "../../../constants/api";
class AddOrEditMeeting extends React.Component{
    constructor(props){
        super(props);
        this.state={
            max_alfetchinglowed:10,
            patientListData:[],
            fetching:false,
            no_of_participant:1
        };
        this.loadPatient = this.loadPatient.bind(this);
    }

    componentWillMount() {
        this.loadPatient();
    }

    loadPatient = (value)=>{
        let that = this;
        this.setState({
            fetching:true,
        });
        let successFn = function (data) {
            if (data.results.length>0) {
                that.setState({
                    patientListData: data.results,
                    fetching:false,
                })
                // console.log("list",that.state.patientListData);
            }
        };
        let errorFn = function () {
        };
        if (value){
            getAPI(interpolate(SEARCH_PATIENT, [value]), successFn, errorFn);
        }

    };

    onChangeParticipant(value){
        this.setState({
            no_of_participant:value
        })
    }
    render() {
        let that=this;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
        };

        const patientField =()=> {
            let fields = [];
            for (var i = 0; i <this.state.no_of_participant; i++) {
               fields.push(<Form.Item label={"Patient"} {...formItemLayout} key={i}>
                   {getFieldDecorator(`names[${i}]`, {initialValue: ''})
                   (<Select notFoundContent={this.state.fetching ? <Spin size="small"/> : null}
                            placeholder="Select Patient" style={{width: '100%'}}
                            showSearch labelInValue onSearch={this.loadPatient} filterOption={false} >

                       {this.state.patientListData.map(option => (
                           <Select.Option key={option.user.id}>{option.user.first_name}</Select.Option>))}
                   </Select>)
                   }
               </Form.Item>)
            }
            return fields;
        }

        return(<Card title={"Add Booking"}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item label={"Purpose"} {...formItemLayout}>
                        {getFieldDecorator('purpose',{initialValue:''})
                        (<Input placeholder={"Purpose"}/>)
                        }
                    </Form.Item>
                    <Form.Item label={"No. of Participants"} {...formItemLayout}>
                        {getFieldDecorator('no_of_participants',{initialValue: ''})
                            (<InputNumber placeholder={"No. of Participants"} min={1} max={100} onChange={(value)=>this.onChangeParticipant(value)}/>)
                        }
                    </Form.Item>


                    {patientField()}

                    <Form.Item label={"Booking From"} {...formItemLayout}>
                        {getFieldDecorator('form',{initialValue:''})
                            (<DatePicker format="YYYY/MM/DD HH:mm" showTime/>)
                        }
                    </Form.Item>

                    <Form.Item label={"Booking To"} {...formItemLayout}>
                        {getFieldDecorator('to',{initialValue:''})
                            (<DatePicker format="YYYY/MM/DD HH:mm" showTime/>)
                        }
                    </Form.Item>
                    <Form.Item {...formItemLayout}>
                        <Button type="primary" htmlType="submit" style={{margin: 5}}>
                            Submit
                        </Button>
                        {that.props.history ?
                            <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                Cancel
                            </Button> : null}
                    </Form.Item>
                </Form>
            </Card>

        )
    }
}
export default Form.create()(AddOrEditMeeting)