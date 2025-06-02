function createUniformArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i);
  }
  return arr;
}

function createMixedArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    const r = i % 3;
    if (r === 0) arr.push(i);             // Integer
    else if (r === 1) arr.push(Boolean(i % 2)); // Boolean
    else arr.push("str" + i);             // String
  }
  return arr;
}

const size = 10_000_000;
const needle = size - 10;

// Uniform integer array
const uniform = createUniformArray(size);

// Mixed array
const mixed = createMixedArray(size);

console.time("Search in uniform array");
uniform.includes(needle);
console.timeEnd("Search in uniform array");

console.time("Search in mixed array");
mixed.includes(needle);
console.timeEnd("Search in mixed array");
