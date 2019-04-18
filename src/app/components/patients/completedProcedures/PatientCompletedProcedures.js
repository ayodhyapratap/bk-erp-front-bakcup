import React from "react";
import {Button, Card, Checkbox, Divider, Icon, Table, Popconfirm} from "antd";
import {getAPI, interpolate, putAPI} from "../../../utils/common";
import {PROCEDURE_CATEGORY, PRODUCT_MARGIN, TREATMENTPLANS_API, SINGLE_REATMENTPLANS_API} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import AddorEditPatientTreatmentPlans from "../treatmentPlans/AddorEditPatientTreatmentPlans";
import {Link} from "react-router-dom";
import {SELECT_FIELD} from "../../../constants/dataKeys";

class PatientCompletedProcedures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            treatmentPlans: [],
            procedure_category: null,
            completedTreatmentPlans: [],
            productMargin: [],
            loading:true
        }
        this.loadtreatmentPlanss = this.loadtreatmentPlanss.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.editTreatmentPlanData = this.editTreatmentPlanData.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.loadtreatmentPlanss();
            this.loadProcedureCategory();
            this.loadProductMargin();
        }
    }

    loadProductMargin() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                productMargin: data,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })
        }
        getAPI(PRODUCT_MARGIN, successFn, errorFn);
    }

    loadtreatmentPlanss() {
        let completed = [];
        let that = this;
        let successFn = function (data) {
            that.setState({
                treatmentPlans: data,
                loading:false
            })
            data.forEach(function (treatmentplan) {
                if (treatmentplan.is_completed) {
                    completed.push(treatmentplan)
                }
            })
            that.setState({
                completedTreatmentPlans: completed,
                loading:false
            })
                console.log("woow",that.state.completedTreatmentPlans);
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })
        }
        getAPI(interpolate(TREATMENTPLANS_API, [this.props.match.params.id]), successFn, errorFn)
    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
                loading:false
            })
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
    }


    editTreatmentPlanData(record) {
        console.log("array record",record);
        this.setState({
            editTreatmentPlan: record,
        });
        let id = this.props.match.params.id;
        this.props.history.push("/patient/" + id + "/emr/plans/edit")

    }
    

    deleteTreatmentPlans(record) {
      let that = this;
      let reqData = record;
      reqData.is_active = false;
      let successFn = function (data) {
        that.loadData();
      }
      let errorFn = function () {

      };
      putAPI(interpolate(SINGLE_REATMENTPLANS_API, [record.id]), reqData, successFn, errorFn);
    }

    render() {
        const procedures = {}
        if (this.state.procedure_category) {
            this.state.procedure_category.forEach(function (procedure) {
                procedures[procedure.id] = (procedure.name)
            })

        }

        const columns = [{
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at => <span>{moment(created_at).format('LLL')}</span>,
        }, {
            title: 'Procedure',
            key: 'procedure',
            initialValue: (this.state.editFields ? this.state.editFields.procedure : null),
            render: (text, record) => (
                <span> {procedures[record.procedure]}</span>
            )
        }, {
            title: 'Quantity',
            dataIndex: 'quantity',
            initialValue: (this.state.editFields ? this.state.editFields.quantity : null),
            key: 'quantity',
        }, {
            title: 'Cost Per  Unit',
            dataIndex: 'cost',
            initialValue: (this.state.editFields ? this.state.editFields.cost : null),
            key: 'cost',
        }, {
            label: 'MLM Margin Type',
            type: SELECT_FIELD,
            initialValue: (this.state.editFields ? this.state.editFields.margin : null),
            key: 'margin',
            required: true,
            options: this.state.productMargin.map(margin => ({label: margin.name, value: margin.id}))
        }, {
            title: 'Active',
            key: 'is_active',
            initialValue: (this.state.editFields ? this.state.editFields.is_active : null),
            render: (text, record) => (
                <Checkbox disabled checked={record.is_active}/>
            )
        }, {
            title: 'Completed',
            key: 'is_completed',
            initialValue: (this.state.editFields ? this.state.editFields.is_completed : null),
            render: (text, record) => (
                <Checkbox disabled checked={record.is_completed}/>
            )
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
               <a onClick={() => this.editTreatmentPlanData(record)}>Edit</a>

                <Divider type="vertical"/>
               <Popconfirm title="Are you sure delete this item?"
                            onConfirm={() => this.deleteTreatmentPlans(record)} okText="Yes" cancelText="No">
                    <a>Delete</a>
                </Popconfirm>
              </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/plans/add'
                       render={(route) => <AddorEditPatientTreatmentPlans{...this.state} {...route}/>}/>
                <Route exact path='/patient/:id/emr/plans/edit'
                       render={(route) => <AddorEditPatientTreatmentPlans {...this.state} {...route}/>}/>
                <Card
                    title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Completed Procedures" : "Completed Procedures "}
                    extra={<Button.Group>
                        <Link to={"/patient/" + this.props.match.params.id + "/emr/plans/add"}><Button><Icon
                            type="plus"/>Add</Button></Link>
                    </Button.Group>}>

                    <Table loading={this.state.loading} columns={columns} dataSource={this.state.completedTreatmentPlans}/>

                </Card>
            </Switch>

            </div>
        }
        else {
            return <Card>
                <h2> select patient to further continue</h2>
            </Card>
        }

    }
}

export default PatientCompletedProcedures;
