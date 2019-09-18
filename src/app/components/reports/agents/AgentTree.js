import React from "react";
import {Card} from "antd";
import Tree from 'react-d3-tree';
import {getAPI, interpolate} from "../../../utils/common";
import {AGENT_TREE, MEDICAL_HISTORY, PRODUCT_MARGIN} from "../../../constants/api";

export default class AgentTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agentData:{},
        }
        this.loadAgentTree = this.loadAgentTree.bind(this);
    }
    componentDidMount() {
        this.loadAgentTree();
    }

    loadAgentTree(){
        let that=this;
        let successFn = function (data) {
            that.setState({
                agentData: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(AGENT_TREE, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        console.log(this.state.agentData);
        // const myTreeData = [
        //     {
        //         "name": "Ritesh",
        //         "children": [
        //             {
        //                 "name": "Mohit",
        //                 "children": [
        //                     {
        //                         "name": "test again by 1"
        //                     },
        //                     {
        //                         "name": "test 103"
        //                     },
        //                     {
        //                         "name": "test singh"
        //                     },
        //
        //                 ]
        //             },
        //
        //         ],
        //
        //     }
        // ];
        let newarr=[];
        let arrkey=[];
        let reQdata=[];
        arrkey = Object.keys(this.state.agentData);
        for (let i=0;i<arrkey.length;i++){
            this.state.agentData[i].forEach(function (item) {
                reQdata.push({name:item.user.referer_data.referer.first_name});
                // reQdata.children.push{name:item.user.first}
               newarr.push(item);
            });
        }
        console.log("newarray",reQdata);


        // let arrP={children:[]};
        // // for (let i=0;i<len.length;i++){
        //
        // newarr.forEach(function(item){
        //         arrP.name=item.user.referer_data.referer.first_name;
        //
        //         arrP.children.push({name:item.user.first_name});
        //     })
        // // }
        //
        // console.log("new",arrP);

        return(
            <Card>
                <h2>hello</h2>
                <div style={{width: '100%', height: '100%'}}>

                    {/*<Tree data={myTreeData} orientation="vertical" />*/}

                </div>
            </Card>
        )
    }

}
