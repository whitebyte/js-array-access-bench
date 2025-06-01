#!/usr/bin/env node

function createUniformStringArray(size) {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = "test";
    }
    return arr;
}

function createNonUniformArray(size) {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        switch (i % 5) {
            case 0: arr[i] = Math.random() * 1000; break;
            case 1: arr[i] = "string_" + i + "_".repeat(i % 50); break;
            case 2: arr[i] = { id: i, data: new Array(i % 20).fill(0) }; break;
            case 3: arr[i] = [1, 2, 3, i, "nested", { deep: true }]; break;
            case 4: arr[i] = i % 2 === 0; break;
        }
    }
    return arr;
}

function benchmarkArrayAccess(arr, arrayType, iterations = 1000000) {
    const indices = [];
    for (let i = 0; i < iterations; i++) {
        indices.push(Math.floor(Math.random() * arr.length));
    }

    // Warm up
    for (let i = 0; i < 1000; i++) {
        arr[indices[i % indices.length]];
    }

    // Actual benchmark
    const start = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        const val = arr[indices[i]];
        // Prevent optimization by using the value
        if (val === null) console.log("unlikely");
    }

    const end = process.hrtime.bigint();
    const timeNs = Number(end - start);
    const timeMs = timeNs / 1000000;
    const avgNsPerAccess = timeNs / iterations;

    console.log(`\n${arrayType}:`);
    console.log(`  Total time: ${timeMs.toFixed(3)} ms`);
    console.log(`  Average per access: ${avgNsPerAccess.toFixed(2)} ns`);
    console.log(`  Accesses per second: ${(iterations / (timeMs / 1000)).toLocaleString()}`);

    return avgNsPerAccess;
}

function main() {
    const arraySize = parseInt(process.argv[2]) || 100000;
    const iterations = parseInt(process.argv[3]) || 1000000;

    console.log(`Array Access Time Benchmark`);
    console.log(`Array size: ${arraySize.toString()}`);
    console.log(`Iterations: ${iterations.toString()}`);
    console.log(`Node.js version: ${process.version}`);
    console.log(`V8 version: ${process.versions.v8}`);

    const uniformStringArray = createUniformStringArray(arraySize);
    const mixedArray = createNonUniformArray(arraySize);

    const uniformTime = benchmarkArrayAccess(uniformStringArray, "Uniform Array (fixed strings only)", iterations);
    const mixedTime = benchmarkArrayAccess(mixedArray, "Non-uniform Array (mixed types)", iterations);

    const ratio = uniformTime / mixedTime;
    console.log(`Non-uniform array is ${ratio.toFixed(2)}x slower than uniform array`);
}

if (require.main === module) {
    main();
}
