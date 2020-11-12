import { faChalkboard, faTools } from "@fortawesome/free-solid-svg-icons";

function static_menu() {
  return [
    {
      header: "Modelamiento:",
      static_menu: {
        name: "Modelamiento EMS",
        icon: faChalkboard,
      },
    },
  ];
}
export default static_menu;
