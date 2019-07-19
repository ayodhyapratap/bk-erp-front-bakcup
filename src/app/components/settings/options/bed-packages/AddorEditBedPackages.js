import React from "react";
import {Redirect} from "react-router-dom";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card} from "antd";
import {
    INPUT_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD,
    SINGLE_IMAGE_UPLOAD_FIELD,
    SUCCESS_MSG_TYPE,
    MULTI_SELECT_FIELD
} from "../../../../constants/dataKeys";
import {TYPES_OF_BED_PACKAGES_ROOM_TYPE} from "../../../../constants/hardData";
import {displayMessage, getAPI, interpolate} from "../../../../utils/common";
import {BED_PACKAGES, ROOM_TYPE,TAXES} from "../../../../constants/api";

export default class AddorEditBedPackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPackage: this.props.editPackage ? this.props.editPackage : null,
            roomTypes: [],
            taxes: []
        }
    }

    componentDidMount() {
        this.loadRequiredData();
        this.loadTaxes();
    }

    loadRequiredData = () => {
        var that = this;
        let successFn = function (data) {
            that.setState({
                roomTypes: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(ROOM_TYPE, [this.props.active_practiceId]), successFn, errorFn);

    }
    loadTaxes() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                taxes: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(TAXES, [this.props.active_practiceId]), successFn, errorFn);

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
            key: 'no_of_days',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.no_of_days : null,
            type: NUMBER_FIELD,
            follow: 'INR'
        }, {
            label: "Normal Price",
            key: 'normal_price',
            required: true,
            initialValue: this.props.editPackage ?this.props.editPackage.normal_price.toFixed(): null,
            type: NUMBER_FIELD,
            follow: 'INR',
        }, {
            label: "Tatkal Price",
            key: 'tatkal_price',
            required: true,
            initialValue: this.props.editPackage ?this.props.editPackage.tatkal_price.toFixed(): null,
            type: NUMBER_FIELD,
            follow: 'INR'
        }, {
            label: "Image",
            key: 'image',
            initialValue: this.props.editPackage ? this.props.editPackage.image : null,
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        }, {
            label: "Room Type",
            key: 'room',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.room : null,
            type: SELECT_FIELD,
            options: this.state.roomTypes.map(room => Object.create({label: room.name, value: room.id}))
        },{
            label: "Taxes",
            key: 'taxes',
            required: true,
            initialValue: this.props.editPackage ? this.props.editPackage.taxes : [],
            type: MULTI_SELECT_FIELD,
            options: this.state.taxes.map(tax => Object.create({
                label: tax.name + "(" + tax.tax_value + "%)",
                value: tax.id
            }))
        }];
        let formProps = {
            method: "post",
            action: interpolate(BED_PACKAGES, [this.props.active_practiceId]),
            successFn: function () {
                displayMessage(SUCCESS_MSG_TYPE, "Package Saved Successfully");
                if (that.props.loadData)
                    that.props.loadData();
                that.props.history.push('/settings/bed-packages');
            }, errorFn: function () {

            }
        }
        let defaultValues = [];
        if (this.state.editPackage) {
            defaultValues.push({key: 'id', value: this.state.editPackage.id})
        }
        return <div>
            <Card>
                <BedPackageForm fields={fields} formProp={formProps}
                                defaultValues={defaultValues}
                                title={this.state.editPackage ? "Edit Bed Package" : "Add Bed Packages"} {...this.props}/>
            </Card>
        </div>
    }
}
