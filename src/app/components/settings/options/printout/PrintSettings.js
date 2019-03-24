import React from 'react';
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Row,Form, Col ,Radio, Input,Divider} from "antd";
import HeaderSettingForm from "./HeaderSettingForm";
import DocumentPdf from "./DocumentPdf";

const { TextArea } = Input;

const radioTab = ['Page','Header','Patient','Footer'];
const  radioTabList= radioTab.map((radioTab)=><Radio.Button value={radioTab}>{radioTab}</Radio.Button>);
class PrintPreview extends React.Component{
  constructor(props){
    super(props);
    this.state={
selectedFormType:''
    }
  }

changeFormType=(e)=>{
  this.setState({
    selectedFormType : e.target.value
  })
 
}
  render(){

  const HeaderSettingFormObject = Form.create({ name: 'setting' })(HeaderSettingForm);

     return (<Row>
        <Col span={12}>
          <Radio.Group  buttonStyle="solid" size="small" value={this.state.selectedFormType} onChange={this.changeFormType}>
              {radioTabList}
          </Radio.Group>
            <RenderForm forms={{Header:HeaderSettingFormObject}} {...this.state}/>  
          <div className="div_padding_top">
            <h2>{this.state.selectedFormType}</h2>
          </div>

        </Col>
        <Col>
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