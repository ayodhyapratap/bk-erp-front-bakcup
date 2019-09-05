import React from "react";
import {Button, Card, Col, Icon, Radio, Row} from "antd";
import {TREATMENT_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {EMR_RELATED_REPORT} from "../../../constants/hardData";
import TreatmentForEachDoctor from "./TreatmentForEachDoctor";
import {
    ALL_TREATMENTS,
    DAILY_TREATMENT_COUNT,
    MONTHLY_TREATMENT_COUNT, TREATMENT_FOR_EACH_CATEGORY,
    TREATMENTS_FOR_EACH_DOCTOR
} from "../../../constants/dataKeys";
import DailyTreatmentsCount from "./DailyTreatmentsCount";
import AllTreatmentPerformed from "./AllTreatmentPerformed";
import MonthlyTreatmentCount from "./MonthlyTreatmentCount";
import TreatmentForEachCategory from "./TreatmentForEachCategory";

export default class EMRReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            type:'all',
            loading:true,
        }
        this.loadAllTreatment = this.loadAllTreatment.bind(this);
    }
    componentDidMount() {
        if (this.state.type==ALL_TREATMENTS){
            this.loadAllTreatment();
        }

    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                if (this.state.type==ALL_TREATMENTS){
                    this.loadAllTreatment();
                }
            })
    }

    loadAllTreatment() {
        let that = this;
        let successFn = function (data) {
            console.log(data);
            that.setState({
                report: data.data,
                loading:false
            });
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        getAPI(interpolate(TREATMENT_REPORTS, [this.props.active_practiceId, "start=" + this.props.startDate + "&end=" + this.props.endDate]), successFn, errorFn);
    }
    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        })
    }

    render() {

        return <div>
            <h2>Expenses Report
                {/*<Button.Group style={{float: 'right'}}>*/}
                    {/*<Button><Icon type="mail"/> Mail</Button>*/}
                    {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>
            <Card >
                <Row gutter={16}>
                    <Col span={16}>
                        {this.state.type==ALL_TREATMENTS?<AllTreatmentPerformed/>:null}
                        {this.state.type==DAILY_TREATMENT_COUNT ?<DailyTreatmentsCount/>:null}
                        {this.state.type==TREATMENTS_FOR_EACH_DOCTOR?<TreatmentForEachDoctor/>:null}
                        {this.state.type==MONTHLY_TREATMENT_COUNT?<MonthlyTreatmentCount/>:null}
                        {this.state.type==TREATMENT_FOR_EACH_CATEGORY?<TreatmentForEachCategory/>:null}
                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue={ALL_TREATMENTS} onChange={(value)=>this.onChangeHandle('type',value)}>
                            <h2>Appointments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={ALL_TREATMENTS}>
                                All Treatments Performed
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {EMR_RELATED_REPORT.map((item) => <Radio.Button
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
