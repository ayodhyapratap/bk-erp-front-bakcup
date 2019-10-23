import React from "react";
import {Avatar, Card, Col, Empty, Icon, Tag} from "antd";
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import {getAPI, interpolate, makeFileURL} from "../../../utils/common";
import {AGENT_TREE, MEDICAL_HISTORY, PRODUCT_MARGIN} from "../../../constants/api";

const {Meta} = Card;
export default class AgentTreeReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agentData: {},
            agentTreeData: {},
            loading:false,
        };
        this.loadAgentTree = this.loadAgentTree.bind(this);
    }

    componentDidMount() {
        if (this.props.agent) {
            this.loadAgentTree();
        }


    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.agent != newProps.agent)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                if (this.props.agent) {
                    this.loadAgentTree();
                }
            })

    }

    loadAgentTree() {
        let that = this;
        that.setState({
            loading:true,
        });
        let successFn = function (data) {
            that.setState({
                agentData: data,
                loading:false
            }, function () {
                that.setState({
                    agentTreeData: this.general_list(0, data[0][0]),
                    loading:false
                });
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false,
            });
        };

        getAPI(interpolate(AGENT_TREE, [that.props.agent]), successFn, errorFn);
    }

    ref_data_level(user, level) {
        let currentData = this.state.agentData;
        let filterData = currentData[level.toString()] ? currentData[level.toString()].filter(function (item) {
            return item.user.referer == user;
        }) : [];
        return filterData;

    }

    general_list(level, data) {
        let children = this.ref_data_level(data.user.id, level + 1);
        for (let child in children) {
            children[child] = this.general_list(level + 1, children[child]);
        }
        data.children = children;
        return data;
    }

    render() {
        let that = this;
        return (
            <div style={{background:"#f0f2f5",paddingBottom:"20px" }}>
                {/*{[that.state.agentTreeData].length >0 ?*/}

                <h2 style={{padding:"10px"}}>Agent Tree</h2>
                {/*<div style={{width:'100%',overflowX:'scroll'}}>*/}
                <OrgChart tree={this.state.agentTreeData} NodeComponent={MyNodeComponent}/>
                {/*</div>*/}
                {/*: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}*/}

            </div>
        )
    }

}
const MyNodeComponent = function ({node}) {
    return (
        <div >
            {node.user ? <>
                <Card style={{margin: 'auto', height: 120, width: 300}} hoverable>
                    {/*<p>{node.user ? node.user.first_name : null}</p>*/}
                    <Meta avatar={(node.image ? <Avatar src={makeFileURL(node.image)} size={50}/> :
                        <Avatar style={{backgroundColor: '#87d068'}} size={50}>
                            {node.user.first_name ? node.user.first_name.charAt(0) :
                                <Icon type="user"/>}
                        </Avatar>)}
                          title={node.user.first_name}
                          description={
                              <span>{node.is_approved ? <Tag color="#87d068">Approved</Tag> : <Tag color="#f50">Not
                                  Approved</Tag>}<br/>{node.user.mobile}<br/>{node.user.email}</span>}/>

                </Card>

            </> : null}


        </div>
    );
};