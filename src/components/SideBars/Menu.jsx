import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

// https://www.digitalocean.com/community/tutorials/how-to-use-font-awesome-5-with-react

const Menu = (props) => {
  const { header, navData, pinned } = props;
  return pinned ? pinned_menu(header, navData) : toggled_menu(header, navData);
};
export default Menu;

function pinned_menu(header, navData) {
    return <ul>
        <div className="hm-pinned" >{String(header).toUpperCase().substring(0,3)}</div>
        <li className="sbm-pinned">
        {navData.map((item) => (
          <a
            key={item.route}
            href={item.route}
            className={check_path(item.route) ? "active" : ""}
          >
            <FontAwesomeIcon
              icon={item.icon === undefined ? faPlayCircle : item.icon}
              className="icon-pinned"
            />
            
          </a>
        ))}
        
        </li>    
    
    </ul>;
}

function toggled_menu(header, navData) {
  return (
    <ul>
      <li className="header-menu">
        {" "}
        <span>{header}</span>{" "}
      </li>
      <li className="sidebar-submenu">
        {navData.map((item) => (
          <a
            key={item.route}
            href={item.route}
            className={check_path(item.route) ? "actived" : ""}
          >
            <FontAwesomeIcon
              icon={item.icon === undefined ? faPlayCircle : item.icon}
              style={{ marginRight: "5px" }}
            />
            <span className="menu-text">{item.name}</span>
            <span
              className={
                item.badge === undefined
                  ? "badge badge-pill"
                  : "badge badge-pill" + item.badge.class
              }
            >
              {item.badge === undefined ? "" : item.badge.content}
            </span>
          </a>
        ))}
      </li>
    </ul>
  );
}

function check_path(path) {
  return (
    window.location.pathname === path || window.location.pathname === path + "#"
  );
}
