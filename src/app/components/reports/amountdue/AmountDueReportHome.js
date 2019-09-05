import React from "react";
import {Card, Col, Radio, Row }from "antd";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {AMOUNT_DUE_RELATED_REPORT} from "../../../constants/hardData";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {
    AGEING_AMOUNT_DUE,
    AMOUNT_DUE_PER_DOCTOR,
    AMOUNT_DUE_PER_PROCEDURE,
    TOTAL_AMOUNT_DUE, UNSETTLED_INVOICE
} from "../../../constants/dataKeys";
import TotalAmountDue from "./TotalAmountDue";
import AgeingAmountDue from "./AgeingAmountDue";
import AmountDuePerDoctor from "./AmountDuePerDoctor";
import AmountDuePerProcedure from "./AmountDuePerProcedure";
import UnsettledInvoice from "./UnsettledInvoice";


export default class AmountDueReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            type:'all',
            loading:true,

        }
        this.loadNewPatient = this.loadNewPatient.bind(this);
    }
    componentDidMount() {
            this.loadNewPatient();

    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                // if (this.state.type==NEW_PATIENTS){
                //     this.loadNewPatient();
                // }
            })
    }
    loadNewPatient() {
        let that = this;

        let successFn = function (data) {
            that.setState({
                report: data.results,
                total:data.count,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            type:this.state.type,
        }
        if(this.state.startDate){
            apiParams.from_date=this.state.startDate.format('YYYY-MM-DD');
            apiParams.to_date= this.state.endDate.format('YYYY-MM-DD');
        }

        getAPI(interpolate("PATIENTS_REPORTS", [this.props.active_practiceId]), successFn, errorFn,apiParams);
    }

    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        })
    }
    // advancedOption(value){
    //     console.log(value)
    //     this.setState({
    //         advancedOptionShow:value,
    //     })
    // }

    render() {
        return <div>
            <h2>Amount Due Report</h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                        {this.state.type==TOTAL_AMOUNT_DUE?<TotalAmountDue/>:null}
                        {this.state.type==AGEING_AMOUNT_DUE?<AgeingAmountDue/>:null}
                        {this.state.type==AMOUNT_DUE_PER_DOCTOR?<AmountDuePerDoctor/>:null}
                        {this.state.type==AMOUNT_DUE_PER_PROCEDURE?<AmountDuePerProcedure/>:null}
                        {this.state.type==UNSETTLED_INVOICE?<UnsettledInvoice/>:null}

                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue={TOTAL_AMOUNT_DUE} onChange={(value)=>this.onChangeHandle('type',value)}>
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={TOTAL_AMOUNT_DUE}>
                                Total Amount Due
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {AMOUNT_DUE_RELATED_REPORT.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>


                    </Col>
                </Row>
            </Card>
        </div>
    }
}
