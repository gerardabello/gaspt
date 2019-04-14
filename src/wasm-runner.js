const addStringToMemory = (memory, string) => {
  // Convert the JS String to UTF-8 data
  const encoder = new TextEncoder("utf-8");
  const encodedString = encoder.encode(string);

  // NULL is conventionally at address 0, so we "use up" the first 4
  // bytes of address space to make our lives a bit simpler.
  const base = 4;

  // beginning, followed by the UTF-8 string bytes.
  const asBytes = new Uint8Array(memory.buffer, base, encodedString.length);

  // Copy the UTF-8 into the WASM memory.
  asBytes.set(encodedString);

  return { start: base, length: asBytes.length };
};

export default async (wasmLoader, exportName, arg) => {
  // Memory size is in pages (64KB each)

  const wasmPathTracer = await wasmLoader();
  const wasmMemory = wasmPathTracer.instance.exports.memory;

  const { start: memStart, length: memLength } = addStringToMemory(
    wasmMemory,
    JSON.stringify(arg)
  );

  const func = wasmPathTracer.instance.exports[exportName];
  const resultLength = func(memStart, memLength);

  const asBytes = new Uint8Array(wasmMemory.buffer, memStart, resultLength);

  const string = new TextDecoder("utf-8").decode(asBytes);
  return string;
};
