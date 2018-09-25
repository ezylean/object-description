export type Path = Array<string | number>;

export interface Description {
  is_array?: boolean;
  primitives: Array<{ path: Path; value: any }>;
  references?: Array<{ path: Path; target: Path }>;
}
