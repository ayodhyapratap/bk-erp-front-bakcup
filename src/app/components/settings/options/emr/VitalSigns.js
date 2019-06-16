import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Card, Form, Divider, Row,Popconfirm,Table} from "antd";
import {SUCCESS_MSG_TYPE,SELECT_FIELD} from "../../../../constants/dataKeys";
import {VITAL_SIGNS_API, EMR_VITAL_SIGNS} from "../../../../constants/api"
import {getAPI, interpolate, displayMessage} from "../../../../utils/common";
// import CustomizedTable from "../../../common/CustomizedTable";
import {DEFAULT_TEMPERATURE_IN,DEFAULT_BP_METHOD,DEFAULT_TEMPERATURE_METHOD} from "../../../../constants/hardData";

class VitalSigns extends React.Component {  
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            // vitalSign: null,
            // editVitalSign: this.props.editVitalSign ? this.props.editVitalSign : null,

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        console.log("Working or not");

    }


    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that =this;
        const columns = [{
            title: 'Temperature In',
            dataIndex: 'default_temperature',
            key: 'default_temperature',
        }, {
            title:'Temperature Measurement Method',
            dataIndex:'',
            key:''
        },
        {
            title:'BP Measurement Method',
            dataIndex:'',
            key:''
        }
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (text, record) => (
        //         <span>
        //       <a onClick={() => this.editFunction(record)}>  Edit</a>
        //         <Divider type="vertical"/>
        //             <Popconfirm title="Are you sure delete this item?"
        //                         onConfirm={() => that.deleteObject(record)} okText="Yes" cancelText="No">
        //               <a>Delete</a>
        //           </Popconfirm>
        //       </span>
        //     ),
        // }
    ];
        
        const fields = [{
            label: "Default temperature measurement in",
            key: "temperature_unit",
            type: SELECT_FIELD,
            options: DEFAULT_TEMPERATURE_IN.map(Temp_in => ({label: Temp_in.label, value: Temp_in.value}))
        }, {
            label: "Default temperature measurement method",
            key: "temperature_method",
            type: SELECT_FIELD,
            options: DEFAULT_TEMPERATURE_METHOD.map(TempMethod =>({label:TempMethod.label ,value:TempMethod.value}))
        },{
            label: "Default blood pressure measurement method",
            key: "blood_pressure_method",
            type: SELECT_FIELD,
            options:DEFAULT_BP_METHOD.map(BPMETHOD =>({label:BPMETHOD.label , value:BPMETHOD.value}))
        }];


        let editformProp;
        let defaultValues = [{ key: 'practice', value: this.props.active_practiceId}];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if (this.state.editVitalSign) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success")
                },
                errorFn: function () {

                },
                action: interpolate(EMR_VITAL_SIGNS, [this.props.active_practiceId]),
                method: "post",
            }
            defaultValues.push({"key": "id", "value": this.state.editVitalSign.id})
        }
        const formProp = {
            successFn: function (data) {

                displayMessage(SUCCESS_MSG_TYPE, "success")
            },
            errorFn: function () {

            },
            action: interpolate(EMR_VITAL_SIGNS, [this.props.active_practiceId]),
            method: "post",
        }


        return <Row>
            <Card>
                <TestFormLayout defaultValues={defaultValues} formProp={formProp} fields={fields}/>
                <Divider/>
                <Table loading={this.state.loading} columns={columns} dataSource={this.state.data}/>
            </Card>
        </Row>

    }
}

export default VitalSigns;
