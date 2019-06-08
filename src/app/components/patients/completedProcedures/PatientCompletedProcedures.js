import React from "react";
import {Button, Card, Checkbox, Divider, Icon, Table, Popconfirm, Menu, Dropdown, Tag} from "antd";
import {getAPI, interpolate, putAPI, postAPI} from "../../../utils/common";
import {PROCEDURE_CATEGORY, PRODUCT_MARGIN, TREATMENTPLANS_API, SINGLE_REATMENTPLANS_API,TREATMENTPLANS_PDF} from "../../../constants/api";
import moment from "moment";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import {SELECT_FIELD} from "../../../constants/dataKeys";
import AddorEditDynamicCompletedTreatmentPlans from "./AddorEditDynamicCompletedTreatmentPlans";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {BACKEND_BASE_URL} from "../../../config/connect";

class PatientCompletedProcedures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            treatmentPlans: [],
            procedure_category: null,
            completedTreatmentPlans: [],
            incompletedTreatmentPlans:[],
            productMargin: [],
            loading: true
        }
        this.loadTreatmentPlans = this.loadTreatmentPlans.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.editTreatmentPlanData = this.editTreatmentPlanData.bind(this);
    }

    componentDidMount() {
        // if (this.props.match.params.id) {
            this.loadTreatmentPlans();
            this.loadProcedureCategory();
            this.loadProductMargin();
        // }
    }

    loadProductMargin() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                productMargin: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(PRODUCT_MARGIN, successFn, errorFn);
    }

    loadTreatmentPlans(page=1) {
        let incompleted = [];
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                return {
                    treatmentPlans: [...prevState.treatmentPlans, ...data.results],
                    next: data.next,
                    loading: false
                }
            })
            data.results.forEach(function (treatmentplan) {
                if (!treatmentplan.is_completed) {
                    incompleted.push(treatmentplan)
                }
            })
            that.setState(function (prevState) {
                return {
                    incompletedTreatmentPlans: [...prevState.incompletedTreatmentPlans, ...incompleted],
                    loading: false
                }
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        let apiParams = {
            page: page,
            practice: this.props.active_practiceId,
            complete:true
        };
        if (this.props.match.params.id) {
            apiParams.patient = this.props.match.params.id;
        }
        if (this.props.showAllClinic && this.props.match.params.id) {
            delete (apiParams.practice)
        }
        getAPI(TREATMENTPLANS_API, successFn, errorFn)
    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
    }


    editTreatmentPlanData(record) {
        console.log("array record", record);
        this.setState({
            editTreatmentPlan: record,
        });
        // console.log("props history",this.props);
        let id = this.props.match.params.id;
        this.props.history.push("/patient/" + id + "/emr/workdone/edit");

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

    loadPDF(id) {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(TREATMENTPLANS_PDF, [id]), successFn, errorFn);
    }

    render() {
        let that = this;
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
            return <div>
                <Switch>
                    <Route exact path='/patient/:id/emr/workdone/add'
                           render={(route) => <AddorEditDynamicCompletedTreatmentPlans {...this.state} {...route}/>}/>
                    <Route exact path='/patient/:id/emr/workdone/edit'
                           render={(route) => (this.state.editTreatmentPlan ?
                               <AddorEditDynamicCompletedTreatmentPlans {...this.state} {...route}
                                                                        editId={this.state.editTreatmentPlan.id}/> :
                               <Redirect to={"/patient/" + this.props.match.params.id + "/emr/workdone"}/>)}/>
                    <Card
                        title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Completed Procedures" : "Completed Procedures "}
                        extra={<Button.Group>
                            <Link to={"/patient/" + this.props.match.params.id + "/emr/workdone/add"}><Button><Icon
                                type="plus"/>Add</Button></Link>
                        </Button.Group>}>

                        {this.state.treatmentPlans.map((treatment) => <Card bodyStyle={{padding: 0}}
                                                                            style={{marginTop: 15}}>
                                <div style={{padding: 16}}>
                                    <h4>{treatment.date ? moment(treatment.date).format('ll') : null}
                                        <Dropdown.Button
                                            size={"small"}
                                            style={{float: 'right'}}
                                            overlay={<Menu>
                                                <Menu.Item key="1" onClick={() => that.editTreatmentPlanData(treatment)} disabled={(treatment.practice != this.props.active_practiceId)}>
                                                    <Icon type="edit"/>
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item key="2" onClick={() => that.deleteTreatmentPlans(treatment)} disabled={(treatment.practice != this.props.active_practiceId)}>
                                                    <Icon type="delete"/>
                                                    Delete
                                                </Menu.Item>
                                                <Menu.Divider/>
                                                <Menu.Item key="3">
                                                    <Icon type="clock-circle"/>
                                                    Patient Timeline
                                                </Menu.Item>
                                            </Menu>}>
                                            <a onClick={() => this.loadPDF(treatment.id)}><Icon type="printer"/></a>
                                        </Dropdown.Button>
                                    </h4>

                                </div>
                                <Table loading={this.state.loading} columns={columns}
                                       dataSource={treatment.treatment_plans}
                                       footer={() => treatmentFooter(treatment)}
                                       pagination={false}
                                       key={treatment.id}/>

                            </Card>
                        )}
                        <InfiniteFeedLoaderButton loaderFunction={() => this.loadTreatmentPlans(that.state.next)}
                                                  loading={this.state.loading}
                                                  hidden={!this.state.next}/>
                    </Card>
                </Switch>
            </div>
        }
        else {
            return <div>
                {this.state.treatmentPlans.map((treatment) => <Card bodyStyle={{padding: 0}}
                                                                    style={{marginTop: 15}}>
                        <div style={{padding: 16}}>
                            <h4>{treatment.date ? moment(treatment.date).format('ll') : null}
                                <Dropdown.Button
                                    size={"small"}
                                    style={{float: 'right'}}
                                    overlay={<Menu>
                                        <Menu.Item key="1" onClick={() => that.editTreatmentPlanData(treatment)} disabled={(treatment.practice != this.props.active_practiceId)}>
                                            <Icon type="edit"/>
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item key="2" onClick={() => that.deleteTreatmentPlans(treatment)} disabled={(treatment.practice != this.props.active_practiceId)}>
                                            <Icon type="delete"/>
                                            Delete
                                        </Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="3">
                                            <Icon type="clock-circle"/>
                                            Patient Timeline
                                        </Menu.Item>
                                    </Menu>}>
                                    <Icon type="printer"/>
                                </Dropdown.Button>
                            </h4>

                        </div>
                        <Table loading={this.state.loading} columns={columns}
                               dataSource={treatment.treatment_plans}
                               footer={() => treatmentFooter(treatment)}
                               pagination={false}
                               key={treatment.id}/>

                    </Card>
                )}
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadTreatmentPlans(that.state.next)}
                                          loading={this.state.loading}
                                          hidden={!this.state.next}/>
            </div>
        }

    }
}

export default PatientCompletedProcedures;

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
