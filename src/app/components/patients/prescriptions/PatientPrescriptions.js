import React from "react";
import {Avatar, Input, Checkbox, Divider, Table, Col, Button, Form, Row, Card, Icon, Skeleton} from "antd";
import {Link} from "react-router-dom";
import {PRESCRIPTIONS_API, DRUG_CATALOG, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import moment from "moment";
import AddorEditPatientPrescriptions from './AddorEditPatientPrescriptions';
import {Redirect, Switch, Route} from "react-router";
import AddorEditDynamicPatientPrescriptions from "./AddorEditDynamicPatientPrescriptions";


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
                prescription: data,
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

    render() {
        const drugs = {}
        if (this.state.drug_catalog) {

            this.state.drug_catalog.forEach(function (drug) {
                drugs[drug.id] = (drug.name + "," + drug.strength)
            })
        }

        const columns = [{
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at => <span>{moment(created_at).format('LLL')}</span>,
        }, {
            title: 'Drug',
            key: 'drug',
            render: (text, record) => (
                <span> {drugs[record.drug]}</span>
            )
        }, {
            title: 'Quantity',
            dataIndex: 'qunatity',
            key: 'quantity',
        }, {
            title: 'Cost Per  Unit',
            dataIndex: 'cost',
            key: 'cost',
        }, 
         {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                <a onClick={() => this.editPrescriptionData(record)}>Edit</a>
                <Divider type="vertical"/>
                <a href="javascript:;">Delete</a>
              </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/prescriptions/add'
                       render={(route) => <AddorEditDynamicPatientPrescriptions {...this.state}
                                                                                loadPrescriptions={this.loadPrescriptions} {...route}/>}/>
                <Route exact path='/patient/:id/emr/prescriptions/edit'
                       render={(route) => <AddorEditPatientPrescriptions {...this.state} {...route}/>}/>
                <Card
                    title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " Prescriptions" : "Prescriptions"}
                    extra={<Button.Group>
                        <Link to={"/patient/" + this.props.match.params.id + "/emr/prescriptions/add"}>
                            <Button type={"primary"}><Icon type="plus"/>Add</Button>
                        </Link>
                    </Button.Group>}>

                    <Table loading={this.state.loading} columns={columns} dataSource={this.state.prescription}/>

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

export default PatientPrescriptions;
