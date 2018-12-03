import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form,Button, Card, Icon,Tabs, Divider, Tag , Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import PaymentModes from "./PaymentModes";
import CancelledInvoice from "./CancelledInvoice";
import TaxCatalog from "./TaxCatalog";
const TabPane = Tabs.TabPane;


class BillingSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
          <Row>
          <Card>
            <Tabs defaultActiveKey="taxcatalog" >
              <TabPane tab={<span><Icon type="android" />Tax Catalog</span>} key="taxcatalog">
               <TaxCatalog/>
              </TabPane>
              <TabPane tab={<span><Icon type="android" />Wish SMS</span>} key="paymentmodes">
                <PaymentModes/>
              </TabPane>
              <TabPane tab={<span><Icon type="android" />Emails</span>} key="c  ancelledinvoice">
                <CancelledInvoice/>
              </TabPane>
            </Tabs>

          </Card>
          </Row>
        </div>
    }
}

export default BillingSettings;
