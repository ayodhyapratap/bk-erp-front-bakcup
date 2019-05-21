import React from "react";
import {
    Avatar,
    Input,
    Checkbox,
    Divider,
    Badge,
    Table,
    Col,
    Button,
    Form,
    Row,
    Card,
    Icon,
    Skeleton,
    Popconfirm,
    Tag
} from "antd";
import {Link} from "react-router-dom";
import {PRESCRIPTIONS_API, DRUG_CATALOG, PATIENT_PROFILE, PATIENTS_LIST} from "../../../constants/api";
import {getAPI, interpolate, displayMessage, postAPI, putAPI} from "../../../utils/common";
import moment from "moment";
import AddorEditPatientPrescriptions from './AddorEditPatientPrescriptions';
import {Redirect, Switch, Route} from "react-router";
import AddorEditDynamicPatientPrescriptions from "./AddorEditDynamicPatientPrescriptions";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";


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
        if (this.props.match.params.id) {
            this.loadPrescriptions();
            this.loadDrugCatalog();
        }

    }

    loadPrescriptions() {
        let that = this;
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
        getAPI(interpolate(PRESCRIPTIONS_API, [this.props.match.params.id]), successFn, errorFn)
    }

    getMorePriscriptions() {
        let that = this;
        let next = this.state.nextPrescriptionPage;
        let successFn = function (data) {
            if (data.current == next)
                that.setState(function (prevState) {
                    return {
                        prescription: [...prevState.prescription, ...data.results],
                        nextPrescriptionPage: data.next,
                    }
                })
        }
        let errorFn = function () {

        }
        getAPI(PATIENTS_LIST, successFn, errorFn, {page: parseInt(next)});
    }

    loadDrugCatalog() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drug_catalog: data,
                loading: false
            })

        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn)
    }

    editPrescriptionData(record) {
        this.setState({
            editPrescription: record,
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/emr/prescriptions/edit")

    }

    deletePrescriptions(record) {
        console.log("record", record);
        let that = this;
        let reqData = {"id": record.id, is_active: false};
        let successFn = function (data) {
            that.loadPrescriptions();
        }
        let errorFn = function () {
        }
        postAPI(interpolate(PRESCRIPTIONS_API, [this.props.match.params.id]), reqData, successFn, errorFn);
    }

    render() {
        const drugs = {}
        if (this.state.drug_catalog) {

            this.state.drug_catalog.forEach(function (drug) {
                drugs[drug.id] = (drug.name + "," + drug.strength)
            })
        }
        let that = this;
        const columns = [
            {
                dataIndex: 'doctor',
                key: 'doctor',
                width: 5,

                // onCell : doctor => <span style={{backgroundColor: doctor ? doctor.calendar_colour : null, width: 10, height: 10}}/>,
                render: doctor => <div
                    style={{backgroundColor: doctor ? doctor.calendar_colour : 'red', width: '5px', height: '100%'}}/>,
            }, {
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
            },
            // {
            //     title: 'Action',
            //     key: 'action',
            //     render: (text, record) => (
            //         <span>
            //     <a onClick={() => this.editPrescriptionData(record)}>Edit</a>
            //     <Divider type="vertical"/>
            //     <Popconfirm title="Are you sure delete this item?"
            //                 onConfirm={() => that.deletePrescriptions(record)} okText="Yes" cancelText="No">
            //         <a>Delete</a>
            //     </Popconfirm>
            //   </span>
            //     ),
            // }
        ];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/prescriptions/add'
                       render={(route) => <AddorEditDynamicPatientPrescriptions {...this.state}
                                                                                loadPrescriptions={this.loadPrescriptions} {...route}/>}/>
                <Route exact path='/patient/:id/emr/prescriptions/edit'
                       render={(route) => <AddorEditPatientPrescriptions {...this.state} {...route}/>}/>
                <Route>
                    <div>
                        <Card>
                            <h3>
                                {this.state.currentPatient ? this.state.currentPatient.user.first_name + " Prescriptions" : "Prescriptions"}
                                <Button.Group style={{float: 'right'}}>
                                    <Link to={"/patient/" + this.props.match.params.id + "/emr/prescriptions/add"}>
                                        <Button type={"primary"}><Icon type="plus"/>Add</Button>
                                    </Link>
                                </Button.Group>
                            </h3>
                        </Card>
                        {this.state.prescription.map((presc) => <div>

                            <Card style={{margin: 10, marginBottom: 20}}
                                  bodyStyle={{padding: 0}}>
                                <h4>{presc.date ? <p>&nbsp;&nbsp;{presc.date}</p> : null}</h4>
                                <Table columns={columns} dataSource={presc.drugs} pagination={false}
                                       header={() => prescriptionHeader(presc)}
                                    // size={'small'}
                                       footer={() => prescriptonFooter(presc)}
                                       key={presc.id}/>
                            </Card></div>)}
                        <InfiniteFeedLoaderButton loading={this.state.loading}
                                                  loaderFunction={this.getMorePriscriptions}
                                                  hidden={!this.state.nextPrescriptionPage}/>
                        {this.state.nextPrescriptionPage ?
                            <div style={{textAlign: 'center'}}>
                                <Button type="primary" disabled={this.state.loading}
                                        onClick={this.getMorePriscriptions}>
                                    Load More...
                                </Button>
                            </div> : null}
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

export default PatientPrescriptions;

function prescriptonFooter(presc) {
    if (presc) {

        return <div>
            {presc.doctor ? <Tag color={presc.doctor ? presc.doctor.calendar_colour : null}>
                <b>{"prescribed by  " + presc.doctor.user.first_name} </b>
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
