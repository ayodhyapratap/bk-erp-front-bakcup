import React from 'react';
import {Button, Tabs, Divider, Table, Card, Icon, Radio, Tag} from "antd";
import PrintSettings from "./PrintSettings";
import {PRESCRIPTION} from "../../../../constants/dataKeys";
import {
    EMR_TYPE,
    BILLING_TYPE,
    EMR_SUB_TYPE,
    BILLING_SUB_TYPE,
    CUSTOMIZE_PAPER_TYPE
} from "../../../../constants/hardData";

const TabPane = Tabs.TabPane;

class Printout extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (<div>
            <h2>Print Settings</h2>
            <Tabs defaultActiveKey={EMR_TYPE} size="small" type="card">
                <TabPane tab={<span><Icon type="calculator"/>{EMR_TYPE}</span>} key={EMR_TYPE}>
                    <Card>
                        <h4>
                            <div>
                                <Tabs size="small">
                                    {EMR_SUB_TYPE.map((item, i) => {
                                        return (<TabPane tab={item.title} key={i}><PrintSettings key={item.title}
                                                                                                 sub_type={item.title}
                                                                                                 active_practiceId={this.props.active_practiceId}
                                                                                                 type={"EMR"}/></TabPane>)
                                    })}
                                </Tabs>
                            </div>
                        </h4>
                    </Card>
                </TabPane>
                <TabPane tab={<span><Icon type="audit"/>{BILLING_TYPE}</span>} key={BILLING_TYPE}>
                    <Card>
                        <h4>
                            <div>
                                <Tabs size="small">
                                    {BILLING_SUB_TYPE.map((item, i) => {
                                        return (<TabPane tab={item.title} key={i}><PrintSettings key={item.title}
                                                                                                 sub_type={item.title}
                                                                                                 active_practiceId={this.props.active_practiceId}
                                                                                                 type={"BILLING"}/></TabPane>)
                                    })}
                                </Tabs>

                            </div>
                        </h4>
                    </Card>
                </TabPane>
            </Tabs>
        </div>);
    }
}

export default Printout;
