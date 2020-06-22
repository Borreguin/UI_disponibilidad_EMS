import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

// https://www.digitalocean.com/community/tutorials/how-to-use-font-awesome-5-with-react

const Menu = (props) => {
    const { header, navData } = props;
    return ( 
        <ul>
            <li className="header-menu"> <span>{header}</span> </li>
            <li className="sidebar-submenu">
                {navData.map((item) => (
                        <a
                            key={item.route}
                            href={item.route}
                            className={check_path(item.route) ? "active" : ""}
                        >
                            <FontAwesomeIcon
                                icon={item.icon===undefined? faPlayCircle: item.icon}
                                style={{ "marginRight": "5px" }}
                            />
                            <span className="menu-text">{item.name}</span>
                            <span
                                className={
                                 item.badge===undefined ? "badge badge-pill": "badge badge-pill" + item.badge.class
                                }>
                                {item.badge===undefined ? "" : item.badge.content}
                            </span>
                        </a>
                   
                    ))
                }
            </li>
        </ul>
    );
}
export default Menu;

function check_path(path) { 
    return (window.location.pathname === path) ||
        (window.location.pathname === path + "#")

}