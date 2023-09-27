import { performance } from "perf_hooks";
import supertest from "supertest";
import { buildApp } from "./app";

const app = supertest(buildApp());

async function basicLatencyTest() {
    await app.post("/reset").expect(204);
    const start = performance.now();
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    console.log(`Latency: ${performance.now() - start} ms`);
}

async function simultaneousChargeTest() {
    await app.post("/reset").expect(204);
    for (let i = 0; i < 5; i++) {
        const response = await app.post("/charge").expect(200);
        console.log(`Response ${i + 1}:`, response.body);
        await new Promise(resolve => setTimeout(resolve, 50)); 
    }
}


async function runTests() {
    await basicLatencyTest();
    await simultaneousChargeTest();

}

runTests().catch(console.error);
