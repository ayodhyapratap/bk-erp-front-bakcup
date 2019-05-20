import React from "react";
import {
    Avatar,
    Input,
    Checkbox,
    Divider,
    Table,
    Col,
    Button,
    Form,
    Row,
    Card,
    Icon,
    Skeleton,
    Popconfirm,
    Tag
} from "antd";
import {Link} from "react-router-dom";
import {
    PROCEDURE_CATEGORY,
    PATIENT_PROFILE,
    SINGLE_REATMENTPLANS_API,
    TREATMENTPLANS_API
} from "../../../constants/api";
import {getAPI, interpolate, displayMessage, putAPI, postAPI} from "../../../utils/common";
import moment from "moment";
import AddorEditPatientTreatmentPlans from './AddorEditPatientTreatmentPlans';
import {Redirect, Switch, Route} from "react-router";
import AddorEditDynamicTreatmentPlans from "./AddorEditDynamicTreatmentPlans";


class PatientTreatmentPlans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            treatmentPlans: [],
            procedure_category: null,
            incompletedTreatmentPlans: [],
            loading: true,
            selectedTreatments: {}
        }
        this.loadTreatmentPlans = this.loadTreatmentPlans.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.editTreatmentPlanData = this.editTreatmentPlanData.bind(this);
        this.submitCompleteTreatment = this.submitCompleteTreatment.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.loadTreatmentPlans();
            this.loadProcedureCategory();
        }

    }

    loadTreatmentPlans() {
        let incompleted = [];
        let that = this;
        let successFn = function (data) {
            that.setState({
                treatmentPlans: data,
                loading: false
            })
            data.forEach(function (treatmentplan) {
                if (!treatmentplan.is_completed) {
                    incompleted.push(treatmentplan)
                }
            })
            that.setState({
                incompletedTreatmentPlans: incompleted,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(TREATMENTPLANS_API, [this.props.match.params.id, null]), successFn, errorFn)
    }


    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
                loading: false
            })

        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
    }


    editTreatmentPlanData(record) {
        this.setState({
            editTreatmentPlan: record,
            loading: false
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/emr/plans/edit")

    }


    deleteTreatmentPlans(record) {
        let that = this;
        let obj = {...record, is_active: false}
        let reqData = {
            treatment: [],
            patient: that.props.match.params.id
        }
        reqData.treatment.push(obj);

        let successFn = function (data) {
            that.loadTreatmentPlans();
        }
        let errorFn = function () {

        };
        postAPI(interpolate(TREATMENTPLANS_API, [that.props.match.params.id], null), reqData, successFn, errorFn);
    }

    treatmentCompleteToggle(id, option) {
        this.setState(function (prevState) {
            return {selectedTreatments: {...prevState.selectedTreatments, [id]: !!option}}
        });
    }

    submitCompleteTreatment() {
        let that = this;
        let selectedTreatments = this.state.selectedTreatments;
        let treatmentKeys = Object.keys(selectedTreatments);
        // let reqTreatmentsArray = [];
        let reqData = {
            treatment: [],
            patient: that.props.match.params.id
        };
        treatmentKeys.forEach(function (item) {
            let treatmentObj = {id: item, is_completed: selectedTreatments[item]};
            reqData.treatment.push(treatmentObj);
        });
        let successFn = function (data) {
            that.loadTreatmentPlans();
            that.setState({
                selectedTreatments: {}
            })
        }
        let errorFn = function () {

        }
        // console.log("Data",JSON.stringify(reqData));
        postAPI(interpolate(TREATMENTPLANS_API, [this.props.match.params.id]), reqData, successFn, errorFn)
    }

    render() {

        const procedures = {}
        if (this.state.procedure_category) {
            this.state.procedure_category.forEach(function (procedure) {
                procedures[procedure.id] = (procedure.name)
            })
        }
        console.log(this.state.procedure_category);

        const columns = [{
            title: '',
            key: 'is_completed',
            render: (text, record) => (record.is_completed ?
                    <Icon type="check-circle" theme="twoTone" style={{marginLeft: '8px', fontSize: '20px'}}/> :
                    <Checkbox onChange={(e) => this.treatmentCompleteToggle(record.id, e.target.checked)}
                              value={this.state.selectedTreatments[record.id]}/>
            )
        }, {
            title: 'Procedure',
            key: 'procedure.name',
            dataIndex: 'procedure.name',

        }, {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        }, {
            title: 'Cost per  Unit',
            dataIndex: 'cost',
            key: 'cost',
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
                       render={(route) => <AddorEditDynamicTreatmentPlans {...this.state} {...route}/>}/>
                <Route exact path='/patient/:id/emr/plans/edit'
                       render={(route) => <AddorEditPatientTreatmentPlans {...this.state} {...route}/>}/>
                <div>
                    <Card
                        title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " TreatmentPlans" : "TreatmentPlans"}
                        extra={<Button.Group>
                            <Button onClick={this.submitCompleteTreatment}> <Icon type="save"/>Save</Button>
                            <Link to={"/patient/" + this.props.match.params.id + "/emr/plans/add"}>
                                <Button><Icon type="plus"/>Add</Button>
                            </Link>
                        </Button.Group>
                        }/>
                    {this.state.treatmentPlans.map((treatment) => <Card bodyStyle={{padding: 0}}
                                                                        style={{marginTop: 15}}>
                            <h4>{treatment.date ? moment(treatment.date).format('lll') : null}</h4>
                            <Table loading={this.state.loading} columns={columns}
                                   dataSource={treatment.treatment_plans}
                                   footer={() => treatmentFooter(treatment)}
                                   pagination={false}
                                   key={treatment.id}/>

                        </Card>
                    )}
                </div>
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

export default PatientTreatmentPlans;


function treatmentFooter(presc) {
    if (presc) {

        return <div>
            {presc.doctor ? <Tag color={presc.doctor ? presc.doctor.calendar_colour : null}>
                <b>{"prescribed by  " + presc.doctor.user.first_name} </b>
            </Tag> : null}
        </div>
    }
    return null
}
