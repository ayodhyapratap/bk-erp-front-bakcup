import {Button, Card, Checkbox, Divider, Icon, Table} from "antd";
import React from "react";
import {getAPI, interpolate} from "../../../utils/common";
import {PATIENT_CLINIC_NOTES_API,} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddClinicNotes from "./AddClinicNotes";

class PatientClinicNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            clinicNotes: [],
            editClinicNotes: null,
            loading:true
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
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        getAPI(interpolate(PATIENT_CLINIC_NOTES_API, [this.props.match.params.id]), successFn, errorFn)
    }


    editClinicNotesData(record) {
        this.setState({
            editClinicNotes: record,
            loading:false
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/emr/clinicnotes/edit")

    }

    render() {

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
                       render={(route) => <AddClinicNotes{...this.state} {...route}/>}/>
                <Route exact path='/patient/:id/emr/clinicnotes/edit'
                       render={(route) => <AddClinicNotes {...this.state} {...route}/>}/>
                <Card
                    title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " ClinicNotes" : "ClinicNotes"}
                    extra={<Button.Group>
                        <Link to={"/patient/" + this.props.match.params.id + "/emr/clinicnotes/add"}><Button><Icon
                            type="plus"/>Add</Button></Link>
                    </Button.Group>}>

                    <Table loading={this.state.loading} columns={columns} dataSource={this.state.clinicNotes}/>

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

export default PatientClinicNotes;
