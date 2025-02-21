import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

let wasmerInitialised = false;
export function initTerminal() {
  import("@wasmer/sdk").then(async ({ Wasmer, init, initializeLogger }) => {
    console.log("Initializing Wasmer...");
    
    if (!wasmerInitialised) {
      await init(); // Ensures WebAssembly is initialized
      initializeLogger("debug");
      wasmerInitialised = true;
      console.log("Wasmer initialized!");
    }
    


    const term = new Terminal({ cursorBlink: true, convertEol: true });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(document.getElementById("terminal"));
    fit.fit();

    term.writeln("Starting terminal...");
    try {
      const pkg = await Wasmer.fromRegistry("sharrattj/bash");
      console.log("Package loaded:", pkg);

      const instance = await pkg.entrypoint.run({
    options: ["-i"],  // `-i` forces interactive mode
});
      connectStreams(instance, term);
    } catch (error) {
      console.error("Failed to load Wasmer package:", error);
    }
  }).catch(console.error);
}

const encoder = new TextEncoder();

function connectStreams(instance, term) {
    const stdin = instance.stdin?.getWriter();
    term.onData(data => stdin?.write(encoder.encode(data)));
    instance.stdout.pipeTo(new WritableStream({ write: chunk => term.write(chunk) }));
    instance.stderr.pipeTo(new WritableStream({ write: chunk => term.write(chunk) }));
}
