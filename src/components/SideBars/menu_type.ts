import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type menu = Array<menuBlock>;
  
export type menuBlock = {
    header: string,
    navData: Array<navData>
}

export type fatherMenus = Array<fatherMenu>

export type fatherMenu = {
    header: string,
    public_id: string,
    static_menu: static_menu
}

export type static_menu = {
    parent_id: string,
    name: string,
    public_id: string,
    icon?: IconDefinition,
    blocks?: Array<block>
}

export type block = {
    name: string,
    public_id: string,
    // type: string,
}

export type navData = {
    route: string,
    name: string,
    icon?: IconDefinition 
}

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