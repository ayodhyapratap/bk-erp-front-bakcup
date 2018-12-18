import React from "react";
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import VideosList from './videos/VideosList';
import BlogList from "./blog/BlogList";
import ContactsList from "./contacts/ContactsList";
import DiseaseList from "./disease/DiseaseList";
import EventsList from "./events/EventsList";

const {Content} = Layout;
export default class WebAdminHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Content className="main-container" style={{
            margin: '24px 16px',
            // padding: 24,
            minHeight: 280,
            // marginLeft: '200px'
        }}>

            <Switch>
                <Route path="/web/videos" render={(route) => <VideosList/>}/>
                <Route path="/web/blog" render={(route) => <BlogList/>}/>
                <Route path="/web/contact" render={(route) => <ContactsList/>}/>
                <Route path="/web/disease" render={(route) => <DiseaseList/>}/>
                <Route path="/web/event" render={(route) => <EventsList/>}/>
            </Switch>
        </Content>
    }
}
