export type bloqueroot = {
    public_id: string,
    name: string,
    blockleafs: Array<bloqueleaf>
}

export type root_block_form = {
    name: string;
  };

  export type leaf_block_form = {
    name: string;
  };

export type bloqueleaf = {
    public_id: string,
    name: string,
}