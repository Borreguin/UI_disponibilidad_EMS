import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type menu = Array<menuBlock>;
  
export type menuBlock = {
    header: string,
    navData: Array<navData>
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