import React from "react";

import {Button, Card, Checkbox, Divider, Icon, Table, Tag} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {PAYMENT_MODES, INVOICES_API, PATIENT_PAYMENTS_API, TAXES} from "../../../constants/api";
import moment from "moment";
import {Link} from "react-router-dom";
import {Route, Switch} from "react-router";
import AddPayment from "./AddPayment";


class PatientPayments extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          payments:[],
          active_practiceId:this.props.active_practiceId,
          loading:true
        }

    }
    componentDidMount(){
      this.loadPaymentModes();
      this.loadPayments();
      this.loadInvoices();
    }


    loadPayments(){
        let that = this;
        let successFn =function (data){
            that.setState({
                payments:data,
                loading:false
            })
        }
        let errorFn = function (){
          that.setState({
            loading:false
          })

        }
        getAPI(interpolate(PATIENT_PAYMENTS_API, [this.props.match.params.id]), successFn, errorFn);
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
    loadPaymentModes(){
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            paymentModes:data,
            loading:false
          })
        };
        let errorFn = function () {
          that.setState({
            loading:false
          })
        };
        getAPI(interpolate( PAYMENT_MODES, [this.props.active_practiceId]), successFn, errorFn);
    }
    editInvoiceData(record){
        this.setState({
            editInvoice:record,
        });
        let id=this.props.match.params.id
        this.props.history.push("/patient/"+id+"/billing/invoices/edit")

    }
    render(){
      const paymentmodes={}
      if(this.state.paymentModes){
          this.state.paymentModes.forEach(function (mode) {
              paymentmodes[mode.id]=mode.mode;
          })
      }
      const invoicelist={}
      if(this.state.invoices){
          this.state.invoices.forEach(function (mode) {
              invoicelist[mode.id]=mode.id;
          })
      }
      const columns = [{
          title: 'Time',
          dataIndex: 'created_at',
          key: 'name',
          render: created_at =><span>{moment(created_at).format('LLL')}</span>,
          },
          {
         title: 'Amount Paid	',
         dataIndex: 'amount',
         key: 'amount',
         },{
          title: 'Invoices	',
          key: 'invoice	',
          render:(text, record) => (
              <span> {invoicelist[record.invoice]}</span>
          )
          }, {
          title: 'Mode of Payment ',
          key: 'payment_mode',
          render:(text, record) => (
              <span> {paymentmodes[record.payment_mode]}</span>
          )
          }, {
          title: 'Advance',
          key: 'is_advance',
          render:(text, record) => (
              <Checkbox disabled checked={record.is_advance}/>
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
              <Route exact path='/patient/:id/billing/payments/add'
                     render={(route) => <AddPayment{...this.state} {...route}/>}/>
              <Route exact path='/patient/:id/billing/payments/edit'
                     render={(route) => <AddPayment {...this.state} {...route}/>}/>
              <Card title={ this.state.currentPatient?this.state.currentPatient.name + " Payments":"Payments"}  extra={<Button.Group>
                    <Link to={"/patient/"+this.props.match.params.id+"/billing/payments/add"}><Button><Icon type="plus"/>Add</Button></Link>
              </Button.Group>}>

                  <Table loading={this.state.loading} columns={columns}  dataSource={this.state.payments} />

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
export default PatientPayments;
