import React from 'react';
import Menu from './Menu'
import './css/main.css'
import './css/sidebar-themes.css'

const DefaultSideBar = (props) => {
    
    const {menu} = props;
    const div_space = { "height": "65px" }
    const custom_style = { "zIndex": 1000 }
    // pinned
    return (
       
        <React.Fragment>
            <nav id="sidebar" className="sidebar-wrapper" style={custom_style}>
                <div className="sidebar-content mCustomScrollbar _mCS_1 mCS-autoHide desktop">
                    <div style={div_space}></div> 
                    {
                        menu.map((submenu) => (
                            <div key={submenu.header} className="sidebar-item sidebar-menu">
                                <Menu header={submenu.header} navData={submenu.navData}/>
                            </div> 
                        ))
                    }
                </div>
            </nav>
        </React.Fragment>
    );

}

export const BigContainer = (props) => {
    return(
        <div className="page-wrapper default-theme sidebar-bg bg1 toggled"/>
    );
}

export default DefaultSideBar;

/* Example:

   const menu = [
        {
            header : "Test", navData : [
                { route: "/Pages/sRemoto", name: "Sistema Remoto" },
                { route: "/about", name: "Info" }
            ]
        },
        {
            header: "Test 2", navData : [
                { route: "/Pages/sRemoto", name: "Sistema Remoto" },
                { route: "/about", name: "Info" }
            ]
        }
    ]

*/