
import { faTools } from "@fortawesome/free-solid-svg-icons";

function menu() { 

    return [
            {
                header: "Modelamiento:", navData: [
                    { route: "/Pages/sRemoto", name: "Administración de Nodos", icon: faTools },
                    { route: "/Pages/p2", name: "NewTest" }
                ]
            },
            {
                header: "Test 2", navData: [
                    { route: "/new", name: "Sistema Remoto" },
                    { route: "/about-", name: "Info" }
                ]
            }
        ]
}
export default menu;