import React from "react";
import {Card, Tabs, Row, Icon} from 'antd';
import Offers from "./Offers";
import Membership from "./Membership";
import PromoCode from "../promo-code/PromoCode";

const TabPane = Tabs.TabPane;

export default class LoyaltySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <Row>
            <h2>Loyalty Settings</h2>
            <Card>
                <Tabs>
                    <TabPane tab={<span><Icon type="percentage" />Offers</span>} key={"#offers"}>
                        <Offers {...this.props}/>
                    </TabPane>

                    <TabPane tab={<span><Icon type="pound" />Membership</span>} key={"#membership"}>
                        <Membership {...this.props}/>
                    </TabPane>

                    <TabPane tab={<span><Icon type="pound" />Promo Code</span>} key={"#promocode"}>
                        <PromoCode {...this.props}/>
                    </TabPane>
                </Tabs>
            </Card>
        </Row>
    }
}
