import React, { Component } from "react";
import Menu from "./Menu";
import "./css/main.css";
import "./css/sidebar-themes.css";
import { menu } from "./menu_type";

export interface MenuProps {
    menu: menu;
    pinned?: boolean;
}

class DefaultSideBar extends Component<MenuProps> {
  render() {
    const div_space = { height: "65px" };
    const custom_style = { zIndex: 1000 };
    // pinned
    return (
      <React.Fragment>
        <nav id="sidebar" className="sidebar-wrapper" style={custom_style}>
          <div className="sidebar-content mCustomScrollbar _mCS_1 mCS-autoHide desktop">
            <div style={div_space}></div>
            {this.props.menu.map((submenu) => (
              <div
                key={submenu.header}
                className="sidebar-item sidebar-menu pinned"
              >
                    <Menu header={submenu.header} navData={submenu.navData} pinned={this.props.pinned}/>
              </div>
            ))}
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export const BigContainer = (props) => {
  return <div className="page-wrapper default-theme sidebar-bg bg1 toggled" />;
};

export default DefaultSideBar;
