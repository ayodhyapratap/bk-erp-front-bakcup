import React from "react";
import {Card, DatePicker, Form, Select, Checkbox,Radio,Col,Button,InputNumber, Row,Popconfirm} from "antd";
import {getAPI, interpolate,displayMessage} from "../../utils/common";
import {BED_PACKAGES, CHECK_SEAT_AVAILABILITY} from "../../constants/api";
import moment from "moment";
import {Booking_Type} from "../../constants/hardData";
import {WARNING_MSG_TYPE} from "../../constants/dataKeys";
class BedBookingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            packages: [],
            totalPayableAmount:0,
            totalPayingAmount: 0,
        }
    }

    componentDidMount() {
        this.loadPackages();
    }

    loadPackages = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                packages: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(BED_PACKAGES, [this.props.active_practiceId]), successFn, errorFn);

    }

    checkBedStatus = (type, value) => {
        let that = this;
        this.setState({
            [type]: value
        }, function () {
            let successFn = function (data) {
                console.log(data)
            }
            let errorFn = function () {

            }
            let {from_date, bed_package} = that.state;
            if (from_date && bed_package) {
                let to_date = null;
                that.state.packages.forEach(function (pkgObj) {
                    if (bed_package == pkgObj.id) {
                        to_date = moment(from_date).add(pkgObj.no_of_days - 1, 'day')
                    }
                });
                if (from_date && to_date && bed_package) {
                    let {setFieldsValue} = that.props.form;
                    setFieldsValue({
                        to_date: to_date
                    })
                    getAPI(interpolate(CHECK_SEAT_AVAILABILITY, [that.props.active_practiceId]), successFn, errorFn, {
                        start: moment(from_date).format('YYYY-MM-DD'),
                        end: moment(to_date).format('YYYY-MM-DD'),
                        bed_package: bed_package
                    })
                }
            }
        });
    }


    handleSubmit = (e) => {
        this.setState({
            loading: true
        })
        let that = this;
        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("formvalue",values)
            }
        })
    }

    handleRoomType = (name, value) => {
        let that = this;
        this.setState({
            [name]: value,
        },function(){
            that.calculateTotalAmount();
        });

    }
    calculateTotalAmount=()=>{
        let that=this;
        that.setState(function(prevSate){
            let payAmount=0;
            prevSate.packages.forEach(function (item){
                if (prevSate.bed_package == item.id) {
                    if(prevSate.type == 'NORMAL'){
                        payAmount=item.normal_price
                    }
                    if(prevSate.type == 'TATKAL'){
                        payAmount=item.tatkal_price
                    }
                }
            });
            return{
                totalPayableAmount:payAmount,
            }
        })
    }
    setPaymentAmount = (value) => {
        let that = this;
        this.setState({
            totalPayingAmount: value
        }, function () {
            that.calculateTotalAmount();
        })
    }
    render() {
        let that = this;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = ({
            labelCol: {span: 8},
            wrapperCol: {span: 12},
        });
        return <div>
            <Card title={"Book a Seat/Bed"}>
                <Form>
                    <Form.Item label="Bed Package" {...formItemLayout}>
                        {getFieldDecorator('bed_package', {
                            rules: [{required: true, message: 'Enter Package!'}],
                        })
                        (<Select onChange={(value) => that.checkBedStatus('bed_package', value)}>
                            {that.state.packages.map(room => <Select.Option
                                value={room.id}>{room.name}</Select.Option>)}
                        </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="Book From" {...formItemLayout}>
                        {getFieldDecorator('from_date', {
                            rules: [{required: true, message: 'Input From Date!'}],
                        })
                        (<DatePicker onChange={(value) => that.checkBedStatus('from_date', value)}
                                     format={'DD-MM-YYYY'}/>)
                        }
                    </Form.Item>
                    <Form.Item label="Book To" {...formItemLayout}>
                        {getFieldDecorator('to_date', {
                            rules: [{required: true, message: 'Input To Date!'}],
                        })
                        (<DatePicker disabled format={'DD-MM-YYYY'}/>)
                        }
                    </Form.Item>
                    <Form.Item label={"Booking Type"} {...formItemLayout} >
                        {getFieldDecorator('type', {rules:[{
                            required:true,message:'this field required'
                        }]
                        })(<Radio.Group
                                onChange={(e) => this.handleRoomType('type', e.target.value)}>
                                {Booking_Type.map((type) => <Radio
                                    value={type.value}>{type.value}</Radio>)}
                            </Radio.Group>
                        )
                        }
                    </Form.Item>
                    <Row>
                        <Col span={8} style={{textAlign:"right"}}>

                            <h3>Grand
                            Total: <b>{this.state.totalPayableAmount}</b></h3>
                        </Col>
                    </Row>
                    
                        <Form.Item label="Pay Now : " {...formItemLayout}>
                            {getFieldDecorator('total',{initialValue:this.state.totalPayingAmount?this.state.totalPayingAmount:null})
                            (
                                <InputNumber min={0} step={1} max={this.state.totalPayableAmount}
                                    onChange={this.setPaymentAmount}/>
                            )
                        }  
                        </Form.Item>
                   
                    <Col span={8} style={{float:"right"}}>
                        <Form.Item {...formItemLayout}>
                            <Popconfirm
                                title={"Are you sure to take payment of INR " + this.state.totalPayingAmount + "?"}  onConfirm={this.handleSubmit}>
                                <Button type={'primary'}>submit</Button>
                            </Popconfirm>
                            {that.props.history ?
                                <Button style={{margin: 5}}
                                        onClick={() => that.props.history.goBack()}>
                                    Cancel
                                </Button> : null}
                        </Form.Item>
                    </Col>
                </Form>
            </Card>
        </div>
    }
}

export default Form.create()(BedBookingForm)
