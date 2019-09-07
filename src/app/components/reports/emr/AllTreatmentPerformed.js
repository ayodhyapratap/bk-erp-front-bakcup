import React from "react";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {EMR_REPORTS} from "../../../constants/api";
import {getAPI,  interpolate} from "../../../utils/common";
import moment from "moment"
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

export default class AllTreatmentPerformed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            treatmentPerformed:[],
        }
        this.loadTreatmentsReport = this.loadTreatmentsReport.bind(this);
    }

    componentDidMount() {
        this.loadTreatmentsReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.doctors!=newProps.doctors ||this.props.is_complete!=newProps.is_complete)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadTreatmentsReport();
            })

    }

    loadTreatmentsReport = (page=1) => {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1) {
                    return {
                        treatmentPerformed: [...data.results],
                        next: data.next,
                        total:data.count,
                        loading: false
                    }
                }
                return {
                    treatmentPerformed: [...prevState.treatmentPerformed, ...data.results],
                    next: data.next,
                    loading: false
                }

            })
        };

        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            page:page,
            type:that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            is_complete:this.props.is_complete?true:false,
        };
        if(this.props.doctors){
            apiParams.doctors=this.props.doctors.toString();
        }
        getAPI(interpolate(EMR_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };

    render() {
        let that=this;
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Performed On',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.schedule_at).format('DD MMM YYYY')}
                  </span>
            ),
        },{
            title: 'Name',
            dataIndex: 'procedure_name',
            key: 'procedure_name',
        },{
            title:'Performed by',
            key:'doctor',
            dataIndex:'doctor',
        }];




        return <div>
            {/*<h2>All Appointments Report (Total:{that.props.total?that.props.total:this.state.total})*/}
            {/*    /!*<Button.Group style={{float: 'right'}}>*!/*/}
            {/*    /!*<Button><Icon type="mail"/> Mail</Button>*!/*/}
            {/*    /!*<Button><Icon type="printer"/> Print</Button>*!/*/}
            {/*    /!*</Button.Group>*!/*/}
            {/*</h2>*/}
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Total Treatments" value={this.state.total} />
                    <br/>
                </Col>
            </Row>

            <Table
                loading={this.state.loading}
                columns={columns}
                pagination={false}
                dataSource={this.state.treatmentPerformed}/>
            <InfiniteFeedLoaderButton loaderFunction={() => this.loadTreatmentsReport(that.state.next)}
                                      loading={this.state.loading}
                                      hidden={!this.state.next}/>

        </div>
    }
}
