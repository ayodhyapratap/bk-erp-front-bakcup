import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {
    SUCCESS_MSG_TYPE,
    SINGLE_CHECKBOX_FIELD,
    TIME_PICKER,
    CHECKBOX_FIELD,
    INPUT_FIELD,
    RADIO_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD
} from "../../../../constants/dataKeys";
import {CALENDER_SETTINGS} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";

class PracticeTimings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            visible: false,
            timings: null
        };
        this.loadData = this.loadData.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                timings: data[0],
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(CALENDER_SETTINGS, [this.props.active_practiceId]), successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {

        let that = this;

        const editfields = [{
            key: "today_first_day",
            type: SINGLE_CHECKBOX_FIELD,
            initialValue: this.state.timings ? this.state.timings.today_first_day : false,
            follow: "Always show today as first day on my calendar"
        }, {
            label: "Show Calendar Slots of  ",
            key: "calendar_slot",
            follow: "mins",
            required: true,
            initialValue: this.state.timings ? this.state.timings.calendar_slot : null,
            type: NUMBER_FIELD
        }, {
            key: "visting_hour_same_week",
            type: SINGLE_CHECKBOX_FIELD,
            initialValue: this.state.timings ? this.state.timings.visting_hour_same_week : false,
            follow: "Visiting hours are  same for all working days in a week"
        }, {
            label: "Practice open at",
            key: "start_time",
            required:true,
            type: TIME_PICKER,
            initialValue: this.state.timings ? this.state.timings.start_time : null,
            format: "HH:mm"
        }, {
            label: "Practice close at",
            key: "end_time",
            required:true,
            type: TIME_PICKER,
            initialValue: this.state.timings ? this.state.timings.end_time : null,
            format: "HH:mm"
        },
            //  {
            //     key: "update_profile_online",
            //     type: SINGLE_CHECKBOX_FIELD,
            //     initialValue: this.state.timings?this.state.timings.update_profile_online:null,
            //     follow: "Update timings on online profile as well"
            // },
        ];
        const formProp = {
            successFn: function (data) {
                that.loadData();
                console.log(data);
                displayMessage(SUCCESS_MSG_TYPE, "success")
            },
            errorFn: function () {

            },
            action: interpolate(CALENDER_SETTINGS, [this.props.active_practiceId]),
            method: "post",
        }
        if (this.state.timings) {
            let editFormDefaultValues = [{"key": "practice", "value": this.props.active_practiceId},
                {"key": "id", "value": this.state.timings.id}];
            const TestFormLayout = Form.create()(DynamicFieldsForm);
            return <div>
                <TestFormLayout title="Set Practice Timings" defaultValues={editFormDefaultValues} formProp={formProp}
                                fields={editfields}/>
            </div>
        }
        else {
            const editFormDefaultValues = [{"key": "practice", "value": this.props.active_practiceId}];
            const TestFormLayout = Form.create()(DynamicFieldsForm);
            return <div>
                <TestFormLayout title="Set Practice Timings" defaultValues={editFormDefaultValues} formProp={formProp}
                                fields={editfields}/>
            </div>
        }
    }
}

export default PracticeTimings;
