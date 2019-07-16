import React from "react";
import {Card, DatePicker, Form, Select} from "antd";
import {getAPI, interpolate} from "../../utils/common";
import {BED_PACKAGES, CHECK_SEAT_AVAILABILITY} from "../../constants/api";
import moment from "moment";

class BedBookingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            packages: []
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
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

            }
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
                <Form onSubmit={that.handleSubmit}>
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
                </Form>
            </Card>
        </div>
    }
}

export default Form.create()(BedBookingForm)
