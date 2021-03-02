export type TAG = {
    tag_name: string,
    filter_expression: string,
    activado: boolean
}

export type UTR = {
    id_utr: string,
    utr_nombre: string,
    utr_tipo: string,
    activado: boolean,
    utr_code: string,
    tags?: Array<TAG>,
}