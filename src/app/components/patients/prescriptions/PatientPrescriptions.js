import React from "react";
import {
    Table,
    Button,
    Card,
    Icon,
    Tag, Menu,
    Dropdown, Modal, Tooltip, Spin, Row
} from "antd";
import {Link} from "react-router-dom";
import {
    PRESCRIPTIONS_API,
    DRUG_CATALOG,
    PATIENT_PROFILE,
    PATIENTS_LIST,
    PRESCRIPTION_PDF
} from "../../../constants/api";
import {getAPI, interpolate, displayMessage, postAPI, putAPI} from "../../../utils/common";
import moment from "moment";
import {Redirect, Switch, Route} from "react-router";
import AddorEditDynamicPatientPrescriptions from "./AddorEditDynamicPatientPrescriptions";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {BACKEND_BASE_URL} from "../../../config/connect";

const confirm = Modal.confirm;

class PatientPrescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            prescription: [],
            drug_catalog: null,
            editPrescription: null,
            loading: true
        }
        this.loadPrescriptions = this.loadPrescriptions.bind(this);
        this.loadDrugCatalog = this.loadDrugCatalog.bind(this);
        this.editPrescriptionData = this.editPrescriptionData.bind(this);
        this.deletePrescriptions = this.deletePrescriptions.bind(this);

    }

    componentDidMount() {
        // if (this.props.match.params.id) {
        this.loadPrescriptions();
        this.loadDrugCatalog();
        // }

    }

    loadPrescriptions(page = 1) {
        let that = this;
        this.setState({
            loading:true
        })
        let successFn = function (data) {
            that.setState({
                prescription: data.results,
                nextPrescriptionPage: data.next,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
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
        getAPI(PRESCRIPTIONS_API, successFn, errorFn, apiParams)
    }

    loadPDF(id) {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(PRESCRIPTION_PDF, [id]), successFn, errorFn);
    }


    loadDrugCatalog() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drug_catalog: data,
            })

        }
        let errorFn = function () {
            that.setState({
            })

        }
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn)
    }

    editPrescriptionData(record) {
        let that = this;
        this.setState({
            editPrescription: record,
        }, function () {
            that.props.history.push("/patient/" + record.patient + "/emr/prescriptions/edit")
        });


    }

    deletePrescriptions(record) {
        let that = this;
        confirm({
            title: 'Are you sure to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {"id": record.id, patient: record.patient, is_active: false};
                let successFn = function (data) {
                    that.loadPrescriptions();
                }
                let errorFn = function () {
                }
                postAPI(interpolate(PRESCRIPTIONS_API, [that.props.match.params.id]), reqData, successFn, errorFn);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    render() {
        const drugs = {}
        if (this.state.drug_catalog) {

            this.state.drug_catalog.forEach(function (drug) {
                drugs[drug.id] = (drug.name + "," + drug.strength)
            })
        }
        let that = this;
        const columns = [{
            title: 'Drug',
            key: 'name',
            dataIndex: 'name',
        }, {
            title: 'Frequency',
            dataIndex: 'frequency',
            key: 'frequency',
            render: (frequency, record) => <span>{record.dosage}&nbsp;{record.frequency}</span>
        }, {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration, record) => <span>{duration}&nbsp;{record.duration_type}</span>
        }, {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
            render: (instruction, record) => <span>
                    {record.before_food ? <Tag>before food </Tag> : null}
                {record.after_food ? <Tag>after food</Tag> : null}
                {instruction}
                </span>
        }];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/prescriptions/add'
                       render={(route) => <AddorEditDynamicPatientPrescriptions {...this.state}
                                                                                loadData={this.loadPrescriptions}
                                                                                {...route}/>}/>
                <Route exact path='/patient/:id/emr/prescriptions/edit'
                       render={(route) => (that.state.editPrescription ?
                           <AddorEditDynamicPatientPrescriptions {...this.state} {...route}
                                                                 loadData={this.loadPrescriptions}
                                                                 editId={that.state.editPrescription.id}/> :
                           <Redirect to={"/patient/" + that.props.match.params.id + "/emr/prescriptions"}/>)}/>
                <Route>
                    <div>
                        <Card
                            bodyStyle={{padding: 0}}
                            title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Prescriptions" : "Prescriptions"}
                            extra={<Button.Group style={{float: 'right'}}>
                                <Link to={"/patient/" + this.props.match.params.id + "/emr/prescriptions/add"}>
                                    <Button type={"primary"}><Icon type="plus"/>Add</Button>
                                </Link>
                            </Button.Group>}/>

                        {this.state.prescription.map((presc) => <div>
                            <Card style={{marginTop: 20}}
                                  bodyStyle={{padding: 0}}>
                                <div style={{padding: 16}}>
                                    <h4>{presc.date ? moment(presc.date).format('ll') : null}
                                        <Dropdown.Button
                                            size={"small"}
                                            style={{float: 'right'}}
                                            overlay={<Menu>
                                                <Menu.Item key="1" onClick={() => that.editPrescriptionData(presc)}
                                                           disabled={(presc.practice && presc.practice.id != that.props.active_practiceId)}>
                                                    <Icon type="edit"/>
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item key="2" onClick={() => that.deletePrescriptions(presc)}
                                                           disabled={(presc.practice && presc.practice.id != that.props.active_practiceId)}>
                                                    <Icon type="delete"/>
                                                    Delete
                                                </Menu.Item>
                                                <Menu.Divider/>
                                                <Menu.Item key="3">
                                                    <Link to={"/patient/" + presc.patient + "/emr/timeline"}>
                                                        <Icon type="clock-circle"/>
                                                        &nbsp;
                                                        Patient Timeline
                                                    </Link>
                                                </Menu.Item>
                                            </Menu>}>
                                            <a onClick={() => this.loadPDF(presc.id)}><Icon type="printer"/></a>
                                        </Dropdown.Button>
                                    </h4>
                                </div>
                                <Table columns={columns} dataSource={presc.drugs} pagination={false}
                                       footer={() => prescriptonFooter(presc)}
                                       key={presc.id}/>
                            </Card>
                        </div>)}
                        <Spin spinning={this.state.loading}>
                            <Row>
                            </Row>
                        </Spin>
                        <InfiniteFeedLoaderButton loading={this.state.loading}
                                                  loaderFunction={() => this.loadPrescriptions(this.state.nextPrescriptionPage)}
                                                  hidden={!this.state.nextPrescriptionPage}/>
                    </div>
                </Route>
            </Switch>

            </div>
        }
        else {
            return <div>
                {this.state.prescription.map((presc) => <div key={presc.id}>

                    <Card style={{margin: 10, marginBottom: 20}}
                          bodyStyle={{padding: 0}}>
                        <div style={{padding: 16}}>
                            <h4>{presc.date ? moment(presc.date).format('ll') : null}
                                <Dropdown.Button

                                    size={"small"}
                                    style={{float: 'right'}}
                                    overlay={<Menu>
                                        <Menu.Item key="1" onClick={() => that.editPrescriptionData(presc)}
                                                   disabled={(presc.practice && presc.practice.id != that.props.active_practiceId)}>
                                            <Icon type="edit"/>
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item key="2" onClick={() => that.deletePrescriptions(presc)}
                                                   disabled={(presc.practice && presc.practice.id != that.props.active_practiceId)}>
                                            <Icon type="delete"/>
                                            Delete
                                        </Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="3">
                                            <Link to={"/patient/" + presc.patient + "/emr/timeline"}>
                                                <Icon type="clock-circle"/>
                                                &nbsp;
                                                Patient Timeline
                                            </Link>
                                        </Menu.Item>
                                    </Menu>}>
                                    <a onClick={() => this.loadPDF(presc.id)}><Icon type="printer"/></a>
                                </Dropdown.Button>
                            </h4>

                        </div>
                        <Table columns={columns} dataSource={presc.drugs} pagination={false}
                               footer={() => prescriptonFooter(presc)}
                               key={presc.id}/>
                    </Card></div>)}
                <Spin spinning={this.state.loading}>
                    <Row>
                    </Row>
                </Spin>
                <InfiniteFeedLoaderButton loading={this.state.loading}
                                          loaderFunction={() => this.loadPrescriptions(this.state.nextPrescriptionPage)}
                                          hidden={!this.state.nextPrescriptionPage}/>
            </div>
        }

    }
}

export default PatientPrescriptions;

function prescriptonFooter(presc) {
    if (presc) {

        return <div>
            {presc.doctor ? <Tooltip title="Doctor"><Tag color={presc.doctor ? presc.doctor.calendar_colour : null}>
                <b>{"prescribed by  " + presc.doctor.user.first_name} </b>
            </Tag></Tooltip> : null}
            {presc.practice ? <Tag style={{float: 'right'}}>
                <Tooltip title="Practice Name">
                    <b>{presc.practice.name} </b>
                </Tooltip>
            </Tag> : null}
            {presc.labs.length ? <div>
                +{presc.labs.length}&nbsp;Lab Orders
                {/*<Divider style={{margin:0}}/>*/}
            </div> : null}
        </div>
    }
    return null
}

function prescriptionHeader(presc) {
    if (presc) {
        return <span>{presc.date ? moment(presc.date).format('lll') : null}</span>
    }
    return null;
}
