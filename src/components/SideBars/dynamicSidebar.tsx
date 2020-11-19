import React, { Component } from "react";
import FatherMenu from "./FatherMenu";
import "./css/main.css";
import "./css/sidebar-themes.css";
import "./css/styles.css";
import { fatherMenus } from "./menu_type";

export interface MenuProps {
  menu: fatherMenus;
  pinned?: boolean;
  add_submenu_modal?: Array<Component>;
  edit_submenu_modal?: Array<Component>;
  delete_submenu_modal?: Array<Component>;
  modal_show?: boolean;
}

class DynamicSideBar extends Component<MenuProps> {
  render() {
    const div_space = { height: "65px" };
    const custom_style = { zIndex: 1000 };
    let _ = require("lodash");
    // pinned
    return (
      <React.Fragment>
        <nav id="sidebar" className="sidebar-wrapper" style={custom_style}>
          <div className="sidebar-content mCustomScrollbar _mCS_1 mCS-autoHide desktop">
            <div style={div_space}></div>
            {this.props.menu.map((menu, ix) => (
              // menú estático con capacidad de añadir bloques:
              <div
                key={_.uniqueId("father_menu")}
                className="sidebar-item sidebar-menu pinned"
              >
                <FatherMenu
                  
                  fatherMenu={menu} pinned={this.props.pinned}
                  add_submenu_modal={this.props.add_submenu_modal[ix]}
                  edit_submenu_modal={this.props.edit_submenu_modal[ix]}
                  delete_submenu_modal={this.props.delete_submenu_modal[ix]}
                  modal_show={this.props.modal_show}
                />
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
