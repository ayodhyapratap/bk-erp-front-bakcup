import React from "react";
import {Button, Card, Checkbox, Divider, Icon, Table} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {PROCEDURE_CATEGORY, TREATMENTPLANS_API} from "../../../constants/api";
import moment from "moment";
import {Route, Switch} from "react-router";
import AddorEditPatientTreatmentPlans from "../treatmentPlans/AddorEditPatientTreatmentPlans";
import {Link} from "react-router-dom";

class PatientCompletedProcedures extends React.Component{
    constructor(props){
        super(props);
        super(props);
        this.state = {
            currentPatient:this.props.currentPatient,
            active_practiceId:this.props.active_practiceId,
            treatmentPlans:[],
            procedure_category:null,
            completedTreatmentPlans:[],
        }
        this.loadtreatmentPlanss =this.loadtreatmentPlanss.bind(this);
        this.loadProcedureCategory =this.loadProcedureCategory.bind(this);
        this.editTreatmentPlanData =this.editTreatmentPlanData.bind(this);

    }
    componentDidMount(){
        if(this.props.match.params.id){
            this.loadtreatmentPlanss();
            this.loadProcedureCategory();
        }

    }
    loadtreatmentPlanss(){
        let completed=[];
        let that = this;
        let successFn =function (data){
            that.setState({
                treatmentPlans:data
            })
            data.forEach(function (treatmentplan) {
                if(treatmentplan.is_completed){
                    completed.push(treatmentplan)
                }
            })
            that.setState({
                completedTreatmentPlans:completed,
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(TREATMENTPLANS_API,[this.props.match.params.id]), successFn, errorFn)
    }
    loadProcedureCategory(){
        let that = this;
        let successFn =function (data){
            that.setState({
                procedure_category:data
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(PROCEDURE_CATEGORY,[this.props.active_practiceId]), successFn, errorFn)
    }


    editTreatmentPlanData(record){
        this.setState({
            editTreatmentPlan:record,
        });
        let id=this.props.match.params.id
        this.props.history.push("/patient/"+id+"/emr/plans/edit")

    }

    render(){
        const procedures={}
        if(this.state.procedure_category){

            this.state.procedure_category.forEach(function(procedure){
                procedures[procedure.id]=(procedure.name)
            })
        }
        console.log(this.state.procedure_category);

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
                <Checkbox disabled checked={record.is_active}/>
            )
        },  {
            title: 'Completed',
            key: 'is_completed',
            render:(text, record) => (
                <Checkbox  disabled checked={record.is_completed}/>
            )
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
               <a onClick={()=>this.editTreatmentPlanData(record)}>Edit</a>

                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
              </span>
            ),
        }];

        if(this.props.match.params.id){
            return <div><Switch>
                <Route exact path='/patient/:id/emr/plans/add'
                       render={(route) => <AddorEditPatientTreatmentPlans{...this.state} {...route}/>}/>
                <Route exact path='/patient/:id/emr/plans/edit'
                       render={(route) => <AddorEditPatientTreatmentPlans {...this.state} {...route}/>}/>
                <Card title={ this.state.currentPatient?this.state.currentPatient.name + " completed Procedurees":"completed Procedures"}  extra={<Button.Group>
                    <Link to={"/patient/"+this.props.match.params.id+"/emr/plans/add"}><Button><Icon type="plus"/>Add</Button></Link>
                </Button.Group>}>

                    <Table columns={columns}  dataSource={this.state.completedTreatmentPlans} />

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
export default PatientCompletedProcedures;
