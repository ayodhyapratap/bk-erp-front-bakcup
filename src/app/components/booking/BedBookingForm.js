import React from "react";
import {Card, DatePicker, Form, Select, Icon,Radio,Col,Button,InputNumber, Row,Popconfirm, Input ,AutoComplete,List,Avatar} from "antd";
import {getAPI, interpolate,displayMessage, postAPI} from "../../utils/common";
import {BED_PACKAGES, CHECK_SEAT_AVAILABILITY ,BOOK_SEAT ,PATIENT_PROFILE ,SEARCH_PATIENT,PAYMENT_MODES} from "../../constants/api";
import moment from "moment";
// import {Booking_Type} from "../../constants/hardData";
import {WARNING_MSG_TYPE,ERROR_MSG_TYPE ,SUCCESS_MSG_TYPE} from "../../constants/dataKeys";

const {Meta} = Card;

class BedBookingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            packages: [],
            totalPayableAmount:0,
            totalPayingAmount: 0,
            patientList:[],
            paymentModes:[],

        }
    }

    componentDidMount() {
        this.loadPackages();
        this.loadPaymentModes();
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
    searchPatient = (value) => {
        let that = this;
        let successFn = function (data) {
            if (data) {
                that.setState({
                    patientList: data,
                   
                })
            }
        };
        let errorFn = function () {
        };
        getAPI(interpolate(SEARCH_PATIENT, [value]), successFn, errorFn);
    }

    handlePatientSelect = (event) => {
        if (event) {
            let that = this;
            let successFn = function (data) {
                that.setState({
                    patientDetails: data
                });
            };
            let errorFn = function () {
            };
            getAPI(interpolate(PATIENT_PROFILE, [event]), successFn, errorFn);
        }
    }

    loadPaymentModes(){
        var that = this;
          let successFn = function (data) {
            that.setState({
              paymentModes:data,
            })
          };
          let errorFn = function () {
          };
          getAPI(interpolate( PAYMENT_MODES, [this.props.active_practiceId]), successFn, errorFn);
      }
    checkBedStatus = (type, value) => {
        let that = this;
        this.setState({
            [type]: value
        }, function () {
            let successFn = function (data) {
                that.setState({
                    availabilitySeatTatkal:data.TATKAL,
                    availabilitySeatNormal:data.NORMAL,
                })
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
                let reqData = {...values,
                    to_date:moment(values.to_date).format('YYYY-MM-DD'),
                    from_date:moment(values.from_date).format('YYYY-MM-DD'),
                    paid:false,
                    total_price:this.state.totalPayableAmount,
                    date:moment().format('YYYY-MM-DD'),
                    total_tax:this.state.tax,
                    patient:this.state.patientDetails.id
                };
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Saved Successfully!!");
                    
                }
                let errorFn = function () {
                    
                }
                postAPI(interpolate(BOOK_SEAT, [this.props.active_practiceId]), reqData, successFn, errorFn);
            }
        })

        
    }
    handleClick = (e) => {
        this.setState({
            patientDetails: null
        })

    }
    handleRoomType = (name, value) => {
        let that = this;
        this.setState({
            [name]:value,
        },function(){
            that.calculateTotalAmount();
        });

    }
    calculateTotalAmount=()=>{
        let that=this;
        that.setState(function(prevSate){
            let payAmount=0;
            let total_tax=0;
            prevSate.packages.forEach(function (item){
                if (prevSate.bed_package == item.id) {
                    if(prevSate.seat_type == 'NORMAL'){
                        payAmount=item.normal_price + item.tax_value;
                        total_tax=item.tax_value
                    }
                    if(prevSate.seat_type == 'TATKAL'){
                        payAmount=item.tatkal_price + item.tax_value;
                        total_tax=item.tax_value
                    }
                }
            });
            return{
                totalPayableAmount:payAmount,
                tax:total_tax
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
        console.log("state",this.state)
        console.log("props",this.props)
        const Booking_Type = [
            {value: 'TATKAL', is_or_not:this.state.availabilitySeatTatkal && this.state.availabilitySeatTatkal.available?true:false},
            {value: 'NORMAL', is_or_not:this.state.availabilitySeatNormal && this.state.availabilitySeatNormal.available?true:false}
        ];

        let that = this;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = ({
            labelCol: {span: 8},
            wrapperCol: {span: 6},
        });
        const formPatients = ({
            wrapperCol: {offset: 6, span: 8},
        });
        return <div>
            <Card title={"Book a Seat/Bed"}>
                <Form>
                    {this.state.patientDetails?<Form.Item  key="id" value={this.state.patientDetails.id} {...formPatients}>
                            <Card bordered={false} style={{background: '#ECECEC'}}
                             extra={<a href="#" onClick={this.handleClick}><Icon type="close-circle" style={{ color: 'red' }} /> </a>}
                             >
                                <Meta
                                    avatar={<Avatar style={{backgroundColor: '#ffff'}}
                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                    title={this.state.patientDetails.user.first_name}
                                    description={this.state.patientDetails.user.mobile}
                                />
                                {/* <Button type="primary" style={{float: 'right'}} onClick={this.handleClick}>Add New
                                    Patient</Button> */}
                            </Card>
                        </Form.Item>
                    :<div>
                        <Form.Item label="Patient" {...formItemLayout}>
                            {getFieldDecorator('patient',{rules:[{ required:true ,message:'this field required' }],
                            })
                            ( <AutoComplete placeholder="Patient Name"
                                    showSearch
                                    onSearch={this.searchPatient}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSelect={this.handlePatientSelect}>
                                    {this.state.patientList.map((option) => <AutoComplete.Option
                                        value={option.id.toString()}>
                                        <List.Item style={{padding: 0}}>
                                            <List.Item.Meta
                                                avatar={<Avatar
                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                                title={option.user.first_name + " (" + option.user.id + ")"}
                                                description={<small>{option.user.mobile}</small>}
                                            />

                                        </List.Item>
                                    </AutoComplete.Option>)}
                                </AutoComplete>)
                            }
                        </Form.Item>
                    </div>}
                   
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
                        {getFieldDecorator('seat_type', {rules:[{
                            required:true,message:'this field required'
                        }]
                        })(<Radio.Group
                                onChange={(e) => this.handleRoomType('seat_type', e.target.value)}>
                                {Booking_Type.map((seat_type) => <Radio
                                    value={seat_type.value} disabled={seat_type.is_or_not?false:true}>{seat_type.value}</Radio>)}
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
                        {getFieldDecorator('pay_value',{initialValue:this.state.totalPayingAmount?this.state.totalPayingAmount:null})
                        (
                            <InputNumber min={0} step={1} max={this.state.totalPayableAmount}
                                onChange={this.setPaymentAmount}/>
                        )
                    }  
                    </Form.Item>
                    <Form.Item label="Payment Mode" {...formItemLayout}>
                         {getFieldDecorator('payment_mode',{rules:[{ required:true ,message:'this field required' }],
                        })
                            (<Select showSearch
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.state.paymentModes.map(type => <Select.Option
                                    value={type.id}>{type.mode}</Select.Option>)}
                            </Select>)
                        }
                    </Form.Item>
                   
                    <Col span={7} style={{float:"right"}}>
                        <Form.Item>
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
