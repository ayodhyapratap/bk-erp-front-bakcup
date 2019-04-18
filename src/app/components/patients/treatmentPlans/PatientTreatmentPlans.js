import React from "react";
import {Avatar, Input, Checkbox, Divider, Table, Col,Button, Form,  Row, Card, Icon, Skeleton, Popconfirm} from "antd";
import {Link} from "react-router-dom";
import {PROCEDURE_CATEGORY, PATIENT_PROFILE, SINGLE_REATMENTPLANS_API, TREATMENTPLANS_API} from "../../../constants/api";
import {getAPI,interpolate, displayMessage, putAPI} from "../../../utils/common";
import  moment from "moment";
import AddorEditPatientTreatmentPlans from './AddorEditPatientTreatmentPlans';
import {Redirect, Switch, Route} from "react-router";
import AddorEditDynamicTreatmentPlans from "./AddorEditDynamicTreatmentPlans";


class PatientTreatmentPlans extends React.Component {
    constructor(props) {
        super(props);
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            active_practiceId: this.props.active_practiceId,
            treatmentPlans: [],
            procedure_category: null,
            incompletedTreatmentPlans: [],
            loading: true,
            selectedTreatments:{}
        }
        this.loadtreatmentPlanss = this.loadtreatmentPlanss.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.editTreatmentPlanData = this.editTreatmentPlanData.bind(this);
this.submitCompleteTreatment = this.submitCompleteTreatment.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.loadtreatmentPlanss();
            this.loadProcedureCategory();
        }

    }

    loadtreatmentPlanss(){
        let incompleted=[];
      let that = this;
      let successFn =function (data){
        that.setState({
          treatmentPlans:data,
          loading:false
        })
          data.forEach(function (treatmentplan) {
              if(!treatmentplan.is_completed){
                  incompleted.push(treatmentplan)
              }
          })
          that.setState({
              incompletedTreatmentPlans:incompleted,
              loading:false
          })
      }
      let errorFn = function (){
        that.setState({
          loading:false
        })

      }
      getAPI(interpolate(TREATMENTPLANS_API,[this.props.match.params.id,null]), successFn, errorFn)
    }

    loadtreatmentPlanss() {
        let incompleted = [];
        let that = this;
        let successFn = function (data) {
            that.setState({
                treatmentPlans: data,
                loading: false
            })
            data.forEach(function (treatmentplan) {
                if (!treatmentplan.is_completed) {
                    incompleted.push(treatmentplan)
                }
            })
            that.setState({
                incompletedTreatmentPlans: incompleted,
                loading: false
            })

            
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(TREATMENTPLANS_API, [this.props.match.params.id]), successFn, errorFn)
    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
                loading: false
            })

        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
    }


    editTreatmentPlanData(record) {
        this.setState({
            editTreatmentPlan: record,
            loading: false
        });
        let id = this.props.match.params.id
        this.props.history.push("/patient/" + id + "/emr/plans/edit")

    }


    deleteTreatmentPlans(record) {
      let that = this;
      let reqData = record;
      reqData.is_active = false;
      let successFn = function (data) {
        that.loadData();
      }
      let errorFn = function () {

      };
      putAPI(interpolate(SINGLE_REATMENTPLANS_API, [record.id]), reqData, successFn, errorFn);
    }

    treatmentCompleteToggle(id,option){
        this.setState(function(prevState){
            return {selectedTreatments:{...prevState.selectedTreatments,[id]:!!option}}
        });
    }
    submitCompleteTreatment(){
        let selectedTreatments = this.state.selectedTreatments;
        let treatmentKeys = Object.keys(selectedTreatments);
        let reqTreatmentsArray = [];
        treatmentKeys.forEach(function(item){
            let treatmentObj = {id:item,is_completed:selectedTreatments[item]};
            reqTreatmentsArray.push(treatmentObj);
        });
        let successFn = function(data){

        }
        let errorFn=function(){

        }
        putAPI(interpolate(TREATMENTPLANS_API, [this.props.match.params.id]),reqTreatmentsArray ,successFn, errorFn)
    }
    render(){

      const procedures={}
        if(this.state.procedure_category){
            this.state.procedure_category.forEach(function (procedure) {
                procedures[procedure.id] = (procedure.name)
            })
        }
        console.log(this.state.procedure_category);

        const columns = [{
            title: '',
            key: 'is_completed',
            render: (text, record) => (record.is_completed?<Icon type="check-circle" theme="twoTone" twoToneColor="#0f0" />:
                <Checkbox onChange={(e)=>this.treatmentCompleteToggle(record.id,e.target.checked)} value={this.state.selectedTreatments[record.id]}/>
            )
        }, {
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at => <span>{moment(created_at).format('LLL')}</span>,
        }, {
            title: 'Procedure',
            key: 'procedure',
            render: (text, record) => (
                <span> {procedures[record.procedure]}</span>
            )
        }, {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        }, {
            title: 'Cost per  Unit',
            dataIndex: 'cost',
            key: 'cost',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
               <a onClick={() => this.editTreatmentPlanData(record)}>Edit</a>

                <Divider type="vertical" />
                <Popconfirm title="Are you sure delete this item?"
                            onConfirm={() => this.deleteTreatmentPlans(record)} okText="Yes" cancelText="No">
                    <a>Delete</a>
                </Popconfirm>
              </span>
            ),
        }];

        if (this.props.match.params.id) {
            return <div><Switch>
                <Route exact path='/patient/:id/emr/plans/add'
                       render={(route) => <AddorEditDynamicTreatmentPlans {...this.state} {...route}/>}/>
                <Route exact path='/patient/:id/emr/plans/edit'
                       render={(route) => <AddorEditPatientTreatmentPlans {...this.state} {...route}/>}/>
                <Card
                    title={this.state.currentPatient ? this.state.currentPatient.user.first_name + " TreatmentPlans" : "TreatmentPlans"}
                    extra={<Button.Group>
                        <Button  onClick={this.submitCompleteTreatment}> <Icon type="save"/>Save</Button>
                        <Link to={"/patient/" + this.props.match.params.id + "/emr/plans/add"}>
                            <Button><Icon type="plus"/>Add</Button>
                        </Link>
                    </Button.Group>
                    }>

                    <Table loading={this.state.loading} columns={columns}
                           dataSource={this.state.treatmentPlans}/>

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

export default PatientTreatmentPlans;
