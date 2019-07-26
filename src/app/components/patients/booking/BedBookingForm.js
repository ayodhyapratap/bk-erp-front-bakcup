import React from "react";
import {
    Alert,
    AutoComplete,
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Icon,
    Input,
    InputNumber,
    List,
    message,
    Popconfirm,
    Radio,
    Row,
    Select,
    Table,
    Upload
} from "antd";
import {displayMessage, getAPI, interpolate, makeFileURL, makeURL, postAPI} from "../../../utils/common";
import {
    BED_PACKAGES,
    BOOK_SEAT,
    CHECK_SEAT_AVAILABILITY,
    DISEASE_LIST,
    FILE_UPLOAD_API,
    MEDICINE_PACKAGES,
    PATIENT_PROFILE,
    PAYMENT_MODES,
    SEARCH_PATIENT
} from "../../../constants/api";
import moment from "moment";
// import {Booking_Type} from "../../constants/hardData";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";

const {Meta} = Card;

class BedBookingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            packages: [],
            totalPayableAmount: 0,
            totalPayingAmount: 0,
            patientList: [],
            paymentModes: [],
            medicinePackage: [],
            medicineItem: [],
            diseases: []
            //choosePkg:{},


        }
    }

    componentDidMount() {
        if (this.props.currentPatient)
            this.handlePatientSelect(this.props.currentPatient.id);
        this.loadPackages();
        this.loadPaymentModes();
        this.loadMedicinePackages();
        this.loadDiseases();
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
    loadDiseases = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                diseases: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(DISEASE_LIST, [this.props.active_practiceId]), successFn, errorFn);

    }

    loadMedicinePackages() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                medicinePackage: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MEDICINE_PACKAGES, [this.props.active_practiceId]), successFn, errorFn);
    }

    searchPatient = (value) => {
        let that = this;
        let successFn = function (data) {
            if (data) {
                that.setState({
                    patientList: data,
                    ptr: data,

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

    loadPaymentModes() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                paymentModes: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PAYMENT_MODES, [this.props.active_practiceId]), successFn, errorFn);
    }

    checkBedStatus = (type, value) => {
        let that = this;
        that.handleRoomType();
        this.setState({
            [type]: value
        }, function () {

            let successFn = function (data) {
                that.setState({
                    availabilitySeatTatkal: data.TATKAL,
                    availabilitySeatNormal: data.NORMAL,
                });
                let currentSelected = that.props.form.getFieldValue('seat_type');
                if (!data[currentSelected]) {
                    that.props.form.setFieldsValue({
                        seat_type: null
                    })
                    that.calculateTotalAmount();
                }
            }
            that.calculateTotalAmount();
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
                let reqData = {
                    ...values,
                    to_date: moment(values.to_date).format('YYYY-MM-DD'),
                    from_date: moment(values.from_date).format('YYYY-MM-DD'),
                    paid: false,
                    total_price: this.state.totalPayableAmount,
                    date: moment().format('YYYY-MM-DD'),
                    total_tax: this.state.tax,
                    patient: this.state.patientDetails.id,
                    rest_diseases: values.rest_diseases ? values.rest_diseases.join(',') : null,
                    report_upload: values.file && values.file.file.response ? values.file.file.response.image_path : null
                };
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Saved Successfully!!");
                    that.props.history.goBack();
                    if (that.props.loadData)
                        that.props.loadData();
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
            [name]: value,
        }, function () {
            that.calculateTotalAmount();
        });

    }
    calculateTotalAmount = () => {
        let that = this;
        that.setState(function (prevSate) {
            let payAmount = 0;
            let total_tax = 0;
            let bedPkg = {};
            let medicinePkg = [];
            let total_medicine_price = 0;
            prevSate.packages.forEach(function (item) {
                if (prevSate.bed_package == item.id) {
                    if (prevSate.seat_type == 'NORMAL') {
                        payAmount = item.normal_price + item.normal_tax_value;
                        total_tax += item.normal_tax_value
                        bedPkg = {
                            ...item,
                            type: "BED",
                            price_with_tax: payAmount,
                            tax: item.normal_tax_value,
                            price: item.normal_price
                        };
                        medicinePkg = [bedPkg];
                    }
                    if (prevSate.seat_type == 'TATKAL') {
                        payAmount = item.tatkal_price + item.tatkal_tax_value;
                        total_tax += item.tatkal_tax_value
                        bedPkg = {
                            ...item,
                            type: "BED",
                            price_with_tax: payAmount,
                            tax: item.tatkal_tax_value,
                            price: item.tatkal_price
                        };
                        medicinePkg = [bedPkg];
                    }
                }
            });

            prevSate.medicinePackage.forEach(function (item) {
                prevSate.medicineItem.forEach(function (ele) {
                    if (item.id == ele) {
                        total_medicine_price += item.final_price;
                        total_tax += item.tax_value;
                        medicinePkg = [...medicinePkg, {
                            ...item,
                            type: "MEDICINE",
                            price_with_tax: item.final_price,
                            tax: item.tax_value
                        }]

                    }
                });
            });
            return {
                totalPayableAmount: payAmount + total_medicine_price,
                tax: total_tax,
                choosePkg: [...medicinePkg]
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
    handleMedicineSelect = (e) => {
        let value = e;
        this.setState({
            medicineItem: value,
        }, function () {
            this.calculateTotalAmount()
        })
    }

    render() {
        const BOOKING_TYPE = [
            {
                value: 'NORMAL',
                is_or_not: this.state.availabilitySeatNormal && this.state.availabilitySeatNormal.available ? true : false
            },
            {
                value: 'TATKAL',
                is_or_not: this.state.availabilitySeatTatkal && this.state.availabilitySeatTatkal.available ? true : false
            },

        ];

        let that = this;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = ({
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        });
        const formPatients = ({
            wrapperCol: {
                xs: {offset: 6, span: 24},
                sm: {offset: 6, span: 14},
            },
        });
        const columns = [{
            title: 'Item',
            key: 'name',
            dataIndex: 'name'
        },
            //     {
            //     title: 'Normal Price',
            //     key: 'normal_price',
            //     dataIndex: 'normal_price',
            //     // render:(value,record)=>(<p>{value.toFixed()}</p>)
            // }, {
            //     title: 'Tatkal Price',
            //     key: 'tatkal_price',
            //     dataIndex: 'tatkal_price',
            //     // render:(value,record)=>(<p>{record?(record.tatkal_price).toFixed():null}</p>)
            // },
            {
                title: 'Price',
                key: 'price',
                dataIndex: 'price',
                render: (value, record) => (<p>{value ? (value).toFixed(2) : null}</p>)

            }, {
                title: 'Tax',
                key: 'tax',
                dataIndex: 'tax',
                render: (value, record) => (<p>{value ? (value).toFixed(2) : null}</p>)
            }, {
                title: 'Total Amount',
                key: 'price_with_tax',
                dataIndex: 'price_with_tax',
                render: (value, record) => (<p>{value ? (value).toFixed(2) : null}</p>)
            }];
        const singleUploadprops = {
            name: 'image',
            data: {
                name: 'hello'
            },
            action: makeURL(FILE_UPLOAD_API),
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {

                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return <div>
            <Card title={"Book a Seat/Bed"}>
                <Form>
                    <Row>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div>

                                {this.state.patientDetails ? <Form.Item key="id"
                                                                        value={this.state.patientDetails ? this.state.patientDetails.id : ''} {...formPatients}>
                                        <Card bordered={false} style={{background: '#ECECEC'}}>
                                            <Meta
                                                avatar={this.state.patientDetails.image ?
                                                    <Avatar style={{backgroundColor: '#ffff'}}
                                                            src={makeFileURL(this.state.patientDetails.image)}/> :
                                                    <Icon type="user"/>}
                                                title={this.state.patientDetails.user.first_name}
                                                description={this.state.patientDetails.user.mobile}
                                            />
                                            {/*<Button onClick={this.handleClick} icon="close-circle"*/}
                                            {/*        type={"danger"}/>*/}
                                            {/* <Button type="primary" style={{float: 'right'}} onClick={this.handleClick}>Add New
                                                Patient</Button> */}
                                        </Card>
                                    </Form.Item>
                                    : <div>
                                        <Form.Item label="Patient" {...formItemLayout}>
                                            {getFieldDecorator('patient', {
                                                rules: [{required: true, message: 'this field required'}],
                                            })
                                            (<AutoComplete placeholder="Patient Name"
                                                           showSearch
                                                           onSearch={this.searchPatient}
                                                           defaultActiveFirstOption={false}
                                                           showArrow={false}
                                                           filterOption={false}
                                                           onSelect={this.handlePatientSelect}>
                                                {this.state.patientList.map((option) => <AutoComplete.Option
                                                    value={option ? option.id.toString() : ''}>
                                                    <List.Item style={{padding: 0}}>
                                                        <List.Item.Meta
                                                            avatar={option.image ?
                                                                <Avatar style={{backgroundColor: '#ffff'}}
                                                                        src={makeFileURL(option.image)}/> :
                                                                <Icon type="user"/>}
                                                            title={option.user.first_name + " (" + option.user.id + ")"}
                                                            description={<small>{option.user.mobile}</small>}
                                                        />

                                                    </List.Item>
                                                </AutoComplete.Option>)}
                                            </AutoComplete>)
                                            }

                                            {this.state.ptr ? <Alert message="Patient Not Found !!"
                                                                     description="Please Search another patient or create new patient."
                                                                     type="error"/> : null}
                                        </Form.Item>
                                    </div>}

                                <Form.Item label="Bed Package" {...formItemLayout}>
                                    {getFieldDecorator('bed_package', {
                                        rules: [{required: true, message: 'this field required!'}],
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
                                    {getFieldDecorator('seat_type', {
                                        rules: [{
                                            required: true, message: 'this field required'
                                        }]
                                    })(<Radio.Group
                                            onChange={(e) => this.handleRoomType('seat_type', e.target.value)}>
                                            {BOOKING_TYPE.map((seat_type) => <Radio
                                                value={seat_type.is_or_not ? seat_type.value : ''}
                                                disabled={seat_type.is_or_not ? false : true}>{seat_type.value}</Radio>)}
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item label="Medicine  Package" {...formItemLayout}>
                                    {getFieldDecorator('medicines', {})
                                    (<Select mode="multiple" onChange={this.handleMedicineSelect}>
                                        {that.state.medicinePackage.map(item => <Select.Option
                                            value={item.id}>{item.name}</Select.Option>)}
                                    </Select>)
                                    }
                                </Form.Item>

                                <Form.Item label="Pay Now : " {...formItemLayout}>
                                    {getFieldDecorator('pay_value', {
                                        rules: [{
                                            required: true,
                                            message: 'this field is required'
                                        }],
                                        initialValue: this.state.totalPayingAmount ? this.state.totalPayingAmount : null
                                    })
                                    (
                                        <InputNumber min={0} step={1} max={this.state.totalPayableAmount}
                                                     onChange={this.setPaymentAmount}/>
                                    )
                                    }
                                </Form.Item>
                                <Form.Item label="Payment Mode" {...formItemLayout}>
                                    {getFieldDecorator('payment_mode', {
                                        rules: [{required: true, message: 'this field required'}],
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

                                {/* <Col span={7} style={{float:"right"}}>
                                    <Form.Item>
                                        <Popconfirm
                                            title={"Are you sure to take payment of INR " + this.state.totalPayingAmount + "?"}  onConfirm={this.handleSubmit}>
                                            <Button type={'primary'}>Submit</Button>
                                        </Popconfirm>
                                        {that.props.history ?
                                            <Button style={{margin: 5}}
                                                    onClick={() => that.props.history.goBack()}>
                                                Cancel
                                            </Button> : null}
                                    </Form.Item>
                                </Col>  */}

                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Divider>Patient Details</Divider>
                            <Form.Item label="Creatinine Level" {...formItemLayout}>
                                {getFieldDecorator('creatinine', {
                                    // rules: [{required: true, message: 'this field required'}],
                                })
                                (<Input/>)
                                }
                            </Form.Item>
                            <Form.Item label="Urea Level" {...formItemLayout}>
                                {getFieldDecorator('urea_level', {
                                    // rules: [{required: true, message: 'this field required'}],
                                })
                                (<Input/>)
                                }
                            </Form.Item>
                            <Form.Item label="Currently on Dialysis?" {...formItemLayout}>
                                {getFieldDecorator('dialysis', {
                                    // rules: [{required: true, message: 'this field required'}],
                                })
                                (<Select showSearch
                                         filterOption={(input, option) =>
                                             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                         }>
                                    <Select.Option
                                        value={true}>YES</Select.Option>
                                    <Select.Option
                                        value={false}>NO</Select.Option>
                                </Select>)
                                }
                            </Form.Item>
                            <Form.Item label="Diseases" {...formItemLayout}>
                                {getFieldDecorator('other_diseases', {
                                    // rules: [{required: true, message: 'this field required'}],
                                })
                                (<Select showSearch mode={"multiple"}
                                         filterOption={(input, option) =>
                                             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                         }>
                                    {this.state.diseases.map(item => <Select.Option
                                        value={item.id}>{item.name}</Select.Option>)}
                                </Select>)
                                }
                            </Form.Item>
                            <Form.Item label="Other Diseases" {...formItemLayout}>
                                {getFieldDecorator('rest_diseases', {
                                    // rules: [{required: true, message: 'this field required'}],
                                })
                                (<Select mode={"tags"}>

                                </Select>)
                                }
                            </Form.Item>
                            <Form.Item label="Upload Report" {...formItemLayout}>
                                {getFieldDecorator('file', {
                                    // rules: [{required: true, message: 'this field required'}],
                                })
                                (<Upload {...singleUploadprops}>
                                    <Button>
                                        <Icon type="upload"/> Select File
                                    </Button>

                                </Upload>)
                                }
                            </Form.Item>
                            <Table pagination={false} columns={columns} size={'small'}
                                   dataSource={this.state.choosePkg}/>

                        </Col>
                        <Col span={24}>
                            <h3>Grand Total: <b>{this.state.totalPayableAmount.toFixed(2)}</b></h3>
                            <Form.Item>
                                <Popconfirm
                                    title={"Are you sure to take payment of INR " + this.state.totalPayingAmount + "?"}
                                    onConfirm={this.handleSubmit}>
                                    <Button type={'primary'}>Submit</Button>
                                </Popconfirm>
                                {that.props.history ?
                                    <Button style={{margin: 5}}
                                            onClick={() => that.props.history.goBack()}>
                                        Cancel
                                    </Button> : null}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    }
}

export default Form.create()(BedBookingForm)
