import { faChalkboard, faCog } from "@fortawesome/free-solid-svg-icons";

function example_menu() {
  // Esta es la estructura base del menu
  return [
    {
      header: "Admininistración:",
      public_id: "modelamiento_ems",
      static_menu: {
        name: "Modelamiento EMS",
        icon: faChalkboard,
        blocks: [{ name: "Block 1", public_id:"block1_id"}, {name: "Block 2", public_id:"block2_id"}]
      },
    },
    {
      header: "Componentes:",
      public_id: undefined,
      static_menu: {
        name: undefined,
        icon: faCog,
        blocks: [{name:"Componente 1", public_id:"212ab"}]
      },
      
    }
  ];
}
export default example_menu;




