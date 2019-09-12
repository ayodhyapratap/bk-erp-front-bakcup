import React from "react";
import {Button, Card, Checkbox, Col, Icon, Radio, Row, Select} from "antd";
import {EMR_RELATED_REPORT} from "../../../constants/hardData";
import CustomizedTable from "../../common/CustomizedTable";

export default class MlmReportHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type:'ALL',
            sidePanelColSpan:4,
            advancedOptionShow: true,
            report:[],
        };
    }


    onChangeHandle =(type,value)=>{
        let that=this;
        this.setState({
            [type]:value.target.value,
        })
    };

    advancedOption(value){
        this.setState({
            advancedOptionShow:value,
        })
    }
    changeSidePanelSize = (sidePanel) => {
        this.setState({
            sidePanelColSpan: sidePanel ? 0 : 4
        })
    };
    handleChangeOption = (type,value) => {
        let that = this;
        this.setState({
            [type]: value,
        })
    };
    onChangeCheckbox=(e)=>{
        this.setState({
            is_complete: !this.state.is_complete,
        });
    };
    render() {
    const columns=[{}];
        return <div>
            <h2>MLM Report <Button type="primary" shape="round"
                                   icon={this.state.sidePanelColSpan ? "double-right" : "double-left"}
                                   style={{float: "right"}}
                                   onClick={() => this.changeSidePanelSize(this.state.sidePanelColSpan)}>Panel</Button>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={(24 - this.state.sidePanelColSpan)}>
                        <CustomizedTable
                            loading={this.state.loading}
                            columns={columns}
                            dataSource={this.state.report}/>
                    </Col>

                    <Col span={this.state.sidePanelColSpan}>
                        <Radio.Group buttonStyle="solid" defaultValue='aa' onChange={(value)=>this.onChangeHandle('type',value)}>
                            <h2>Treatments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value='aa'>
                                All MLM
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {/*{EMR_RELATED_REPORT.map((item) => <Radio.Button*/}
                            {/*    style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}*/}
                            {/*    value={item.value}>*/}
                            {/*    {item.name}*/}
                            {/*</Radio.Button>)}*/}
                        </Radio.Group>

                        <br/>
                        <br/>
                        {this.state.advancedOptionShow?<>
                            <Button type="link" onClick={(value)=>this.advancedOption(false)}>Hide Advanced Options </Button>
                            <Col> <br/>
                                {/*<h4>Doctors</h4>*/}
                                {/*<Select style={{minWidth: '200px'}} mode="multiple" placeholder="Select Doctors"*/}
                                {/*        onChange={(value)=>this.handleChangeOption('doctors',value)}>*/}
                                {/*    {this.state.practiceDoctors.map((item) => <Select.Option value={item.id}>*/}
                                {/*        {item.user.first_name}</Select.Option>)}*/}
                                {/*</Select>*/}

                                <br/>
                                <br/>
                                <Checkbox  onChange={(e)=>this.onChangeCheckbox(e)}> Only Completed</Checkbox>
                            </Col>
                        </>: <Button type="link" onClick={(value)=>this.advancedOption(true)}>Show Advanced Options </Button>}
                    </Col>
                </Row>
            </Card>
        </div>
    }
}
