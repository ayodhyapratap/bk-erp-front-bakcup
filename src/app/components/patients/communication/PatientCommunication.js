import React from "react";
import {Card, Button, Table, Icon} from "antd";
import {Link} from "react-router-dom";
import PatientCommunicationSetting from "./PatientCommunicationSetting";

class PatientCommunication extends React.Component{
    constructor(props){
        super(props);
        this.state={

        };
    }
    render(){
	        return <Card title="Patient Communication" extra={<Link to="/patient/communication">
            			<Button type="primary"> <Icon type="save"/>Save Communication Setting</Button>
        				</Link>}>
                        <div>
        				    <PatientCommunicationSetting   {...this.state} {...this.props} />
                        </div>
        			</Card>

	       
    }
}
export default PatientCommunication;
