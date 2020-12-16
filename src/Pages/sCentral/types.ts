export type bloqueroot = {
  public_id: string;
  name: string;
  block_leafs: Array<bloqueleaf>;
};

export type root_block_form = {
  name: string;
};

export type leaf_block_form = {
  name: string;
};

export type root_component_form = {
  name: string;
};

export type bloqueleaf = {
  public_id: string;
  name: string;
};
