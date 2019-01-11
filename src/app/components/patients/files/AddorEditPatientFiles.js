import React from "react";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Form} from "antd";

export default class AddorEditPatientFiles extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const PatientFilesForm = Form.create()(DynamicFieldsForm);

        return <div>
            <PatientFilesForm title="Add Files"/>
        </div>
    }
}
