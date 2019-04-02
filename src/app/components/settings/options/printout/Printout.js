import React from 'react';
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Tabs,Divider,Table,Card , Icon ,Radio,Tag} from "antd";
import PrintSettings from "./PrintSettings";

const TabPane = Tabs.TabPane;
class Printout extends React.Component{
	constructor(props){
		super(props);
		const emrPanes = [
	      { title: 'Prescription', content: <PrintSettings/>	, key: '1' },
	      { title: 'Treatment Plan', content: <PrintSettings/>, key: '2' },
	      { title: 'Case Sheet', content: <PrintSettings/> , key: '3' },
	      { title: 'Medical Leave', content: <PrintSettings/>, key: '4' },
	      { title: 'Vital Signs', content: <PrintSettings/>, key: '5' },
	      { title: 'Lab Order', content: <PrintSettings/>, key: '6' },
	      { title: 'Lab Order Result', content: <PrintSettings/>, key: '7', closable: false,},
	    ];
	    const billingPanels =[
	    { title:'Invoice' , content: <PrintSettings/>	, key: '1' },
	    { title:'Receipts' , content: <PrintSettings/>	, key: '2' },
	    ];

	    this.state = {
	      activeKey: emrPanes[0].key,
	      activeKey:billingPanels[0].key,
	      emrPanes,
	      billingPanels,
	    };

	}


	render(){
		return (<div>
            <Tabs defaultActiveKey="emr" size="small">
	            <TabPane tab={<span><Icon type="calculator" />EMR</span>} key="emr">
	              	<Card>
		              	<h4>
	                        <div>
	                        	<Tabs size="small">
	                        		{this.state.emrPanes.map(item=><TabPane tab={item.title} key={item.key}>{item.content}</TabPane>	)}
								 </Tabs>
	                        </div>
	                    </h4>
	             	</Card>
	            </TabPane>
                <TabPane tab={<span><Icon type="book" />BILLING</span>} key="billing">
	                <Card>
		               	<h4>
	                        <div>
	                        	<Tabs size="small">
	                        		{this.state.billingPanels.map(item=><TabPane tab={item.title} key={item.key}>{item.content}</TabPane>	)}
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
