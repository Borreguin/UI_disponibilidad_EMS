import React, { useState } from "react";
import { Navbar, Nav, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import invlogo from "../images/logo_reverse.png";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompressArrowsAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
const DefaultNavBar = (props) => {
  const { brand, navData, bg, variant, showpinned, onClickBtnPin } = props;
  const [btnPin, setBtnPin] = useState(true);

  const _handle_onClickBtnPin = () => { 
    setBtnPin(!btnPin);
    if (onClickBtnPin !== undefined) { 
      onClickBtnPin(btnPin);
    }
  }

  return (
    <React.Fragment>
      <Navbar bg={bg} variant={variant} expand="sm" className="nav-bar-style">
        {showpinned ? (
          <div className={"nav-btn-pinned"}
            onClick={_handle_onClickBtnPin}
          >
            <FontAwesomeIcon
              className="nav-pinned"
              icon={btnPin ? faCompressArrowsAlt : faBars}
              inverse
            />
          </div>
        ) : (
          <></>
        )}
        <Navbar.Brand className="nav-brand-custom" href={brand.route}>
          {brand.name}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            {navData.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
                className="nav-link-custom"
              >
                {item.name}
              </NavLink>
            ))}
          </Nav>

          <Form inline>
            <a href="/">
              <img
                src={invlogo}
                alt="Logo de CENACE"
                style={{ height: "45px" }}
              ></img>
            </a>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  );
};

export default DefaultNavBar;
