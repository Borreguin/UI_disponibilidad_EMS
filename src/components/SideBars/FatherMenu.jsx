import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPlus,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

// https://www.digitalocean.com/community/tutorials/how-to-use-font-awesome-5-with-react

const FatherMenu = (props) => {
  const { header, static_menu, pinned } = props;
  return pinned
    ? pinned_menu(header, static_menu)
    : toggled_menu(header, static_menu);
};
export default FatherMenu;

// menu minimizado
function pinned_menu(header, static_menu) {
  return (
    <ul>
      <div className="hm-pinned">
        {String(header).toUpperCase().substring(0, 3)}
      </div>
      <li className="sbm-pinned">
        {/*static_menu.map((item) => (
          <a
            key={item.route}
            href="#"
            className="active"
          >
            <FontAwesomeIcon
              icon={item.icon === undefined ? faPlayCircle : item.icon}
              className="icon-pinned"
            />
            
          </a>
        ))*/}
      </li>
    </ul>
  );
}

// menu extendido
function toggled_menu(header, static_menu) {
  return (
    <ul>
      <li className="header-menu">
        {" "}
        <span>{header}</span>{" "}
      </li>
      <li className="sidebar-submenu">
        {
          <a key={static_menu.name}>
            <FontAwesomeIcon
              icon={static_menu.icon === undefined ? faPlayCircle : static_menu.icon}
              style={{ marginRight: "5px" }}
            />
            <span className="menu-text">{static_menu.name}</span>
          </a>

          /*
        static_menu.map((item) => (
          <a
            key={item.route}
            href="#"
            className="actived"
          >
            <FontAwesomeIcon
              icon={item.icon === undefined ? faPlayCircle : item.icon}
              style={{ marginRight: "5px" }}
            />
            <span className="menu-text">{item.name}</span>
            <span className="badge badge-pill" >
              <FontAwesomeIcon inverse icon={faPlusCircle} size="2x" />
            </span>
          </a>
        ))*/
        }
      </li>
    </ul>
  );
}
