import {Menu} from "antd";
import React from 'react';
import {Link} from "react-router-dom";

export const calendarSettingMenu = (<Menu>
        <Menu.Item key="1">
            <Link to={"/settings/calendarsettings#timings"}>
                Modify Calendar Timings
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to={"/settings/clinics-staff#staff"}>
                Add/Edit Doctor or Staff
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link to={"/settings/clinics-staff#notification"}>
                Modify SMS/Email for Doctor/Staff
            </Link>
        </Menu.Item>
        <Menu.Item key="4">
            <Link to={"/settings/communication-settings"}>
                Modify SMS/Email for Patients
            </Link>
        </Menu.Item>
        <Menu.Item key="5">
            <Link to={"/settings/calendarsettings#categories"}>
                Add/Edit Categroies
            </Link>
        </Menu.Item>
    </Menu>
);
