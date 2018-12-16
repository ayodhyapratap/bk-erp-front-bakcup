import React from "react";
import {Avatar, Input, Checkbox, Divider, Table, Col,Button, Form,  Row, Card, Icon, Skeleton} from "antd";
import {Link} from "react-router-dom";
import {TREATMENTPLANS_API,PROCEDURE_CATEGORY, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import  moment from "moment";
import AddorEditPatientTreatmentPlans from './AddorEditPatientTreatmentPlans';
import {Redirect,Switch, Route} from "react-router";


class PatientTreatmentPlans extends React.Component{
    constructor(props){
        super(props);
        super(props);
        this.state = {
          currentPatient:this.props.currentPatient,
          active_practiceId:this.props.active_practiceId,
          treatmentPlans:[],
          procedure_categry:null,
        }
        this.loadtreatmentPlanss =this.loadtreatmentPlanss.bind(this);
        this.loadDrugCatalog =this.loadDrugCatalog.bind(this);

    }
    componentDidMount(){
      if(this.props.match.params.id){
      this.loadtreatmentPlanss();
      this.loadDrugCatalog();
    }

    }
    loadtreatmentPlanss(){
      let that = this;
      let successFn =function (data){
        that.setState({
          treatmentPlans:data
        })
      }
      let errorFn = function (){

      }
      getAPI(interpolate(TREATMENTPLANS_API,[this.props.match.params.id]), successFn, errorFn)
    }
    loadDrugCatalog(){
      let that = this;
      let successFn =function (data){
        that.setState({
          procedure_categry:data
        })

      }
      let errorFn = function (){

      }
      getAPI(interpolate(PROCEDURE_CATEGORY,[this.props.active_practiceId]), successFn, errorFn)
    }
    render(){
      const procedures={}
      if(this.state.procedure_categry){

        this.state.procedure_categry.forEach(function(procedure){
          procedures[procedure.id]=(procedure.name)
        })
      }
      console.log(this.state.procedure_categry);

      const columns = [{
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at =><span>{moment(created_at).format('LLL')}</span>,
          }, {
            title: 'procedure',
            key: 'procedure',
            render:(text, record) => (
              <span> {procedures[record.procedure]}</span>
            )
          }, {
            title: 'Quantity',
            dataIndex: 'qunatity',
            key: 'quantity',
          }, {
            title: 'Cost per  Unit',
            dataIndex: 'cost',
            key: 'cost',
          }, {
            title: 'Active',
            key: 'is_active',
            render:(text, record) => (
              <Checkbox checked={record.is_active}/>
            )
          },  {
            title: 'Completed',
            key: 'is_completed',
            render:(text, record) => (
              <Checkbox checked={record.is_completed}/>
            )
          }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span><Link to={"/patient/"+this.props.match.params.id+"/emr/plans/"+record.id+"/edit"}>
                <a >Edit</a></Link>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
              </span>
            ),
          }];

      if(this.props.match.params.id){
      return <div><Switch>
      <Route exact path='/patient/:id/emr/plans/add'
             render={(route) => <AddorEditPatientTreatmentPlans{...this.state} {...route}/>}/>
      <Route exact path='/patient/:id/emr/plans/:treatmentPlansid/edit'
             render={(route) => <AddorEditPatientTreatmentPlans {...this.state} {...route}/>}/>
      <Card title={ this.state.currentPatient?this.state.currentPatient.name + " treatmentPlanss":"treatmentPlanss"}  extra={<Button.Group>
          <Link to={"/patient/"+this.props.match.params.id+"/emr/plans/add"}><Button><Icon type="plus"/>Add</Button></Link>
      </Button.Group>}>

      <Table columns={columns}  dataSource={this.state.treatmentPlans} />

      </Card>
      </Switch>

      </div>
    }
    else{
      return <Card>
              <h2> select patient to further continue</h2>
              </Card>
    }

    }
}
export default PatientTreatmentPlans;
