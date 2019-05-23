import React from "react";
import {Redirect} from "react-router-dom";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card} from "antd";
import {
    INPUT_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD,
    SINGLE_IMAGE_UPLOAD_FIELD,
    SUCCESS_MSG_TYPE
} from "../../../../constants/dataKeys";
import {TYPES_OF_BED_PACKAGES_ROOM_TYPE} from "../../../../constants/hardData";
import {displayMessage} from "../../../../utils/common";

export default class AddorEditBedPackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPackage: this.props.editPackage ? this.props.editPackage : null
        }
    }

    render() {
        let that = this;
        let BedPackageForm = Form.create()(DynamicFieldsForm);
        let fields = [{
            label: "Package Name",
            key: 'name',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.name : null,
            type: INPUT_FIELD
        }, {
            label: "Days of Booking",
            key: 'days',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.days : null,
            type: NUMBER_FIELD,
            follow: 'INR'
        }, {
            label: "Normal Price",
            key: 'normal_price',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.normal_price : null,
            type: NUMBER_FIELD,
            follow: 'INR'
        }, {
            label: "Tatkal Price",
            key: 'tatkal_price',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.tatkal_price : null,
            type: NUMBER_FIELD,
            follow: 'INR'
        }, {
            label: "Image",
            key: 'image',
            initialValue: this.props.editPackage ? this.props.editPackage.image : null,
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        }, {
            label: "Room Type",
            key: 'room_type',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.room_type : null,
            type: SELECT_FIELD,
            options: TYPES_OF_BED_PACKAGES_ROOM_TYPE
        }];
        let formProps = {
            method: "post",
            action: '',
            successFn: function () {
                displayMessage(SUCCESS_MSG_TYPE, "Package Saved Successfully");
                if (that.props.loadData)
                    that.props.loadData();
                that.props.history.push('/settings/bed-packages');
            }, errorFn: function () {

            }
        }
        return <div>
            <Card>
                <BedPackageForm fields={fields} formProps={formProps} title={"Add Bed Packages"} {...this.props}/>
            </Card>
        </div>
    }
}
