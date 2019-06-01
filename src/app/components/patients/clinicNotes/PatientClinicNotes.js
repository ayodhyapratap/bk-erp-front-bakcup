import {Button, Card, Checkbox, Divider, Icon, Table, Dropdown, Menu, Col, Row, Tag} from "antd";
import React from "react";
import {getAPI, interpolate, postAPI} from "../../../utils/common";
import {INVOICES_API, PATIENT_CLINIC_NOTES_API,} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import {Link, Redirect} from "react-router-dom";
import AddClinicNotes from "./AddClinicNotes";
import {CUSTOM_STRING_SEPERATOR} from "../../../constants/hardData";
import AddClinicNotesDynamic from "./AddClinicNotesDynamic";
import {Modal} from "antd/lib/index";

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
        if (this.props.match.params.id) {
            this.loadClinicNotes();
        }

    }

    loadClinicNotes() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                clinicNotes: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(PATIENT_CLINIC_NOTES_API, [this.props.match.params.id]), successFn, errorFn)
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
                let reqData = {"id": record.id, is_active: false};
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
                            <div>
                                <h4>{clinicNote.date ? moment(clinicNote.date).format('ll') : null}
                                    <Dropdown.Button
                                        // onClick={()=>that.loadPDF(clinicNote.id)}
                                        size={"small"}
                                        style={{float: 'right'}}
                                        overlay={<Menu>
                                            <Menu.Item key="1" onClick={() => that.editClinicNotesData(clinicNote)}>
                                                <Icon type="edit"/>
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item key="2" onClick={() => that.deleteClinicNote(clinicNote)}>
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
                                <Row>
                                    <Col span={6}>
                                        <h3>Complaints</h3>
                                    </Col>
                                    <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                        <Divider style={{margin: 0}}/>
                                        {clinicNote.chief_complaints ? clinicNote.chief_complaints.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <h3>Observations</h3>
                                    </Col>
                                    <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                        <Divider style={{margin: 0}}/>
                                        {clinicNote.observations ? clinicNote.observations.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <h3>Investigations</h3>
                                    </Col>
                                    <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                        <Divider style={{margin: 0}}/>
                                        {clinicNote.investigations ? clinicNote.investigations.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <h3>Diagnoses</h3>
                                    </Col>
                                    <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                        <Divider style={{margin: 0}}/>
                                        {clinicNote.diagnosis ? clinicNote.diagnosis.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <h3>Notes</h3>
                                    </Col>
                                    <Col span={18} style={{borderLeft: '1px solid #ccc', padding: 4}}>
                                        <Divider style={{margin: 0}}/>
                                        {clinicNote.notes ? clinicNote.notes.split(CUSTOM_STRING_SEPERATOR).map(str =>
                                            <span>{str}<br/></span>) : null}
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                {clinicNote.doctor ? <Tag color={clinicNote.doctor ? clinicNote.doctor.calendar_colour : null}>
                                    <b>{"prescribed by  " + clinicNote.doctor.user.first_name} </b>
                                </Tag> : null}
                            </div>
                        </Card>)}
                    </div>
                </Route>
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

export default PatientClinicNotes;
