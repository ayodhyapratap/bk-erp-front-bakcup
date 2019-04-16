import React from "react";
import {Button, Card, Checkbox, Divider, Icon, Table, Tag} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {DRUG_CATALOG, INVOICES_API, PROCEDURE_CATEGORY, TAXES} from "../../../constants/api";
import moment from "moment";
import {Link} from "react-router-dom";
import {Route, Switch} from "react-router";
import AddInvoice from "./AddInvoice";
import AddInvoicedynamic from "./AddInvoicedynamic";

class PatientInvoices extends React.Component{
    constructor(props){
        super(props);
        super(props);
        this.state = {
            currentPatient:this.props.currentPatient,
            active_practiceId:this.props.active_practiceId,
            invoices:[],
            drug_catalog:null,
            procedure_category:null,
            taxes_list: null,
            editInvoice: null,
            loading:true
        }
        this.loadInvoices =this.loadInvoices.bind(this);
        this.loadDrugCatalog =this.loadDrugCatalog.bind(this);
        this.loadProcedureCategory =this.loadProcedureCategory.bind(this);
        this.loadTaxes =this.loadTaxes.bind(this);
        this.editInvoiceData =this.editInvoiceData.bind(this);

    }
    componentDidMount(){
        if(this.props.match.params.id){
            this.loadInvoices();
            this.loadDrugCatalog();
            this.loadProcedureCategory()
            this.loadTaxes();
        }

    }
    loadInvoices(){
        let that = this;
        let successFn =function (data){
            that.setState({
                invoices:data,
                loading:false
            })
        }
        let errorFn = function (){
            that.setState({
                loading:false
            })

        }
        getAPI(interpolate(INVOICES_API, [this.props.match.params.id]), successFn, errorFn);
    }
    loadDrugCatalog(){
        let that = this;
        let successFn =function (data){
            that.setState({
                drug_catalog:data,
                loading:false
            })

        }
        let errorFn = function (){
            that.setState({
                loading:false
            })

        }
        getAPI(interpolate(DRUG_CATALOG,[this.props.active_practiceId]), successFn, errorFn)
    }
    loadProcedureCategory(){
        let that = this;
        let successFn =function (data){
            that.setState({
                procedure_category:data,
                loading:false
            })

        }
        let errorFn = function (){
            that.setState({
                loading:false
            })

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadTaxes(){
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                taxes_list:data,
                loading:false
            })
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        getAPI(interpolate( TAXES, [this.props.active_practiceId]), successFn, errorFn);

    }

    editInvoiceData(record){
        this.setState({
            editInvoice:record,
        });
        let id=this.props.match.params.id
        this.props.history.push("/patient/"+id+"/billing/invoices/edit")

    }
    render(){
        const drugs={}
        if(this.state.drug_catalog){

            this.state.drug_catalog.forEach(function(drug){
                drugs[drug.id]=(drug.name+","+drug.strength)
            })
        }
        const procedures={}
        if(this.state.procedure_category){
            this.state.procedure_category.forEach(function (procedure) {
                procedures[procedure.id]=procedure.name;
            })
        }

        const taxesdata={}
        if(this.state.taxes_list){
            this.state.taxes_list.forEach(function (tax) {
                taxesdata[tax.id]=tax.name;
            })
        }
        console.log(taxesdata)

        const columns = [{
            title: 'Time',
            dataIndex: 'created_at',
            key: 'name',
            render: created_at =><span>{moment(created_at).format('LLL')}</span>,
            }, {
            title: 'Drug',
            key: 'drug',
            render:(text, record) => (
                <span> {drugs[record.drug]}</span>
            )
            }, {
            title: 'Procedure',
            key: 'preocedure',
            render:(text, record) => (
                <span> {procedures[record.procedure]}</span>
            )
            }, {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            }, {
            title: 'Taxes',
            key: 'taxes',
            dataIndex:"taxes",
            render: taxes => (
                        <span>
                  {taxes.map(tax => <Tag color="blue" key={tax}>{taxesdata[tax]}</Tag>)}
                </span>
                ),

        },  {
            title: 'Pending',
            key: 'is_pending',
            render:(text, record) => (
                <Checkbox disabled checked={record.is_pending}/>
            )
            },

            {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                <a onClick={()=>this.editInvoiceData(record)}>Edit</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
              </span>
            ),
        }];

        if(this.props.match.params.id){
            return <div><Switch>
                <Route exact path='/patient/:id/billing/invoices/add'
                       render={(route) => <AddInvoicedynamic{...this.state} {...route}/>}/>
                <Route exact path='/patient/:id/billing/invoices/edit'
                       render={(route) => <AddInvoice {...this.state} {...route}/>}/>
                <Card title={ this.state.currentPatient?this.state.currentPatient.user.first_name + " Invoice":"Invoice"}  extra={<Button.Group>
                    <Link to={"/patient/"+this.props.match.params.id+"/billing/invoices/add"}><Button><Icon type="plus"/>Add</Button></Link>
                </Button.Group>}>

                    <Table loading={this.state.loading} columns={columns}  dataSource={this.state.invoices} />

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
export default PatientInvoices;
