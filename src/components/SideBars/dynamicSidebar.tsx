import React, { Component } from "react";
import FatherMenu from "./FatherMenu";
import "./css/main.css";
import "./css/sidebar-themes.css";
import { fatherMenus} from "./menu_type";

export interface MenuProps {
    menu: fatherMenus;
    pinned?: boolean;
}

class DynamicSideBar extends Component<MenuProps> {
  render() {
    const div_space = { height: "65px" };
    const custom_style = { zIndex: 1000 };
    // pinned
    return (
      <React.Fragment>
        <nav id="sidebar" className="sidebar-wrapper" style={custom_style}>
          <div className="sidebar-content mCustomScrollbar _mCS_1 mCS-autoHide desktop">
            <div style={div_space}></div>
            {this.props.menu.map((menu) => (
              <div
                key={menu.header}
                className="sidebar-item sidebar-menu pinned"
              >
                <FatherMenu header={menu.header} static_menu={menu.static_menu} pinned={this.props.pinned}/>
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

export default DynamicSideBar;
