import React from "react";
import {Checkbox, Table, Button, Card, Icon, Tag, Menu, Dropdown, Modal, Spin, Tooltip} from "antd";
import {Link} from "react-router-dom";
import {
    PROCEDURE_CATEGORY,
    TREATMENTPLANS_API,
    TREATMENTPLANS_MARK_COMPLETE_API,
    TREATMENTPLANS_PDF
} from "../../../constants/api";
import {getAPI, interpolate, displayMessage, postAPI} from "../../../utils/common";
import moment from "moment";
import {Redirect, Switch, Route} from "react-router";
import AddorEditDynamicTreatmentPlans from "./AddorEditDynamicTreatmentPlans";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {BACKEND_BASE_URL} from "../../../config/connect";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

const confirm = Modal.confirm;

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
        // if (this.props.match.params.id) {
        this.loadTreatmentPlans();
        this.loadProcedureCategory();
        // }

    }

    loadTreatmentPlans(page = 1) {
        let incompleted = [];
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1) {
                    return {
                        treatmentPlans: [...data.results],
                        next: data.next,
                        loading: false
                    }
                }
                return {
                    treatmentPlans: [...prevState.treatmentPlans, ...data.results],
                    next: data.next,
                    loading: false
                }
            });
            data.results.forEach(function (treatmentplan) {
                if (!treatmentplan.is_completed) {
                    incompleted.push(treatmentplan)
                }
            });
            that.setState(function (prevState) {
                if (data.current == 1) {
                    return {
                        incompletedTreatmentPlans: [...incompleted],
                        loading: false
                    }
                }
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

        };
        let apiParams = {
            page: page,
            practice: this.props.active_practiceId
        };
        if (this.props.match.params.id) {
            apiParams.patient = this.props.match.params.id;
        }
        if (this.props.showAllClinic && this.props.match.params.id) {
            delete (apiParams.practice)
        }
        getAPI(TREATMENTPLANS_API, successFn, errorFn, apiParams)

    }


    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,

            })

        }
        let errorFn = function () {
            that.setState({})

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
    }


    editTreatmentPlanData(record) {
        console.log("record",record.id);
        this.setState({
            editTreatmentPlan: record,
            loading: false
        });
        let id = record.patient;
        this.props.history.push("/patient/" + record.id + "/emr/plans/edit")

    }


    deleteTreatmentPlans(record) {
        let that = this;
        confirm({
            title: 'Are you sure to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {
                    id: record.id,
                    patient: record.patient.id,
                    is_active: false,
                }
                let successFn = function (data) {
                    that.loadTreatmentPlans();
                    displayMessage(SUCCESS_MSG_TYPE, "Treatment Plan Deleted Successfully!");

                }
                let errorFn = function () {

                };
                postAPI(interpolate(TREATMENTPLANS_API, [that.props.match.params.id], null), reqData, successFn, errorFn);
            },
            onCancel() {
                console.log('Cancel');
            },
        });


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
        postAPI(interpolate(TREATMENTPLANS_MARK_COMPLETE_API, [this.props.match.params.id]), reqData, successFn, errorFn)
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
            title: '',
            key: 'is_completed',
            render: (text, record) => (record.is_completed ?
                <Icon type="check-circle" theme="twoTone" style={{marginLeft: '8px', fontSize: '20px'}}/> :
                <Checkbox key={record.id}
                          onChange={(e) => this.treatmentCompleteToggle(record.id, e.target.checked)}
                          value={this.state.selectedTreatments[record.id]}/>)
        }, {
            title: 'Procedure',
            dataIndex: 'procedure',
            key: 'procedure',
            render: (text, record) => (
                <span> {text.name}</span>
            )
        }, {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        }, {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        }, {
            title: 'Cost per  Unit',
            dataIndex: 'cost',
            key: 'cost',
        }, {
            title: 'Notes',
            dataIndex: 'default_notes',
            key: 'default_notes',
        }];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/plans/add'
                       render={(route) => <AddorEditDynamicTreatmentPlans {...this.state} {...route} {...that.props}
                                                                          loadData={this.loadTreatmentPlans}/>}/>
                <Route exact path='/patient/:id/emr/plans/edit'
                       render={(route) => (this.state.editTreatmentPlan ?
                           <AddorEditDynamicTreatmentPlans {...this.state} {...route} {...that.props}
                                                           loadData={this.loadTreatmentPlans}
                                                           editId={this.state.editTreatmentPlan.id}/> :
                           <Redirect to={"/patient/" + this.props.match.params.id + "/emr/plans"}/>)}/>
                <div>
                    <Card
                        bodyStyle={{padding: 0}}
                        title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " TreatmentPlans" : "TreatmentPlans"}
                        extra={<Button.Group>
                            <Button onClick={this.submitCompleteTreatment}>
                                <Icon type="save"/>Save
                            </Button>
                            <Link to={"/patient/" + this.props.match.params.id + "/emr/plans/add"}>
                                <Button type={"primary"}>
                                    <Icon type="plus"/>Add
                                </Button>
                            </Link>
                        </Button.Group>
                        }/>
                    <Spin spinning={this.state.loading}>
                        {this.state.treatmentPlans.map((treatment) => <Card bodyStyle={{padding: 0}}
                                                                            style={{marginTop: 15}}>
                                <div style={{padding: 16}}>
                                    <h4>{treatment.date ? moment(treatment.date).format('ll') : null}
                                        <Dropdown.Button
                                            size={"small"}
                                            style={{float: 'right'}}
                                            overlay={<Menu>
                                                <Menu.Item key="1" onClick={() => that.editTreatmentPlanData(treatment)}
                                                           disabled={(treatment.practice && treatment.practice.id != this.props.active_practiceId)}>
                                                    <Icon type="edit"/>
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item key="2" onClick={() => that.deleteTreatmentPlans(treatment)}
                                                           disabled={(treatment.practice && treatment.practice.id != this.props.active_practiceId)}>
                                                    <Icon type="delete"/>
                                                    Delete
                                                </Menu.Item>
                                                <Menu.Divider/>
                                                <Menu.Item key="3">
                                                    <Link to={"/patient/" + treatment.patient + "/emr/timeline"}>
                                                        <Icon type="clock-circle"/>
                                                        &nbsp;
                                                        Patient Timeline
                                                    </Link>
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
                        )}</Spin>
                    <InfiniteFeedLoaderButton loaderFunction={() => this.loadTreatmentPlans(that.state.next)}
                                              loading={this.state.loading}
                                              hidden={!this.state.next}/>
                </div>
            </Switch>

            </div>
        } else {
            return <div>
                <Card
                    bodyStyle={{padding: 0}}
                    title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " TreatmentPlans" : "TreatmentPlans"}
                    extra={<Button.Group>
                        <Button onClick={this.submitCompleteTreatment}>
                            <Icon type="save"/>Save
                        </Button>
                        <Button type={"primary"} onClick={() => this.props.togglePatientListModal(true)}>
                            <Icon type="plus"/>Add
                        </Button>
                    </Button.Group>
                    }/>
                <Spin spinning={this.state.loading}>
                    {this.state.treatmentPlans.map((treatment) => <Card bodyStyle={{padding: 0}}
                                                                        key={treatment.id}
                                                                        style={{marginTop: 15}}>
                            <div style={{padding: 16}}>
                                <h4>{treatment.date ? moment(treatment.date).format('ll') : null} 
                                <Link to={"/patient/" + treatment.patient.id + "/emr/plans"}>
                                    &nbsp;&nbsp; {treatment.patient.user?treatment.patient.user.first_name:null} (ID: {treatment.patient.custom_id?treatment.patient.custom_id:treatment.patient.id})&nbsp;
                                </Link>
                                <span>, {treatment.patient.gender}</span>
                                    
                                    <Dropdown.Button
                                        size={"small"}
                                        style={{float: 'right'}}
                                        overlay={<Menu>
                                            <Menu.Item key="1" disabled={(treatment.practice && treatment.practice.id != this.props.active_practiceId)}>
                                                <Link to={"/patient/" + treatment.patient.id + "/emr/plans/edit"}>
                                                    <Icon type="edit"/>
                                                    &nbsp;
                                                    Edit
                                                </Link> 
                                            </Menu.Item>
                                            <Menu.Item key="2" onClick={() => that.deleteTreatmentPlans(treatment)}
                                                       disabled={(treatment.practice && treatment.practice.id != this.props.active_practiceId)}>
                                                <Icon type="delete"/>
                                                Delete
                                            </Menu.Item>
                                            <Menu.Divider/>
                                            <Menu.Item key="3">
                                                <Link to={"/patient/" + treatment.patient + "/emr/timeline"}>
                                                    <Icon type="clock-circle"/>
                                                    &nbsp;
                                                    Patient Timeline
                                                </Link>
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
                </Spin>
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadTreatmentPlans(that.state.next)}
                                          loading={this.state.loading}
                                          hidden={!this.state.next}/>
            </div>
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
            {presc.practice ? <Tag style={{float: 'right'}}>
                <Tooltip title="Practice Name">
                    <b>{presc.practice.name} </b>
                </Tooltip>
            </Tag> : null}
        </div>
    }
    return null
}
