import React from "react";
import {Avatar, Input, Table, Col, Button, Card, Icon, Divider, Tabs} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import {PRESCRIPTION_PDF, VITAL_SIGN_PDF, VITAL_SIGNS_API} from "../../../constants/api";
import {getAPI, interpolate, patchAPI, putAPI} from "../../../utils/common";
import moment from 'moment';
import PatientRequiredNoticeCard from "../PatientRequiredNoticeCard";
import CustomizedTable from "../../common/CustomizedTable";
import AddorEditPatientVitalSigns from "./AddorEditPatientVitalSigns";
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LineChart, Line} from 'recharts';
import {BACKEND_BASE_URL} from "../../../config/connect";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

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
        this.loadVitalsigns();
    }

    loadVitalsigns(page = 1) {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                return {
                    vitalsign: [...prevState.vitalsign, ...data.results],
                    next: data.next,
                    loading: false
                }
            })
        }
        let errorFn = function () {

        }
        let apiParams = {
            page: page,
            practice : this.props.active_practiceId
        };
        if (this.props.match.params.id) {
            apiParams.patient = this.props.match.params.id;
        }
        if (this.props.showAllClinic && this.props.match.params.id) {
            delete (apiParams.practice)
        }
        getAPI(VITAL_SIGNS_API, successFn, errorFn, apiParams)
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

    loadPDF(id) {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(VITAL_SIGN_PDF, [id]), successFn, errorFn);
    }

    render() {
        const data = [
            {
                "name": "Page A",
                "uv": 4000,
                "pv": 2400,
                "amt": 2400
            },
            {
                "name": "Page B",
                "uv": 3000,
                "pv": 1398,
                "amt": 2210
            },
            {
                "name": "Page C",
                "uv": 2000,
                "pv": 9800,
                "amt": 2290
            },
            {
                "name": "Page D",
                "uv": 2780,
                "pv": 3908,
                "amt": 2000
            },
            {
                "name": "Page E",
                "uv": 1890,
                "pv": 4800,
                "amt": 2181
            },
            {
                "name": "Page F",
                "uv": 2390,
                "pv": 3800,
                "amt": 2500
            },
            {
                "name": "Page G",
                "uv": 3490,
                "pv": 4300,
                "amt": 2100
            }
        ]
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
                    <a onClick={() => this.loadPDF(record.id)}>Print</a>
                    <Divider type="vertical"/>
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
                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}
                           loadData={this.loadVitalsigns}/>}/>
                <Route path='/patient/:id/emr/vitalsigns/edit'
                       render={(route) => <AddorEditPatientVitalSigns
                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}
                           loadData={this.loadVitalsigns}/>}/>
                <Route>
                    <Card
                        title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Vital Sign" : "PatientVitalSign"}
                        extra={<Button.Group>
                            <Link to={"/patient/" + this.props.match.params.id + "/emr/vitalsigns/add"}>
                                <Button type={"primary"}>
                                    <Icon type="plus"/>Add
                                </Button>
                            </Link>
                        </Button.Group>}>
                        <Tabs>
                            <Tabs.TabPane tab={"Charts"} key={1} style={{margin: 'auto'}}>
                                <Divider>Pulse Chart (bpm)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                        </linearGradient>

                                    </defs>
                                    <XAxis dataKey="created_at" tickFormatter={(value) => {
                                        return moment(value).format('LLL')
                                    }} tickCount={that.state.vitalsign.length}/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="pulse" stroke="#8884d8" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Temperature (F)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="created_at" tickFormatter={(value) => {
                                        return moment(value).format('LLL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="temperature" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Blood Pressure (mmhg)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="created_at" tickFormatter={(value) => {
                                        return moment(value).format('LLL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="blood_pressure" stroke="#ffc658" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Weight (kg)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="created_at" tickFormatter={(value) => {
                                        return moment(value).format('LLL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="weight" stroke="#8884d8" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Respiratory Rate (breaths/min)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="created_at" tickFormatter={(value) => {
                                        return moment(value).format('LLL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="resp_rate" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={"Details"} key={2}>
                                <CustomizedTable loading={this.state.loading} columns={columns}
                                                 pagination={false}
                                                 dataSource={this.state.vitalsign}/>
                                <InfiniteFeedLoaderButton loaderFunction={() => this.loadInvoices(that.state.next)}
                                                          loading={this.state.loading}
                                                          hidden={!this.state.next}/>

                            </Tabs.TabPane>

                        </Tabs>
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
