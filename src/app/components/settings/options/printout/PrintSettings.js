import React from 'react';
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Row, Col ,Radio ,Divider} from "antd";
const style ={
  box_shadow:{
    webkitBoxShadow: "1px 3px 1px #9E9E9E",
    mozBoxShadow: "1px 3px 1px #9E9E9E",
    boxShadow: "1px 3px 1px #9E9E9E"
  }
}
class PrintPreview extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return ( <Row>
          <Col span={12}>
            <Radio.Group defaultValue="a" buttonStyle="solid" size="small">
              <Radio.Button value="a">Page Setting</Radio.Button>
              <Radio.Button value="b">Header</Radio.Button>
              <Radio.Button value="c">Patient</Radio.Button>
              <Radio.Button value="d">Footer</Radio.Button>
            </Radio.Group>
            <div>

              <h2>CUSTOMIZE HEADER</h2>
              <Divider style={style}/>
            </div>
          </Col>
          <Col span={12} >
          <div style={style.box_shadow}>
            <h3>pdf</h3>
            </div>
          </Col>


        </Row>);
  }
}
export default PrintPreview;
