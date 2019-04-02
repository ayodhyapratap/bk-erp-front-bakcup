import React from 'react';
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Row,Form, Col ,Radio, Input,Divider} from "antd";
import HeaderSettingForm from "./HeaderSettingForm";
import DocumentPdf from "./DocumentPdf";
import PageSetting from "./PageSettingForm"
import Patient from "./PatientSettingForm"
import Footer from "./FooterSettingForm"

const { TextArea } = Input;

const radioTab = ['Page','Header','Patient','Footer'];
const  radioTabList= radioTab.map((radioTab)=><Radio.Button  value={radioTab}>{radioTab}</Radio.Button>);
class PrintPreview extends React.Component{
  constructor(props){
    super(props);
    this.state={
selectedFormType:'Header'
    }
  }

changeFormType=(e)=>{
  this.setState({
    selectedFormType : e.target.value
  })
 
}
  render(){

  const HeaderSettingFormObject = Form.create()(HeaderSettingForm);
  const PageSettingObject = Form.create()(PageSetting);
  const patientObject = Form.create()(Patient);
  const FooterObject = Form.create()(Footer);

     return (<Row>
        <Col span={12}>
          <Radio.Group  buttonStyle="solid" size="small"  value={this.seader} onChange={this.changeFormType}>
              {radioTabList}
          </Radio.Group>
          <div className="div_padding_top">
            <RenderForm forms={{Header:HeaderSettingFormObject}} {...this.state}/>  
            <RenderForm forms={{Page:PageSettingObject}} {...this.state}/>  
            <RenderForm forms={{Patient:patientObject}} {...this.state}/>  
            <RenderForm forms={{Footer:FooterObject}} {...this.state}/>  
            
          </div>

        </Col>
        <Col span={12}>
          <h2>Hi</h2>
        </Col>
      </Row>
      );
    
  }
  
}
export default PrintPreview;

function RenderForm(props){
  if(props.forms[props.selectedFormType]){
    let Form = props.forms[props.selectedFormType];
    return <Form/>  
  }
  return null;
}