import React from "react";
import CustomizedTable from "../../common/CustomizedTable";
import {getAPI, interpolate} from "../../../utils/common";
import {WALLET_LEDGER} from "../../../constants/api";
import {Card} from "antd";
import moment from "moment";

export default class PatientWalletLedger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ledger: [],
            loading: false
        }
    }

    componentDidMount() {
        this.loadData();
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
            key: 'comments'
        }, {
            title: 'Amount Type',
            dataIndex: 'amount_type',
            key: 'amount_type'
        },, {
            title: 'Cr/Dr',
            dataIndex: 'ledger_type',
            key: 'ledger_type'
        } ,{
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount'
        }]
        return <div>
            <h2>Wallet Ledger</h2>
            <Card>
                <CustomizedTable dataSource={this.state.ledger} loading={this.state.loading} columns={columns}/>
            </Card>
        </div>
    }
}