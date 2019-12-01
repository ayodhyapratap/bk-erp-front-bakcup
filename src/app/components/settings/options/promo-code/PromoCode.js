import React from "react";
import {Divider, Popconfirm, Row, Table} from "antd";
import moment from "moment";
import AddOrEdiPromoCode from "./AddOrEdiPromoCode";
import {getAPI, interpolate, postAPI, putAPI} from "../../../../utils/common";
import {PROMO_CODE, UPDATE_PROMO_CODE} from "../../../../constants/api";


export default class PromoCode extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            promoCode:[],
        };

    }
    componentWillMount() {
            this.loadData();
    }

    loadData =() =>{
        let that =this;
        this.setState({
            loading:true,
        });

        let successFn =function (data) {
            that.setState({
                promoCode:data.results,
                loading:false,
            })
        };
        let errorFn =function () {
            that.setState({
                loading:false,
            })
        };

        getAPI(interpolate(PROMO_CODE ,[this.props.active_practiceId] ),successFn ,errorFn);
    };

    deleteObject =(record) =>{
        let that = this;
        let reqData ={
            // id:record.id,
            is_active:false
        };
        let successFn = function (data) {
            that.loadData();
        };

        let errorFn = function () {

        };
        putAPI(interpolate(UPDATE_PROMO_CODE,[record.id]), reqData, successFn, errorFn);
    };


    render() {
        const {promoCode ,loading } =this.state;

        const columns =[
            {
                title:'Code Name',
                dataIndex:'promo_code',
                key:'promo_code',
            },{
                title:'Promo Code Value',
                dataIndex:'promo_code',
                key:'promo_code',
            },{
                title:'Type',
                dataIndex:'code_type',
                key:'code_type',
            },{
                title:'Min Order',
                dataIndex:'minimum_order',
                key:'minimum_order',

            },{
                title:'Max Discount',
                dataIndex:'maximum_discount',
                key:'maximum_discount',

            },{
                title:'Expiry Date',
                dataIndex:'expiry_date',
                render:(item,record)=>(moment(record.expiry_date).format('YYYY-MM-DD'))
            },{
                title:'Action',
                render: (text, record) => (
                    <Popconfirm title="Are you sure delete this promo code?" onConfirm={() => this.deleteObject(record)}
                                okText="Yes" cancelText="No">
                        <a>
                            Delete
                        </a>
                    </Popconfirm>
                ),
            }

        ];
        return(
            <Row>
                {/*<p>Promo Code</p>*/}
                <AddOrEdiPromoCode {...this.props} loadData={this.loadData}/>
                <Divider/>
                <Table loading={loading} columns={columns} dataSource={promoCode} pagination={false}/>
            </Row>
        )
    }
}

