import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form,Button, Card, Icon,Tabs, Divider, Tag , Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import PaymentModes from "./PaymentModes";
import CancelledInvoice from "./CancelledInvoice";
import TaxCatalog from "./TaxCatalog";
import {TAXES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../../utils/common";

const TabPane = Tabs.TabPane;


class BillingSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        }
    }
    componentDidMount() {

      }

    render() {
        return <div>
          <Row>
          <Card>
            <Tabs defaultActiveKey="taxcatalog" >
              <TabPane tab={<span><Icon type="android" />Tax Catalog</span>} key="taxcatalog">
               <TaxCatalog {...this.state} {...this.props}/>
              </TabPane>
              <TabPane tab={<span><Icon type="android" />Accepted Modes of payment </span>} key="paymentmodes">
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
