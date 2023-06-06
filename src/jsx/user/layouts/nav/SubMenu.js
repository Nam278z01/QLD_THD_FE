import React, { useState } from "react";
import { NavItem, NavLink } from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";

import { Link } from "react-router-dom";
import "../../newSideBar.css";

const SubMenu = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const { title, items } = props;

  return (
    <div>
      <NavItem onClick={toggle} className={!collapsed ? "menu-open" : ""}>
        <NavLink className="dropdown-toggle">{title}</NavLink>
      </NavItem>
      <Collapse
        in={!collapsed}
        className={`items-menu ${!collapsed ? "mb-1" : ""}`}
      >
        {items.map((item, index) => (
          <NavItem key={index} className="pl-4">
            <NavLink tag={Link} to={item.target}>
              {item.title}
            </NavLink>
          </NavItem>
        ))}
      </Collapse>
    </div>
  );
};

export default SubMenu;
