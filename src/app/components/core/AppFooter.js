import React from "react";
import {Layout} from 'antd';

const {Footer} = Layout;

class AppFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Footer style={{textAlign: 'center'}}>
            Powered by: <a target="__blank" href="https://plutonic.co.in">Plutonic Services</a>
        </Footer>
    }
}

export default AppFooter;
