import React from "react";
import {
    DATE_PICKER,
    DATE_TIME_PICKER, DOCTORS_ROLE,
    ERROR_MSG_TYPE,
    INPUT_FIELD,
    SELECT_FIELD,
    TIME_PICKER
} from "../../constants/dataKeys";
import moment from "moment";
import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {Form, Card, Row, Col} from "antd";
import {APPOINTMENT_PERPRACTICE_API, BLOCK_CALENDAR, PRACTICESTAFF} from "../../constants/api";
import {displayMessage, getAPI, interpolate} from "../../utils/common";

export default class BlockCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            practice_doctors: [],
        };
        this.loadDoctors();
    }

    changeParamsForBlockedAppointments = (valueObj) => {
        let that = this;
        this.setState({
            blockedAppointmentParams: valueObj
        }, function () {
            if (valueObj.block_from && valueObj.block_to)
                that.retrieveBlockingAppointments();
        })
        return true;
    }
    retrieveBlockingAppointments = () => {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setState(function (prevState) {
                return {
                    blockingAppointments: data,
                    loading: false
                }
            });
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(interpolate(APPOINTMENT_PERPRACTICE_API, [this.props.active_practiceId]), successFn, errorFn, {
            start: moment(that.state.blockedAppointmentParams.block_from).format('YYYY-MM-DD'),
            end: moment(that.state.blockedAppointmentParams.block_to).format('YYYY-MM-DD')
        });
    }

    loadDoctors() {
        let that = this;
        let successFn = function (data) {
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    let doctor = that.state.practice_doctors;
                    doctor.push(usersdata);
                    that.setState({
                        practice_doctors: doctor,
                    })
                } else {
                    let doctor = that.state.practice_staff;
                    doctor.push(usersdata);
                    that.setState({
                        practice_staff: doctor,
                    })
                }
            })
            let doctor_object = {}
            if (that.state.practice_doctors) {
                that.state.practice_doctors.forEach(function (drug) {
                    doctor_object[drug.id] = drug;
                })
            }
            that.setState({
                doctors_object: doctor_object,
            })
        }
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        let that = this;
        const fields = [{
            label: "Block From",
            key: 'block_from',
            type: DATE_TIME_PICKER,
            initialValue: moment(),
            required: true
        }, {
            label: "Block To",
            key: 'block_to',
            type: DATE_TIME_PICKER,
            initialValue: moment().add(5, 'm'),
            required: true
        }, {
            label: "Event Name",
            key: 'event',
            type: INPUT_FIELD,
        }, {
            label: "Doctor",
            key: 'doctor',
            type: SELECT_FIELD,
            options: that.state.practice_doctors.map(item => Object.create({
                label: item.user.first_name,
                value: item.id
            }))
        }];

        const BlockCalendarLayoutForm = Form.create({
            onValuesChange: (props, changedValues, allValues) => {
                console.log(props, changedValues, allValues);
                setTimeout(function () {
                    that.changeParamsForBlockedAppointments(allValues);
                }, 0);
                return false;
            }
        })(DynamicFieldsForm);
        let formProp = {
            method: 'post',
            action: BLOCK_CALENDAR,
            successFn: function (data) {
                if (that.props.history)
                    that.props.history.goBack();
            },
            errorFn: function () {
                displayMessage(ERROR_MSG_TYPE, "Blocking Calendar Failed");
            }
        }
        let defaultValues = [{key: 'practice', value: that.props.active_practiceId}];
        return <Card title={'Block Calendar'}>
            <Row>
                <Col span={18}>
                    <BlockCalendarLayoutForm fields={fields} formProp={formProp}
                                             wrappedComponentRef={(form) => that.form = form}
                                             defaultValues={defaultValues} {...this.props}/>
                </Col>
                <Col span={6}>

                </Col>
            </Row>

        </Card>;
    }
}
