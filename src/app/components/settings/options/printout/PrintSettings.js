import React from 'react';
import {Row, Form, Col, Radio, Input, Divider} from "antd";
import HeaderSettingForm from "./HeaderSettingForm";
import PageSetting from "./PageSettingForm"
import Patient from "./PatientSettingForm"
import Footer from "./FooterSettingForm"
import {CUSTOMIZE_PAPER_TYPE} from "../../../../constants/hardData";
import {makeURL} from "../../../../utils/common";
import {PRINT_PREVIEW_RENDER} from "../../../../constants/api";

const {TextArea} = Input;

const radioTabList = CUSTOMIZE_PAPER_TYPE.map((radioTab) => <Radio.Button value={radioTab}>{radioTab}</Radio.Button>);

class PrintPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFormType: 'PAGE'
        }
    }

    changeFormType = (e) => {
        this.setState({
            selectedFormType: e.target.value
        })

    }

    render() {

        const HeaderSettingFormObject = Form.create()(HeaderSettingForm);
        const PageSettingObject = Form.create()(PageSetting);
        const patientObject = Form.create()(Patient);
        const FooterObject = Form.create()(Footer);

        return (<Row>
                <Col span={24}>
                    <div style={{textAlign: 'center'}}>
                        <br/>
                        <Radio.Group buttonStyle="solid" size="small" onChange={this.changeFormType}
                                     defaultValue={this.state.selectedFormType}>
                            {radioTabList}
                        </Radio.Group>
                    </div>
                    <div className="div_padding_top">
                        <RenderForm forms={{PAGE: PageSettingObject}} {...this.state} {...this.props}/>
                        <RenderForm forms={{HEADER: HeaderSettingFormObject}} {...this.state} {...this.props}/>
                        <RenderForm forms={{PATIENT: patientObject}} {...this.state} {...this.props}/>
                        <RenderForm forms={{FOOTER: FooterObject}} {...this.state} {...this.props}/>
                    </div>

                </Col>

            </Row>
        );

    }

}

export default PrintPreview;

function RenderForm(props) {
    if (props.forms[props.selectedFormType]) {
        let Form = props.forms[props.selectedFormType];
        return <Form key={props.selectedFormType} {...props}/>
    }
    return null;
}
