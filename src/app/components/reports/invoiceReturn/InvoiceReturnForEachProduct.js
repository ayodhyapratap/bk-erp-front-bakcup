import React from "react";
import {Cell, Pie, PieChart, Sector} from "recharts";
import * as _ from "lodash";
import {Col, Divider, Empty, Row, Select, Spin, Statistic} from "antd";
import CustomizedTable from "../../common/CustomizedTable";
import {getAPI} from "../../../utils/common";
import {RETURN_INVOICE_REPORTS} from "../../../constants/api";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";
export default class InvoiceReturnForEachProduct extends React.Component{
    constructor(props){
        super(props);
        this.state={
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            activeIndex:0,
            mailingUsersList: []
        }

        this.loadEachProductInvoiceReturn = this.loadEachProductInvoiceReturn.bind(this);
    }
    componentDidMount() {
        this.loadEachProductInvoiceReturn();
        loadMailingUserListForReportsMail(this);

    }

    componentWillReceiveProps (newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate ||
            this.props.endDate != newProps.endDate ||
            this.props.patient_groups != newProps.patient_groups ||
            this.props.doctors != newProps.doctors ||
            this.props.income_type != newProps.income_type ||
            this.props.taxes != newProps.taxes ||
            this.props.discount != newProps.discount ||
            this.props.products != newProps.products ||
            this.props.treatments != newProps.treatments ||
            this.props.exclude_cancelled != newProps.exclude_cancelled

        )
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadEachProductInvoiceReturn();
            })

    }


    startLoading = () =>{
        this.setState({
            loading:true
        })
    };

    stopLoading = () =>{
        this.setState({
            loading:false
        })
    };




    loadEachProductInvoiceReturn = () =>{
        let that = this;
        this.startLoading();
        let {startDate, endDate} = this.state;
        let {active_practiceId, type, exclude_cancelled, patient_groups, doctors, income_type, taxes, discount, products, treatments} = this.props;

        let apiParams = {
            practice:active_practiceId,
            type:type,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
            // start:"2019-01-01",
            is_cancelled: exclude_cancelled ? true : false,
        };

        if (patient_groups){
            apiParams.groups = patient_groups.toString()
        }

        if (doctors){
            apiParams.doctors = doctors.toString();
        }

        if (income_type) {
            apiParams.income_type = income_type;
        }

        if (treatments){
            apiParams.treatments = treatments.toString()
        }

        if (discount){
            apiParams.discount = discount
        }
        if (taxes){
            apiParams.taxes = taxes.toString()
        }

        if (products){
            apiParams.products = products.toString()
        }

        let successFn =function (data) {
            that.setState({
                report:data,
            })
            that.stopLoading();
        };
        let errorFn = function (data) {
            that.stopLoading();
        };

        getAPI(RETURN_INVOICE_REPORTS ,successFn, errorFn, apiParams)
    };

    sendMail = (mailTo) => {
        let {startDate, endDate} = this.state;
        let {active_practiceId, type, exclude_cancelled, patient_groups, doctors, income_type, taxes, discount, products, treatments} = this.props;
        let apiParams = {
            practice:active_practiceId,
            type:type,
            start: startDate.format('YYYY-MM-DD'),
            end: endDate.format('YYYY-MM-DD'),
            is_cancelled: exclude_cancelled ? true : false,
        };

        if (patient_groups){
            apiParams.groups = patient_groups.toString()
        }

        if (doctors){
            apiParams.doctors = doctors.toString();
        }

        if (income_type) {
            apiParams.income_type = income_type;
        }

        if (treatments){
            apiParams.treatments = treatments.toString()
        }

        if (discount){
            apiParams.discount = discount
        }
        if (taxes){
            apiParams.taxes = taxes.toString()
        }

        if (products){
            apiParams.products = products.toString()
        }

        apiParams.mail_to = mailTo;
        sendReportMail(RETURN_INVOICE_REPORTS, apiParams)
    }

    onPieEnter=(data, index)=>{
        this.setState({
            activeIndex: index,
        });
    };

    render() {

        let {loading, report, activeIndex} =this.state;

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        const renderActiveShape = (props) => {
            const RADIAN = Math.PI / 180;
            const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
                fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 30) * cos;
            const my = cy + (outerRadius + 30) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 22;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';

            return (
                <g>

                    <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                    />
                    <Sector
                        cx={cx}
                        cy={cy}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        innerRadius={outerRadius + 6}
                        outerRadius={outerRadius + 10}
                        fill={fill}
                    />
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.name+','+ payload.cost.toFixed(2)}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`(Rate ${(percent * 100).toFixed(2)}%)`}
                    </text>
                </g>
            );
        };
        let totalAmount = report.reduce(function(prev, cur) {
            return prev + cur.cost;
        }, 0);



        const columns = [
            {
                title:'Name',
                key:'name',
                dataIndex:'name',
            },{
                title: 'Discount',
                key: 'discount_value',
                dataIndex: 'discount_value',
                render:(item,record)=><span>{_.get(record,'discount_value',0).toFixed(2)}</span>
            },{
                title:'Tax',
                key:'tax_value',
                dataIndex:'tax_value',
                render:(item, record)=><span>{_.get(record,'tax_value',0).toFixed(2)}</span>
            },{
                title:'Cost',
                key:'cost',
                dataIndex:'cost',
                render:(item, record)=><span>{_.get(record,'cost',0).toFixed(2)}</span>
            }
        ];

        return(<div>
                <h2>Return Invoice For Each Products
                    <span style={{float: 'right'}}>
                        <p><small>E-Mail To:&nbsp;</small>
                            <Select onChange={(e) => this.sendMail(e)} style={{width: 200}}>
                                {this.state.mailingUsersList.map(item => <Select.Option
                                    value={item.email}>{item.name}</Select.Option>)}
                            </Select>
                        </p>
                    </span>
                </h2>

                <Row>
                    <Col span={12} offset={6}>
                        <Spin size="large" spinning={loading}>
                            {report.length>0?
                                <PieChart width={800} height={400} >
                                    <Pie
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        data={report}
                                        cx={300}
                                        dataKey="cost"
                                        cy={200}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        onMouseEnter={this.onPieEnter}>
                                        {
                                            report.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                                        }
                                    </Pie>
                                    {/*<Tooltip/>*/}
                                </PieChart>
                                :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}

                        </Spin>
                    </Col>
                </Row>
                <Divider><Statistic title="Total" value={totalAmount.toFixed(2)} /></Divider>
                <CustomizedTable loading={this.state.loading} columns={columns}  dataSource={report}/>
            </div>
        );
    }
}
