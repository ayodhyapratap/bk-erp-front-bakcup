import React from 'react';
import {Form, Checkbox, Row, Col} from 'antd';
import {PATIENT_DETAILS_LIST, EXCLUDE_PATIENT_DOB} from "../../../../constants/hardData";
import {PRINT_PREVIEW_RENDER} from "../../../../constants/api";
import {makeURL} from "../../../../utils/common";

class PatientSettingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let that = this;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };


        let PreviewParamsURL = '?preview=true&type=' + this.props.type + '&sub_type=' + this.props.sub_type;
        if (this.state.print_setting) {
            let keys = Object.keys(this.state.print_setting);
            keys.forEach(function (key) {
                if (that.state.print_setting[key])
                    PreviewParamsURL += '&' + key + '=' + that.state.print_setting[key]
            });
        }
        return (<Row gutter={16}>
                <Col span={12}>
                    <Form {...formItemLayout}>
                        <h2>Customize Patient Details</h2>
                        <Form.Item>
                            <Checkbox>Show Patient Details</Checkbox>
                            <ul className="subLists">
                                {patientDetailsList}
                            </ul>
                        </Form.Item>
                        <Form.Item>
                            <Checkbox>{EXCLUDE_PATIENT_DOB}</Checkbox>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12} style={{textAlign: 'center'}}>
                    <iframe
                        src={makeURL(PRINT_PREVIEW_RENDER + PreviewParamsURL)}
                        style={{width: '100%', height: '100%', minHeight: 800, boxShadow: '-2px 0px 4px #B8B8B8'}}/>
                </Col>

            </Row>
        );
    }
}

export default PatientSettingForm;
