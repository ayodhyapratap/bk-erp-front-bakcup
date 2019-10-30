import React from "react";
import {getAPI} from "../../../utils/common";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import CustomizedTable from "../../common/CustomizedTable";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";
import {Col, Row, Statistic} from "antd";
export default class Patient_Conversion extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            patient_conversion: [],
            distinct_patients:'',
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            activeIndex:0,
        };
        this.loadPatientConversion = this.loadPatientConversion.bind(this);
    }
    componentDidMount() {
        this.loadPatientConversion();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.categories!=newProps.categories
            ||this.props.doctors!=newProps.doctors ||this.props.exclude_cancelled!=newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadPatientConversion();
            })

    }

    loadPatientConversion(){
        let that=this;
        that.setState({
            loading:true,
        });
        let successFn =function (data) {
            that.setState({
                patient_conversion:data.data,
                distinct_patients:data.distinct_patients,
                loading:false,
            })
        };
        let errorFn =function () {
            that.setState({
                loading:false,
            })
        };
        let apiParams={
            type:that.props.type,
            practice:that.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            exclude_cancelled:this.props.exclude_cancelled?true:false,
        };
        if(this.props.categories){
            apiParams.categories=this.props.categories.toString();
        }
        if(this.props.doctors){
            apiParams.doctors=this.props.doctors.toString();
        }

        getAPI(PATIENT_APPOINTMENTS_REPORTS,  successFn, errorFn, apiParams);

    }

    render() {
        let that =this;
        let i=1;
        const columns=[
            {   title: 'S. No',
                key: 'sno',
                dataIndex:'sno',
                render: (item, record) => <span> {i++}</span>,
                export:(item,record,index)=>index+1,
                width: 50
            },{
                title:'Date',
                key:'date',
                dataIndex:'date'

            },{
                title: 'Patient Id',
                key: 'custom_id',
                dataIndex: 'custom_id',
            },{
                title:'Patient Name',
                key:'patient_name',
                dataIndex:'patient_name',
            },{
                title:'Gender',
                key:'gender',
                dataIndex:'gender',

            },{
                title:'Contact Number',
                key:'mobile',
                dataIndex:'mobile',
                render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value),
                exports:(value)=>(value),
            },{
                title:'Email',
                key:'email',
                dataIndex:'email',
                render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value),
                exports:(value)=>(value),
            },{
                title:'Address',
                key:'address',
                dataIndex:'address',
            },{
                title:'Source',
                key:'source',
                dataIndex:'source',
            },{
                title:'Last Patient Note',
                key:'last_note',
                dataIndex:'last_note',
                render:(item,record)=><span>{record.last_note ?record.last_note + '( '+ record.last_note  +')':''}</span>
            },{
                title:'Last Payments',
                key:'invoice_total',
                dataIndex:'invoice_total',
            }
        ];
        return(<div>
                <h2>Patient Conversion</h2>
                <Row>
                    <Col span={12} offset={6} style={{textAlign:"center"}}>
                        <Statistic title="Total Conversions" value={this.state.distinct_patients} />
                    </Col>
                </Row>
                <CustomizedTable loading={this.state.loading} columns={columns}  dataSource={this.state.patient_conversion}/>
            </div>
        )
    }


}