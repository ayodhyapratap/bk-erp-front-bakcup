import React from "react";
import {Avatar, Input, Table, Col, Button, Card, Icon, Divider} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import {VITAL_SIGNS_API} from "../../../constants/api";
import {getAPI, interpolate, patchAPI, putAPI} from "../../../utils/common";
import moment from 'moment';
import PatientRequiredNoticeCard from "../PatientRequiredNoticeCard";
import CustomizedTable from "../../common/CustomizedTable";
import AddorEditPatientVitalSigns from "./AddorEditPatientVitalSigns";

const {Meta} = Card;
const Search = Input.Search;


class PatientVitalSign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            vitalsign: [],
            loading: true
        }
        this.loadVitalsigns = this.loadVitalsigns.bind(this);

    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.loadVitalsigns();
        }

    }

    loadVitalsigns() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                vitalsign: data,
                loading: false
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(VITAL_SIGNS_API, [this.props.match.params.id]), successFn, errorFn)
    }

    deleteVitalSign = (record) => {
        let that = this;
        let reqData = {...record, is_active: false};
        let successFn = function (data) {

        }
        let errorFn = function () {

        }
        patchAPI(interpolate(VITAL_SIGNS_API, [this.props.match.params.id]), reqData, successFn, errorFn)
    }
    editObject = (record) => {
        this.setState({
            editVitalSign: record,
            loading: false
        });
        let id = this.props.match.params.id;
        this.props.history.push("/patient/" + id + "/emr/vitalsigns/edit")

    }

    render() {
        let that = this;
        const columns = [{
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at => <span>{moment(created_at).format('LLL')}</span>,
        }, {
            title: 'Temp(F)',
            key: 'temperature',
            render: (text, record) => (
                <span> {record.temperature},{record.temperature_part}</span>
            )
        }, {
            title: 'Pulse (BPM)',
            dataIndex: 'pulse',
            key: 'pulse',
        }, {
            title: 'RR breaths/min',
            dataIndex: 'resp_rate',
            key: 'resp_rate',
        }, {
            title: 'SYS/DIA mmhg',
            key: 'address',
            render: (text, record) => (
                <span> {record.pulse},{record.position}</span>
            )
        }, {
            title: 'WEIGHT kg',
            dataIndex: 'weight',
            key: 'weight',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                  <a onClick={() => this.editObject(record)}>Edit</a>
                    <Divider type="vertical"/>
                    <a onClick={() => that.deleteVitalSign(record)}>Delete</a>
                </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <Switch>
                <Route path='/patient/:id/emr/vitalsigns/add'
                       render={(route) => <AddorEditPatientVitalSigns
                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} loadData={this.loadVitalsigns}/>}/>
                <Route path='/patient/:id/emr/vitalsigns/edit'
                       render={(route) => <AddorEditPatientVitalSigns
                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} loadData={this.loadVitalsigns}/>}/>
                <Route>
                    <Card
                        title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Vital Sign" : "PatientVitalSign"}
                        extra={<Button.Group>
                            <Link to={"/patient/" + this.props.match.params.id + "/emr/vitalsigns/add"}><Button><Icon
                                type="plus"/>Add</Button></Link>
                        </Button.Group>}>
                        {/*this.state.vitalsign.length ?
            this.state.vitalsign.map((sign) => <VitalSignCard {...sign}/>) :
            <p style={{textAlign: 'center'}}>No Data Found</p>
        */}
                        <CustomizedTable loading={this.state.loading} columns={columns}
                                         dataSource={this.state.vitalsign}/>

                    </Card>
                </Route>
            </Switch>
        }
        else {
            return <PatientRequiredNoticeCard/>
        }
    }

}

export default PatientVitalSign;
