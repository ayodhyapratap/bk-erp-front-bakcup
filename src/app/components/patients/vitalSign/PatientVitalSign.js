import React from "react";
import {Button, Card, Divider, Icon, Input, Modal, Table, Tabs} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import {VITAL_SIGN_PDF, VITAL_SIGNS_API} from "../../../constants/api";
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
import moment from 'moment';
import CustomizedTable from "../../common/CustomizedTable";
import AddorEditPatientVitalSigns from "./AddorEditPatientVitalSigns";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {BACKEND_BASE_URL} from "../../../config/connect";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";

const {Meta} = Card;
const Search = Input.Search;
const confirm = Modal.confirm;

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
                if (data.current == 1) {
                    return {
                        vitalsign: [...data.results],
                        next: data.next,
                        loading: false
                    }
                }
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
            practice: this.props.active_practiceId
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
        confirm({
            title: 'Are you sure to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                let reqData = {...record, is_active: false};
                let successFn = function (data) {
                    that.loadVitalsigns();
                    displayMessage(SUCCESS_MSG_TYPE, "Deleted Successfully!!")

                };
                let errorFn = function () {

                };
                postAPI(interpolate(VITAL_SIGNS_API, [record.patient]), reqData, successFn, errorFn)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    editObject = (record) => {
        this.setState({
            editVitalSign: record,
            loading: false
        });
        if (this.props.match.params.id){
            let id = this.props.match.params.id;
            this.props.history.push("/patient/" + id + "/emr/vitalsigns/edit")
        }else {
            this.props.history.push("/patient/" + record.patient + "/emr/vitalsigns");
        }



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
        let that = this;
        const columns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (item,record) => <span>{record.date?moment(record.date).format('LL'):''}</span>,
        }, {
            title: 'Temp(F)',
            key: 'temperature',
            render: (text, record) => (
                <span> {record.temperature}<br/>,{record.temperature_part}</span>
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
                <span> {record.blood_pressure_up}/{record.blood_pressure_down}<br/>,{record.position}</span>
            )
        }, {
            title: 'WEIGHT kg',
            dataIndex: 'weight',
            key: 'weight',
        }, {
            title: "Creatinine Level",
            key: "creatinine",
            dataIndex: "creatinine",
        }, {
            title: "Haemoglobin Level",
            key: "haemoglobin",
            dataIndex: "haemoglobin",
        }, {
            title: "Urea Level",
            key: "urea",
            dataIndex: "urea",

        }, {
            title: "Uric Acid Level",
            key: "uric_acid",
            dataIndex: "uric_acid",
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.loadPDF(record.id)}
                    >Print</a>
                    <Divider type="vertical"/>
                  <a onClick={() => this.editObject(record)}
                     disabled={(record.practice != that.props.active_practiceId)}>Edit</a>
                    <Divider type="vertical"/>
                    <a onClick={() => that.deleteVitalSign(record)}
                       disabled={(record.practice != that.props.active_practiceId)}>Delete</a>
                </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <Switch>
                <Route path='/patient/:id/emr/vitalsigns/add'
                       render={(route) => <AddorEditPatientVitalSigns
                           {...this.props}
                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}
                           loadData={this.loadVitalsigns}/>}/>
                <Route path='/patient/:id/emr/vitalsigns/edit'
                       render={(route) => <AddorEditPatientVitalSigns
                           {...this.props}
                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}
                           loadData={this.loadVitalsigns}/>}/>
                <Route>
                    <Card
                        title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Report Manual" : "Patient Report Manual"}
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
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    {/*<defs>*/}
                                    {/*    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">*/}
                                    {/*        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>*/}
                                    {/*        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>*/}
                                    {/*    </linearGradient>*/}
                                    {/*    <Legend verticalAlign="top" height={36}/>*/}
                                    {/*</defs>*/}
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={that.state.vitalsign.length}/>
                                    <YAxis
                                        domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="pulse" stroke="#8884d8" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Temperature (F)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <Legend verticalAlign="top" height={36}/>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>

                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="temperature" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Blood Pressure (mmhg)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="blood_pressure_up" stroke="#ffc658" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                    <Line type="monotone" dataKey="blood_pressure_down" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Weight (kg)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
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
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="weight" stroke="#8884d8" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Respiratory Rate (breaths/min)</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
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
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="resp_rate" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Creatinine Level</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
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
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="creatinine" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Haemoglobin Level</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
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
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="haemoglobin" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Urea Level</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
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
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="urea" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                                <Divider>Uric Acid Level</Divider>
                                <LineChart width={700} height={200} data={this.state.vitalsign.reverse()}
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
                                    <XAxis dataKey="date" tickFormatter={(value) => {
                                        return moment(value).format('LL')
                                    }} tickCount={this.state.vitalsign.length}/>
                                    <YAxis domain={[dataMin => (Math.abs(dataMin)), dataMax =>  (dataMax * 1.1).toFixed(0)]}/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip
                                        labelFormatter={(value) => (value && moment(value).isValid() ? moment(value).format('LL') : '--')}/>
                                    <Line type="monotone" dataKey="uric_acid" stroke="#82ca9d" fillOpacity={1}
                                          strokeWidth={4}
                                          fill="url(#colorUv)"/>
                                </LineChart>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={"Details"} key={2}>
                                <CustomizedTable columns={columns}
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
        } else {
            return <div>
                <Card
                    bodyStyle={{padding: 0}}
                    title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Report Manual" : "Patients Report Manual"}
                    extra={<Button.Group>
                        <Button type={"primary"} onClick={() => that.props.togglePatientListModal(true)}>
                            <Icon type="plus"/>Add
                        </Button>
                    </Button.Group>}/>
                {this.state.vitalsign.map(vitalsign => <div>
                    <Card style={{marginTop: 10}}
                          title={<small>{vitalsign.date ? moment(vitalsign.date).format('ll') : null}
                              <Link to={"/patient/" + vitalsign.patient_data.id + "/emr/vitalsigns"}>
                                  &nbsp;&nbsp; {vitalsign.patient_data.user ? vitalsign.patient_data.user.first_name : null} (ID: {vitalsign.patient_data.custom_id?vitalsign.patient_data.custom_id:vitalsign.patient_data.id})&nbsp;
                              </Link>
                              <span>, {vitalsign.patient_data.gender}</span>
                          </small>}
                          bodyStyle={{padding: 0}}>
                        <Table columns={columns}
                               pagination={false}
                               dataSource={[vitalsign]}/>
                    </Card>
                </div>)}
                <InfiniteFeedLoaderButton loaderFunction={() => this.loadInvoices(that.state.next)}
                                          loading={this.state.loading}
                                          hidden={!this.state.next}/>
            </div>
        }
    }

}

export default PatientVitalSign;

function CustomizedTooltip(value, name, props) {
    console.log(value, name, props);
    return ["formatted value", "formatted name"]
}
