import React from "react";
import CustomizedTable from "../../common/CustomizedTable";
import {getAPI, interpolate} from "../../../utils/common";
import {AGENT_WALLET, WALLET_LEDGER} from "../../../constants/api";
import {Card, Col, Icon, Row, Statistic, Typography} from "antd";
import moment from "moment";

const {Text} = Typography;
export default class PatientWalletLedger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ledger: [],
            loading: false,
            walletAmount: null
        }
    }

    componentDidMount() {
        this.loadData();
        this.loadPatientWallet();
    }

    loadPatientWallet = () => {
        let that = this;
        if (this.props.currentPatient && this.props.currentPatient.id) {
            let successFn = function (data) {
                if (data.length)
                    that.setState({
                        walletAmount: data[0]
                    })
            }
            let errorFn = function () {

            }
            getAPI(interpolate(AGENT_WALLET, [this.props.currentPatient.id]), successFn, errorFn);
        } else {
            this.setState({
                pendingAmount: null
            })
        }
    }
    loadData = () => {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                ledger: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(interpolate(WALLET_LEDGER, [this.props.currentPatient.id]), successFn, errorFn);
    }

    render() {
        let columns = [{
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('LLL')
        }, {
            title: 'Ledger Comment',
            dataIndex: 'comments',
            key: 'comments',
            render: (value, record) => record.is_cancelled ? <Text delete>{value}</Text> : value
        },
        //     {
        //     title: 'Amount Type',
        //     dataIndex: 'amount_type',
        //     key: 'amount_type',
        //     render: (value, record) => record.is_cancelled ? <Text delete>{value}</Text> : value
        // },
            {
            title: 'Cr/Dr',
            dataIndex: 'ledger_type',
            key: 'ledger_type',
            render: (value, record) => record.is_cancelled ? <Text delete>{value}</Text> : value
        }, {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (value, record) => record.is_cancelled ? <Text delete>{value}</Text> : value
        }]
        return <div>
            <Card title={"Wallet Ledger"}>
                {this.state.walletAmount ?
                    <Row style={{textAlign: 'center', marginBottom: 10}}>
                        {/*<Col span={12}>*/}
                        {/*    <Statistic title={"Refundable Amount"} prefix={<Icon type={"wallet"}/>}*/}
                        {/*               value={this.state.walletAmount.refundable_amount}/>*/}
                        {/*</Col>*/}
                        <Col span={24}>
                            <Statistic title={"Non Refundable Amount"} prefix={<Icon type={"wallet"}/>}
                                       value={this.state.walletAmount.non_refundable}/>
                        </Col>
                    </Row> : null}
                <CustomizedTable dataSource={this.state.ledger} loading={this.state.loading} columns={columns}/>
            </Card>
        </div>
    }
}