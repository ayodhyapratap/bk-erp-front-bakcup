import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card, message} from "antd";
import {
    CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    NUMBER_FIELD
} from "../../../../constants/dataKeys";
import {PROCEDURE_CATEGORY, TAXES} from "../../../../constants/api"
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";
import {Redirect} from "react-router-dom";

class EditProcedure extends React.Component {
    constructor(props) {
      
        super(props);
        this.state = {
            taxes: [],
            procedure_category: [],
            redirect:false
        }
        this.loadTaxes = this.loadTaxes.bind(this);
        this.loadProcedures = this.loadProcedures.bind(this)
        this.loadTaxes();
        this.loadProcedures();
    }
    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    componentDidMount() {
       
        if (this.props.match.params.id) {
          
                this.loadProcedures(this.props.match.params.id);
          
        }
    }
    loadProcedures(id) {
        var that = this;
        var url=`${interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId])}/${id}`;
        console.log("url",url);
        let successFn = function (data) {
            console.log("get table",data);
            that.setState({
                procedure_category: data,
            })
        };
        let errorFn = function () {
        };
        
        getAPI(url, successFn, errorFn);
    }

    loadTaxes() {
        let that = this;
        let successFn = function (data) {
            console.log(data.map(tax => Object.create({
                    label: tax.name,
                    value: tax.id
                })
            ));
            that.setState({
                taxes: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(TAXES, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        let that = this;
        const formFields = [{
            label: "Procedure Name",
            key: "name",
            required: true,
            //initialValue:
            type: INPUT_FIELD
        }, {
            label: "Procedure Cost",
            key: "cost",
            follow: "INR",
            required: true,
            type: NUMBER_FIELD,
        }, {
            label: "Applicable Taxes",
            key: "taxes",
            type: CHECKBOX_FIELD,
            options: this.state.taxes.map(tax => Object.create({
                    label: tax.name,
                    value: tax.id
                })
            )
        }, {
            label: "Add Under",
            key: "under",
            type: SELECT_FIELD,
            options: [{
                label: "None",
                value: null
            }].concat(this.state.procedure_category.map(procedure => Object.create({
                label: procedure.name,
                value: procedure.id
            }))),
            initialValue: null
        }, {
            label: "Default Note",
            key: "default_notes",
            type: INPUT_FIELD
        },];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, 'success');
                that.changeRedirect();

            },
            errorFn: function () {

            },
            action: interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]),
            method: "post",
        }

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <Card>
                <TestFormLayout title="Edit Procedure" changeRedirect={this.changeRedirect}  formProp={formProp} fields={formFields}/>
                {this.state.redirect && <Redirect to='/settings/procedures'/>}
            </Card>
        </div>
    }
}

export default EditProcedure;
