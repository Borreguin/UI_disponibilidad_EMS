export type Selected = {
  entidad_tipo: string;
  entidad_nombre: string;
  utr_nombre?: string;
};

export type SelectedID = {
  nodo: string;
  entidad: string;
  utr?: string;
};

export type UTR = {
    id_utr: string;
    utr_tipo: string;
    utr_nombre: string;
    activado: boolean;
    protocol: string,
    latitude: number,
    longitude: number
  };

