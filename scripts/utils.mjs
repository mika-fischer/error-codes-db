import { strict as assert } from "node:assert";

function parseHex(val) {
  return parseInt(val, 16);
}

export function toU32(val) {
  assert(val >= 0);
  return Uint32Array.of(val)[0].toString();
}

export function toI32(val) {
  assert(val >= 0);
  return Int32Array.of(val)[0].toString();
}

assert.equal(parseHex("0xC0000005"), 3221225477);
assert.equal(toU32(parseHex("0xC0000005")), "3221225477");
assert.equal(toI32(parseHex("0xC0000005")), "-1073741819");
