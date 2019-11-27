import React from "react";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {EMR_REPORTS, SUGGESTIONS} from "../../../constants/api";
import {getAPI,  interpolate} from "../../../utils/common";
import moment from "moment"
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import CustomizedTable from "../../common/CustomizedTable";

export default class Suggestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            report:[],
        }
        this.loadSuggestionsReport = this.loadSuggestionsReport.bind(this);
    }

    componentDidMount() {
        this.loadSuggestionsReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.status!=newProps.status)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadSuggestionsReport();
            })

    }

    loadSuggestionsReport = () => {
        let that = this;
        that.setState({
            loading:true,
        });
        let successFn = function (data) {
            that.setState({
                report:data.results,
                loading: false,
            })
        };

        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };
        if(this.props.status){
            apiParams.status=this.props.status.toString();
        }
        getAPI(SUGGESTIONS,  successFn, errorFn, apiParams);
    };

    render() {
        const {report} =this.state;
        const reportData = [];
        for (let i = 1; i <= report.length; i++) {
            reportData.push({s_no: i,...report[i-1]});
        };

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            width: 50
        },{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.created_at).format('DD MMM YYYY')}
                  </span>
            ),
            export:(item,record)=>(moment(record.created_at).format('DD MMM YYYY')),
        },{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },{
            title:'Email',
            key:'email',
            dataIndex:'email',
        },{
            title:'Mobile',
            ket:'mobile',
            dataIndex:'mobile',
        },{
            title:'Subject',
            key:'subject',
            dataIndex:'subject',
        },{
            title:'Description',
            key:'description',
            dataIndex:'description',
        }];
        return <div>
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Total Suggestions" value={reportData.length} />
                    <br/>
                </Col>
            </Row>

            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={reportData}/>

        </div>
    }
}
