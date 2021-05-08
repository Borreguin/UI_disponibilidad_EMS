
import { PortModel } from "@projectstorm/react-diagrams";

export const canLinkToInportPort = (port: PortModel) => {
    // Esta función comprueba si se puede realizar las conexiones:
    // 1. Input -> SERIE
    // 2. Input -> PARALELO
    // 3. Input -> ROOT (conexión con root) 
    // 4. Input -> PROMEDIO (conexión para operación: promedio)
    // 5. Input -> PONDERADO (conexión para operación: ponderado)
    const isSerialOutPort = port.getType() === "SERIE";
    const isParallelOutPort = port.getType() === "PARALELO";
    const isOutPut = port.getType() === "ROOT";
    const isAverageOutPut = port.getType() === "PROMEDIO";
    const isWeightedOutPut = port.getType() === "PONDERADO";
    const isFreeConnect = Object.keys(port.links).length === 0;
    const connect = isFreeConnect &&
      (isSerialOutPort || isParallelOutPort || isOutPut || isAverageOutPut || isWeightedOutPut);
    
    return connect;
  }