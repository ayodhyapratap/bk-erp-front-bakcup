import React from "react";
import {Button, Card, Col, Radio, Row, Select} from "antd";
import ProfitLossReport from "../inventorydetails/ProfitLossReport";
import {
    ALL,
    ALL_INVENTORY,
    ALL_INVOICE_RETURN,
    DAILY_INVENTORY, DAILY_WISE_INVOICE,
    MONTHLY_INVENTORY, MONTHLY_WISE_INCOME, RETURN_ITEMS,
    TOP_INVENTORY
} from "../../../constants/dataKeys";
import {INVENTORY_RELATED_REPORT, INVOICE_RELATED_REPORT} from "../../../constants/hardData";
import AllReturnedInvoice from "./AllReturnedInvoice";
import InventoryReport from "../inventory/InventoryReport";
import DailyInventory from "../inventory/DailyInventory";
import MonthlyInventory from "../inventory/MonthlyInventory";
import TopInventory from "../inventory/TopInventory";
import DayWiseReturn from "./DayWiseReturn";
import MonthlyWiseReturn from "./MonthlyWiseReturn";
import ReturnItemCount from "./ReturnItemCount";
export default class InvoiceReturnHome extends React.Component{
    constructor(props){
        super(props);
        this.state={
            sidePanelColSpan: 4,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            advancedOptionShow: true,
            patientGroup:[],
        }
    }

    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        });
    }

    advancedOption(value){
        this.setState({
            advancedOptionShow:value,
        })
    }
    changeSidePanelSize = (sidePanel) => {
        this.setState({
            sidePanelColSpan: sidePanel ? 0 : 4
        })
    };

    render() {
        return<div>
            <h2>Inventory Report <Button type="primary" shape="round"
                                         icon={this.state.sidePanelColSpan ? "double-right" : "double-left"}
                                         style={{float: "right"}}
                                         onClick={() => this.changeSidePanelSize(this.state.sidePanelColSpan)}>Panel</Button>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={(24 - this.state.sidePanelColSpan)}>
                        {this.state.type == ALL_INVOICE_RETURN ?
                            <AllReturnedInvoice {...this.props} {...this.state} /> : null}

                        {this.state.type == DAILY_WISE_INVOICE ?
                            <DayWiseReturn  {...this.props} {...this.state} /> : null}

                        {this.state.type ==MONTHLY_WISE_INCOME?
                            <MonthlyWiseReturn {...this.props} {...this.state}  />:null}
                        {this.state.type== RETURN_ITEMS?
                            <ReturnItemCount {...this.props} {...this.state}/>:null}

                    </Col>
                    <Col span={this.state.sidePanelColSpan}>
                        <Radio.Group buttonStyle="solid" defaultValue={ALL_INVOICE_RETURN}
                                     onChange={(value) => this.onChangeHandle('type', value)}>
                            <h2>Invoice Returns</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value={ALL}>
                                All Returned Invoices
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {INVOICE_RELATED_REPORT.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>

                        <br/>
                        <br/>
                        {this.state.advancedOptionShow?<>
                            <Button type="link" onClick={(value)=>this.advancedOption(false)}>Hide Advanced Options </Button>
                            <Col> <br/>
                                <h4>Patient Groups</h4>
                                <Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Patient Groups"
                                        onChange={(value)=>this.handleChangeOption('patient_groups',value)}>
                                    {this.state.patientGroup.map((item) => <Select.Option value={item.id}>
                                        {item.name}</Select.Option>)}
                                </Select>

                            </Col>
                        </>:<Button type="link" onClick={(value)=>this.advancedOption(true)}>Show Advanced Options </Button>}

                    </Col>
                </Row>
            </Card>
        </div>
    }
}