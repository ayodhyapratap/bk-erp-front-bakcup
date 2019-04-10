import React from 'react';
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Tabs,Divider,Table,Card , Icon ,Radio,Tag} from "antd";
import PrintSettings from "./PrintSettings";
import {} from "../../../../constants/api"
import {getAPI, interpolate, postAPI} from "../../../../utils/common";
import { Redirect } from 'react-router-dom';
import {PRESCRIPTION} from "../../../../constants/dataKeys";
import {SUBTYPE, BILLINGSUBTYPE, CUSTOMIZE_PAPER_TYPE} from "../../../../constants/hardData";

// console.log("===",SUBTYPE);
const TabPane = Tabs.TabPane;
class Printout extends React.Component{
	constructor(props){
		super(props);
	}
	

	render(){
		return (<div>
            <Tabs defaultActiveKey="EMR" size="small">
	            <TabPane tab={<span><Icon type="calculator" />EMR</span>} key="EMR">
	              	<Card>
		              	<h4>
	                        <div>
	                        	<Tabs size="small">
	                        		{SUBTYPE.map((item,i) => {
	                        			return (<TabPane tab={item.title} key={i}><PrintSettings key={item.title} sub_type={item.title} active_practiceId={this.props.active_practiceId} type={"EMR"}/></TabPane>)
	                        		})}
								 </Tabs>
	                        </div>
	                    </h4>
	             	</Card>
	            </TabPane>
                <TabPane tab={<span><Icon type="book" />BILLING</span>} key="BILLING">
	                <Card>
		               	<h4>
	                        <div>
	                        	<Tabs size="small">
	                        		{BILLINGSUBTYPE.map((item,i) => {
	                        			return (<TabPane tab={item.title} key={i}><PrintSettings key={item.title} sub_type={item.title} active_practiceId={this.props.active_practiceId} type={"BILLING"}/></TabPane>)
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
