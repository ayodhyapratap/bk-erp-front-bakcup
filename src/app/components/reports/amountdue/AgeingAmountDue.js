import React from "react";
import {Col, Divider, Row, Statistic, Table} from "antd";
import {AMOUNT_DUE_REPORTS, APPOINTMENT_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Cell, Pie, PieChart, Sector} from "recharts";
import moment from "moment"

export default class AgeingAmountDue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            report:[]
        };
        this.loadReport = this.loadReport.bind(this);

    }
    componentDidMount() {
        this.loadReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.doctors != newProps.doctors)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadReport();
            })

    }
    loadReport =() =>{
        let that =this;
        that.setState({
            loading:true,
        });

        let successFn = function (data) {
            that.setState({
                report:data,
                loading:false,
            })
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        let apiParams={
            type: that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };

        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }

        getAPI(AMOUNT_DUE_REPORTS, successFn ,errorFn,apiParams);
    };

    render() {
        const {report ,loading} =this.state;

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            render:(item,record,index)=><span>{index+1}</span>,
            width: 50
        },{
            title: 'Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },{
            title:'for 0-29 days (INR)',
            dataIndex:'0_29',
            key:'0_29',
            render:(item =><span>{item.toFixed(2)}</span> )
        },{
            title:'for 30-59 days (INR)',
            dataIndex:'30_59',
            key:'30_59',
            render:(item =><span>{item.toFixed(2)}</span>)
        },{
            title:'for 60-89 days (INR)',
            dataIndex:'60_89',
            key:'60_89',
            render:(item =><span>{item.toFixed(2)}</span>)
        },{
            title:'for 89-364 days (INR)',
            dataIndex:'89_364',
            key:'89_364',
            render:(item =><span>{item.toFixed(2)}</span>)
        },{
            title:'for more than 364 days (INR)',
            dataIndex:'365',
            key:'365',
            render:(item =><span>{item.toFixed(2)}</span>)
        }
        ,{
            title:'Total (INR)',
            key:'total',
            render:(item,record)=><span>{(record['0_29'] + record['30_59'] + record['60_89'] +record['89_364'] + record['365']).toFixed(2)}</span>
        }
        ];


        return <div>

                <h2>Ageing Amount Due </h2>

                <Table loading={loading} columns={columns} pagination={false}  dataSource={report}/>
        </div>
    }
}
