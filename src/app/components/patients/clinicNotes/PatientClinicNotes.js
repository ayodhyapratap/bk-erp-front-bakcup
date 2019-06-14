import {Button, Card, Checkbox, Divider, Icon, Table, Dropdown, Menu, Col, Row, Tag, Spin, Tooltip} from "antd";
import React from "react";
import {getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {INVOICES_API, PATIENT_CLINIC_NOTES_API, CLINIC_NOTES_PDF} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import {Link, Redirect} from "react-router-dom";
import AddClinicNotes from "./AddClinicNotes";
import {CUSTOM_STRING_SEPERATOR} from "../../../constants/hardData";
import AddClinicNotesDynamic from "./AddClinicNotesDynamic";
import {Modal} from "antd/lib/index";
import {BACKEND_BASE_URL} from "../../../config/connect";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

const confirm = Modal.confirm;

class PatientClinicNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            clinicNotes: [],
            editClinicNotes: null,
            loading: true,

        }
        this.loadClinicNotes = this.loadClinicNotes.bind(this);
        this.editClinicNotesData = this.editClinicNotesData.bind(this);
    }

    componentDidMount() {
        // if (this.props.match.params.id) {
        this.loadClinicNotes();
        // }

    }

    loadClinicNotes(page = 1) {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1)
                    return {
                        clinicNotes: [...data.results],
                        next: data.next,
                        loading: false
                    }
                return {
                    clinicNotes: [...prevState.clinicNotes, ...data.results],
                    next: data.next,
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
            practice: this.props.active_practiceId
        };
        if (this.props.match.params.id) {
            apiParams.patient = this.props.match.params.id;
        }
        if (this.props.showAllClinic && this.props.match.params.id) {
            delete (apiParams.practice)
        }

        getAPI(PATIENT_CLINIC_NOTES_API, successFn, errorFn, apiParams)

    }


    editClinicNotesData(record) {
        this.setState({
            editClinicNotes: record,
            loading: false
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/emr/clinicnotes/edit")

    }

    deleteClinicNote(record) {
        let that = this;
        confirm({
            title: 'Are you sure to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {id: record.id, patient: record.patient, is_active: false};
                let successFn = function (data) {
                    that.loadClinicNotes();
                }
                let errorFn = function () {
                }
                postAPI(interpolate(PATIENT_CLINIC_NOTES_API, [that.props.match.params.id]), reqData, successFn, errorFn);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    loadPDF(id) {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(CLINIC_NOTES_PDF, [id]), successFn, errorFn);
    }

    render() {
        let that = this;
        const columns = [{
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at => <span>{moment(created_at).format('LLL')}</span>,
        }, {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Chief Complaints',
            dataIndex: 'chief_complaints',
            key: 'chief_complaints',
        }, {
            title: 'Investigations',
            dataIndex: 'investigations',
            key: 'investigations',
        }, {
            title: 'Diagnosis',
            dataIndex: 'diagnosis',
            key: 'diagnosis',
        }, {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
        }, {
            title: 'Observations',
            dataIndex: 'observations',
            key: 'observations',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                <a onClick={() => this.editClinicNotesData(record)}>Edit</a>
                <Divider type="vertical"/>
                <a href="javascript:;">Delete</a>
              </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/clinicnotes/add'
                       render={(route) => <AddClinicNotesDynamic {...route}
                                                                 {...this.props}
                                                                 loadData={this.loadClinicNotes}/>}/>
                <Route exact path='/patient/:id/emr/clinicnotes/edit'
                       render={(route) => (this.state.editClinicNotes ? <AddClinicNotesDynamic {...this.state}
                                                                                               {...route}
                                                                                               loadData={this.loadClinicNotes}/> :
                           <Redirect to={'/patient/' + that.props.match.params.id + '/emr/clinicnotes/'}/>)}/>
                <Route>
                    <div>
                        <Card bodyStyle={{padding: 0}}
                              title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " ClinicNotes" : "ClinicNotes"}
                              extra={<Button.Group>
                                  <Link to={"/patient/" + this.props.match.params.id + "/emr/clinicnotes/add"}>
                                      <Button type={"primary"}>
                                          <Icon type="plus"/>Add
                                      </Button>
                                  </Link>
                              </Button.Group>}>

                            {/*<Table loading={this.state.loading} columns={columns} dataSource={this.state.clinicNotes}/>*/}

                        </Card>
                        {this.state.clinicNotes.map(clinicNote => <Card style={{marginTop: 20}}>
                            <div style={{padding: 16}}>
                                <h4>{clinicNote.date ? moment(clinicNote.date).format('ll') : null}
                                    <Dropdown.Button
                                        size={"small"}
                                        style={{float: 'right'}}
                                        overlay={<Menu>
                                            <Menu.Item key="1" onClick={() => that.editClinicNotesData(clinicNote)}
                                                       disabled={(clinicNote.practice &&clinicNote.practice.id != this.props.active_practiceId)}>
                                                <Icon type="edit"/>
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item key="2" onClick={() => that.deleteClinicNote(clinicNote)}
                                                       disabled={(clinicNote.practice &&clinicNote.practice.id != this.props.active_practiceId)}>
                                                <Icon type="delete"/>
                                                Delete
                                            </Menu.Item>
                                            <Menu.Divider/>
                                            <Menu.Item key="3">
                                                <Link to={"/patient/" + clinicNote.patient + "/emr/timeline"}>
                                                    <Icon type="clock-circle"/>
                                                    &nbsp;
                                                    Patient Timeline
                                                </Link>
                                            </Menu.Item>
                                        </Menu>}>
                                        <a onClick={() => this.loadPDF(clinicNote.id)}><Icon type="printer"/></a>

                                    </Dropdown.Button>
                                </h4>
                            </div>
                            <Divider style={{margin: 0}}/>
                            <Row>
                                <Col span={6}>
                                    <h3>Complaints</h3>
                                </Col>
                                <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                    <div style={{minHeight: 30}}>
                                        {clinicNote.chief_complaints ? clinicNote.chief_complaints.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </div>
                                    <Divider style={{margin: 0}}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <h3>Observations</h3>
                                </Col>
                                <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                    <div style={{minHeight: 30}}>
                                        {clinicNote.observations ? clinicNote.observations.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </div>
                                    <Divider style={{margin: 0}}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <h3>Investigations</h3>
                                </Col>
                                <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                    <div style={{minHeight: 30}}>
                                        {clinicNote.investigations ? clinicNote.investigations.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </div>
                                    <Divider style={{margin: 0}}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <h3>Diagnoses</h3>
                                </Col>
                                <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                    <div style={{minHeight: 30}}>
                                        {clinicNote.diagnosis ? clinicNote.diagnosis.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </div>
                                    <Divider style={{margin: 0}}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <h3>Notes</h3>
                                </Col>
                                <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                    <div style={{minHeight: 30}}>
                                        {clinicNote.notes ? clinicNote.notes.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </div>
                                    <Divider style={{margin: 0}}/>
                                </Col>
                            </Row>

                            <div>
                                {clinicNote.doctor ?
                                    <Tag color={clinicNote.doctor ? clinicNote.doctor.calendar_colour : null}>
                                        <b>{"prescribed by  " + clinicNote.doctor.user.first_name} </b>
                                    </Tag> : null}
                                {clinicNote.practice ? <Tag style={{float: 'right'}}>
                                    <Tooltip title="Practice Name">
                                        <b>{clinicNote.practice.name} </b>
                                    </Tooltip>
                                </Tag> : null}
                            </div>
                        </Card>)}
                        <Spin spinning={this.state.loading}>
                            <Row/>
                        </Spin>
                        <InfiniteFeedLoaderButton loaderFunction={() => this.loadClinicNotes(that.state.next)}
                                                  loading={this.state.loading}
                                                  hidden={!this.state.next}/>
                    </div>
                </Route>
            </Switch>
            </div>
        }
        else {
            return <Card>
                {this.state.clinicNotes.map(clinicNote => <Card style={{marginTop: 20}}>
                    <div style={{padding: 16}}>
                        <h4>{clinicNote.date ? moment(clinicNote.date).format('ll') : null}
                            <Dropdown.Button
                                size={"small"}
                                style={{float: 'right'}}
                                overlay={<Menu>
                                    <Menu.Item key="1" onClick={() => that.editClinicNotesData(clinicNote)}
                                               disabled={(clinicNote.practice && clinicNote.practice.id != this.props.active_practiceId)}>
                                        <Icon type="edit"/>
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item key="2" onClick={() => that.deleteClinicNote(clinicNote)}
                                               disabled={(clinicNote.practice &&clinicNote.practice.id != this.props.active_practiceId)}>
                                        <Icon type="delete"/>
                                        Delete
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="3">
                                        <Link to={"/patient/" + clinicNote.patient + "/emr/timeline"}>
                                            <Icon type="clock-circle"/>
                                            &nbsp;
                                            Patient Timeline
                                        </Link>
                                    </Menu.Item>
                                </Menu>}>
                                <a onClick={() => this.loadPDF(clinicNote.id)}><Icon type="printer"/></a>

                            </Dropdown.Button>
                        </h4>
                    </div>
                    <Divider style={{margin: 0}}/>
                    <Row>
                        <Col span={6}>
                            <h3>Complaints</h3>
                        </Col>
                        <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                            <div style={{minHeight: 30}}>
                                {clinicNote.chief_complaints ? clinicNote.chief_complaints.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                    <span>{str}<br/></span>) : null}
                            </div>
                            <Divider style={{margin: 0}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <h3>Observations</h3>
                        </Col>
                        <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                            <div style={{minHeight: 30}}>
                                {clinicNote.observations ? clinicNote.observations.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                    <span>{str}<br/></span>) : null}
                            </div>
                            <Divider style={{margin: 0}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <h3>Investigations</h3>
                        </Col>
                        <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                            <div style={{minHeight: 30}}>
                                {clinicNote.investigations ? clinicNote.investigations.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                    <span>{str}<br/></span>) : null}
                            </div>
                            <Divider style={{margin: 0}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <h3>Diagnoses</h3>
                        </Col>
                        <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                            <div style={{minHeight: 30}}>
                                {clinicNote.diagnosis ? clinicNote.diagnosis.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                    <span>{str}<br/></span>) : null}
                            </div>
                            <Divider style={{margin: 0}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <h3>Notes</h3>
                        </Col>
                        <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                            <div style={{minHeight: 30}}>
                                {clinicNote.notes ? clinicNote.notes.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                    <span>{str}<br/></span>) : null}
                            </div>
                            <Divider style={{margin: 0}}/>
                        </Col>
                    </Row>

                    <div>
                        {clinicNote.doctor ?
                            <Tag color={clinicNote.doctor ? clinicNote.doctor.calendar_colour : null}>
                                <b>{"prescribed by  " + clinicNote.doctor.user.first_name} </b>
                            </Tag> : null}
                        {clinicNote.practice ? <Tag style={{float: 'right'}}>
                            <Tooltip title="Practice Name">
                                <b>{clinicNote.practice.name} </b>
                            </Tooltip>
                        </Tag> : null}
                    </div>
                </Card>)}
                <Spin spinning={this.state.loading}>
                    <Row/>
                </Spin>
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadClinicNotes(that.state.next)}
                                          loading={this.state.loading}
                                          hidden={!this.state.next}/>
            </Card>
        }

    }
}

export default PatientClinicNotes;
