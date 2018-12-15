import React from "react";
import {Avatar, Input, Divider, Table, Col,Button, Form,  Row, Card, Icon, Skeleton} from "antd";
import {Link} from "react-router-dom";
import {ADD_VITAL_SIGN, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import moment from 'moment';

const {Meta} = Card;
const Search = Input.Search;


class PatientVitalSign extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          currentPatient:this.props.currentPatient,
          vitalsign:[],
        }
        this.loadVitalsigns =this.loadVitalsigns.bind(this);

    }
    componentDidMount(){
      if(this.props.match.params.id){
      this.loadVitalsigns();}

    }

    loadVitalsigns(){
      let that = this;
      let successFn =function (data){
        that.setState({
          vitalsign:data
        })
      }
      let errorFn = function (){

      }
      getAPI(interpolate(ADD_VITAL_SIGN,[this.props.match.params.id]), successFn, errorFn)
    }
    render(){
      const columns = [{
              title: 'Time',
              dataIndex: 'created_at',
              key: 'name',
              render: created_at =><span>{moment(created_at).format('LLL')}</span>,
            }, {
              title: 'Temp(F)',
              key: 'temperature',
              render:(text, record) => (
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
              render:(text, record) => (
                <span> {record.pulse},{record.position}</span>
              )
            }, {
              title: 'WEIGHT kg',
              dataIndex: 'weight',
              key: 'weight',
            },{
              title: 'Action',
              key: 'action',
              render: (text, record) => (
                <span>
                  <a href="javascript:;">Invite {record.name}</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">Delete</a>
                </span>
              ),
            }];

      if(this.props.match.params.id){
        return <Card title="Patient Vital Sign"  extra={<Button.Group>
            <Link to={"/patient/"+this.props.match.params.id+"/emr/vitalsigns/add"}><Button><Icon type="plus"/>Add</Button></Link>
        </Button.Group>}>
        {/*this.state.vitalsign.length ?
            this.state.vitalsign.map((sign) => <VitalSignCard {...sign}/>) :
            <p style={{textAlign: 'center'}}>No Data Found</p>
        */}
        <Table columns={columns} dataSource={this.state.vitalsign} />

        </Card>
      }
      else{
        return <Card>
                <h2> select patient to further continue</h2>
                </Card>
      }
    }

}
export default PatientVitalSign;

function VitalSignCard(sign) {
    return <Col span={24}>
        <Card style={{margin: '5px'}}>
            <Meta
                avatar={(sign.image ? <Avatar src={sign.image}/> :
                    <Avatar style={{backgroundColor: '#87d068'}}>

                    </Avatar>)}
                title={sign.id}
              />
              <h2>pulse: {sign.pulse}</h2>

        </Card>
    </Col>;
}
