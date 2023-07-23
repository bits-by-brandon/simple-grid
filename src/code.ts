import type { Command } from "./models/command";
import { pushColumnRight } from "./commands/pushColumnRight";
import { pushColumnLeft } from "./commands/pushColumnLeft";
import { SetToColumnParams, setToColumn } from "./commands/setToColumn";

const commands: Command<any>[] = [pushColumnRight, pushColumnLeft, setToColumn];

type InputParams = SetToColumnParams;

try {
  figma.parameters.on("input", (inputEvent: ParameterInputEvent) => {
    if (figma.currentPage.selection.length === 0) {
      throw new Error("Select a node before running this plugin");
    }

    // Find the relevant command based on the input parameters
    let foundCommand: Command | null = null;
    for (const command of commands) {
      const params = command.getParams();
      if (params.includes(inputEvent.key)) {
        foundCommand = command;
        break;
      }
    }

    if (!foundCommand) throw new Error(`No command found for key ${inputEvent.key}`);
    foundCommand.handleInput(inputEvent);
  });

  // @ts-ignore
  figma.on("run", ({ parameters, command }: RunEvent<InputParams>) => {
    switch (command) {
      case "setToColumn":
        setToColumn.run(parameters as SetToColumnParams);
        break;
      case "pushColumnLeft":
        pushColumnLeft.run();
        break;
      case "pushColumnRight":
        pushColumnRight.run();
        break;
    }

    figma.closePlugin();
  });
} catch (error: any) {
  figma.closePlugin(error.toString());
}
