import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Card, Form} from "antd";
import { INPUT_FIELD, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {displayMessage,  interpolate} from "../../../../utils/common";
import {AGENT_ROLES} from "../../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddOrEditAgentRoles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editRole: this.props.editRole ? this.props.editRole : null
        }
    }

   

    render() {
        console.log(this.state);
        console.log("prop",this.props);
                
        let that = this;
        let AgentRolesForm = Form.create()(DynamicFieldsForm);
        let fields = [{
            label: "Role Name",
            key: 'name',
            required: true,
            initialValue: this.state.editRole ? this.state.editRole.name : null,
            type: INPUT_FIELD
        }];

        let formProp = {
            method: "post",
            action: interpolate(AGENT_ROLES, [that.props.active_practiceId]),
            successFn: function () {
                displayMessage(SUCCESS_MSG_TYPE, "Roles Saved Successfully");
                if (that.props.loadData)
                    that.props.loadData();
                that.props.history.push('/settings/agent-roles-roles');
            }, errorFn: function () {

            }
        }

        let editformProp;
        if (this.state.editRole) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                    that.props.loadData();
                    that.changeRedirect();
                },
                errorFn: function () {

                },
                action: interpolate(AGENT_ROLES, [this.props.match.params.id]),
                method: "put",

            }
        }


        let defaultValues = [];
        if (that.props.editRole) {
            defaultValues.push({key: 'id', value: that.props.editRole.id})
        }

        
        return <div>
            <Card>
                <Route exact path="/settings/agent-roles/:id/edit"
                    render={(route) => (this.props.match.params.id ?
                            <AgentRolesForm title={"Edit Agent Roles"} fields={fields} formProp={formProp} defaultValues={defaultValues} {...this.props} {...route} changeRedirect={this.changeRedirect}/>:
                            <Redirect to={"/settings/agent-roles-roles"} />
                        )}/>

                <Route exact path='/settings/agent-roles/add'
                       render={(route) => <AgentRolesForm defaultValues={defaultValues} title="Add Agent Roles" changeRedirect={this.changeRedirect}
                       formProp={formProp} fields={fields}/>}/>
            </Card>
            {this.state.redirect && <Redirect to={'/settings/agent-roles-roles'}/>}
        </div>
    }
}
