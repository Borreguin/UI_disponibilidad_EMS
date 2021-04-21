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
    blocks?: Array<block>,
    object?: properties
}

export type properties = {
    public_id: string,
    document: string,
    name: string,
    position_x_y: Array<Number>,
    block_leafs: Array<block_leaf>,
    operation_blocks: Array<operation_block>
}

export type block_leaf = {
    public_id: string,
    calculation_type: string,
    document: string,
    name: string,
    position_x_y: Array<Number>
}

export type operation_block = {
    public_id: string,
    name: string,
    type: string,
    operator_ids: Array<string>,
    position_x_y: Array<Number>
}

export type block = {
    name: string,
    public_id: string,
    object?: Object
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