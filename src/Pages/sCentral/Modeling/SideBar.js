import { faChalkboard, faCog } from "@fortawesome/free-solid-svg-icons";

function static_menu() {
  // Esta es la estructura base del menu
  return [
    {
      header: "Admininistración:",
      public_id: "modelamiento_ems",
      static_menu: {
        name: "Modelamiento EMS",
        icon: faChalkboard,
        blocks: []
      },
    },
    {
      header: "Componentes:",
      public_id: undefined,
      static_menu: {
        name: undefined,
        icon: faCog,
        blocks: []
      },
      
    }
  ];
}
export default static_menu;


export function static_menu2() {
  return [
    {
      header: "Admininistración:",
      static_menu: {
        name: "Modelamiento EMS",
        icon: faChalkboard,
        blocks: [{name:"Este es un nombre mucho mas largo1"}, {name:"Este es un nombre mucho mas largo2"}]
      },
      
    },
    {
      header: "Componentes:",
      static_menu: {
        name: "block1",
        icon: faChalkboard,
        blocks: [{name:"Sistema Eléctrico principal"}, {name:"Component2"}]
      },
      
    }
  ];
}

