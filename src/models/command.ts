export interface Command<T extends object = object> {
  getParams: () => ReadonlyArray<keyof T>;
  handleInput: (inputEvent: ParameterInputEvent) => void;
  run: (params: T) => void;
}
