#!/usr/bin/env node

function createUniformNumericArray(size) {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = Math.random() * 1000;
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

    console.log(`Array size: ${arraySize.toString()}`);
    console.log(`Iterations: ${iterations.toString()}`);
    console.log(`Node.js version: ${process.version}`);
    console.log(`V8 version: ${process.versions.v8}`);

    const uniformArray1 = createUniformNumericArray(arraySize)
    const uniformArray2 = [...uniformArray1];
    delete uniformArray2[10];

    %DebugPrint(uniformArray2);

    const optimizedTime = benchmarkArrayAccess(uniformArray1, "Uniform Array (numbers only)", iterations);
    const deoptimizedTime = benchmarkArrayAccess(uniformArray2, "Holey array", iterations);

    const ratio = deoptimizedTime / optimizedTime;
    console.log(`\nPerformance Summary:`);
    console.log(`Deoptimized array is ${ratio.toFixed(2)}x slower than uniform array`);
}

if (require.main === module) {
    main();
}
