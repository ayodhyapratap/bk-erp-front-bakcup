import React from "react";
import {DATE_PICKER, DATE_TIME_PICKER, ERROR_MSG_TYPE, INPUT_FIELD, TIME_PICKER} from "../../constants/dataKeys";
import moment from "moment";
import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {Form, Card} from "antd";
import {BLOCK_CALENDAR} from "../../constants/api";
import {displayMessage} from "../../utils/common";

export default class BlockCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let that = this;
        let fields = [{
            label: "Block To",
            key: 'block_from',
            type: DATE_TIME_PICKER,
            initialValue: moment()
        }, {
            label: "Block To",
            key: 'block_to',
            type: DATE_TIME_PICKER,
            initialValue: moment().add(5, 'm')
        }, {
            label: "Event Name",
            key: 'event',
            type: INPUT_FIELD,
        }, {
            label: "Event Name",
            key: 'event',
            type: INPUT_FIELD,
        }];
        let BlockCalendarLayoutForm = Form.create()(DynamicFieldsForm);
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
            <BlockCalendarLayoutForm fields={fields} formProp={formProp} defaultValues={defaultValues}/>
        </Card>
    }
}
