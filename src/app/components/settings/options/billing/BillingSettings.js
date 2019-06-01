import React from "react";
import {Form, Button, Card, Icon, Tabs, Divider, Tag, Row, Table} from "antd";
import PaymentModes from "./PaymentModes";
import TaxCatalog from "./TaxCatalog";

const TabPane = Tabs.TabPane;


class BillingSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultActiveKey: this.props.location.hash
        }
    }


    render() {
        return <div>
            <Row>
                <h2>Billing</h2>
                <Card>
                    <Tabs defaultActiveKey={this.state.defaultActiveKey}>
                        <TabPane tab={<span><Icon type="cluster"/>Tax Catalog</span>} key="#taxcatalog">
                            <TaxCatalog {...this.state} {...this.props}/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="dollar"/>Accepted Modes of payment </span>} key="#paymentmodes">
                            <PaymentModes {...this.props}/>
                        </TabPane>
                        {/*<TabPane tab={<span><Icon type="android" />Emails</span>} key="cancelledinvoice">
                <CancelledInvoice/>
              </TabPane>*/}
                    </Tabs>

                </Card>
            </Row>
        </div>
    }
}

export default BillingSettings;
