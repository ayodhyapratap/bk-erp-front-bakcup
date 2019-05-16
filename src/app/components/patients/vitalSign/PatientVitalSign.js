import React from "react";
import {Avatar, Input, Table, Col, Button, Card, Icon} from "antd";
import {Link} from "react-router-dom";
import {VITAL_SIGNS_API} from "../../../constants/api";
import {getAPI, interpolate, patchAPI, putAPI} from "../../../utils/common";
import moment from 'moment';

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
        let reqData = {...record, is_active: false}
        let successFn = function (data) {

        }
        let errorFn = function () {

        }
        patchAPI(interpolate(VITAL_SIGNS_API, [record.id]), reqData, successFn, errorFn)
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
                  {/*<a href="javascript:;">Invite {record.name}</a>*/}
                    {/*<Divider type="vertical" />*/}
                    <a onClick={() => that.deleteVitalSign(record)}>Delete</a>
                </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <Card
                title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Vital Sign" : "PatientVitalSign"}
                extra={<Button.Group>
                    <Link to={"/patient/" + this.props.match.params.id + "/emr/vitalsigns/add"}><Button><Icon
                        type="plus"/>Add</Button></Link>
                </Button.Group>}>
                {/*this.state.vitalsign.length ?
            this.state.vitalsign.map((sign) => <VitalSignCard {...sign}/>) :
            <p style={{textAlign: 'center'}}>No Data Found</p>
        */}
                <Table loading={this.state.loading} columns={columns} dataSource={this.state.vitalsign}/>

            </Card>
        }
        else {
            return <Card>
                <h2> select patient to further continue</h2>
            </Card>
        }
    }

}

export default PatientVitalSign;
