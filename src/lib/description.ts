export interface Description {
  is_array: boolean;
  primitives: Array<{ path: Array<string | number>; value: any }>;
}
