export type Path = Array<string | number>;

export interface Description {
  Ctor?: new () => any;
  values: Array<{ path: Path; value: any }>;
  structures?: Array<{ path: Path; Ctor: new () => any }>;
  references?: Array<{ path: Path; target: Path }>;
}
