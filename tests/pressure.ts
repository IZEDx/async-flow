import * as test from "tape";
import { Pressure } from "../src";
import { when } from "./lib/utils";

const immediatePressurizer = cb => cb();
const magic = 112358;

test("pressurize() should resolve return value", when(async assert => {
    const result = await Pressure.pressurize(immediatePressurizer, () => magic);
    assert.equals(result, magic);
    assert.end();
}));