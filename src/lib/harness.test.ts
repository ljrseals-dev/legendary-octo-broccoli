import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FAMILIES } from "./content.ts";
import { processorViolations } from "../spec/processor.ts";
import {
  CDC_TOLERANCE_MS,
  GRAPH_SPECS,
  POTATO_SPECS,
  classify,
  executeRun,
  runSuiteClassify,
} from "./harness.ts";

describe("canary classifier", () => {
  for (const family of FAMILIES) {
    it(`graph ${family} matches the published verdict`, () => {
      const spec = GRAPH_SPECS[family];
      assert.equal(classify(spec).verdict, spec.expected);
    });
    it(`potato ${family} matches canaries.py`, () => {
      const spec = POTATO_SPECS[family];
      assert.equal(classify(spec).verdict, spec.expected);
    });
  }

  it("attests both suites without claiming hardware", () => {
    for (const domain of ["graph", "potato"] as const) {
      const suite = runSuiteClassify(domain);
      assert.equal(suite.harness_attested, true);
      assert.equal(suite.detection_rate, 1);
      assert.deepEqual(suite.systematic_miss_families, []);
      assert.match(suite.note, /not a target-hardware canary/);
    }
  });
});

describe("sealed host", () => {
  it("passes the harness and still mutes the codec", async () => {
    const report = await executeRun({ family: "known_good", nowMs: 1_700_000_000_000 });
    assert.equal(report.matched, true);
    assert.equal(report.codecMuted, true);
    assert.equal(report.sketchPermit, true);
    assert.equal(report.citable, true);
    assert.ok(report.events.length > 8);
    assert.equal(report.events[0].previous_hash, null);
    for (let i = 1; i < report.events.length; i += 1) {
      assert.equal(report.events[i].previous_hash, report.events[i - 1].event_hash);
      assert.equal(report.events[i].event_hash.length, 64);
    }
    const anchor = report.events.find((event) => event.event_type === "log.notarized");
    const spatial = report.events.find((event) => event.payload.stage === "aura");
    assert.ok(anchor && spatial);
    assert.ok(report.events.indexOf(anchor) < report.events.indexOf(spatial));
    assert.equal(anchor.cdc.concordance, "concordant");
    assert.ok(anchor.cdc.host && anchor.cdc.rfc3161 && anchor.cdc.vcs);
    assert.equal(typeof anchor.payload.merkle_root, "string");
    assert.equal(report.invariants.every((item) => item.holds), true);
    assert.equal(report.events.some((event) => event.payload.voice_model_hash), true);
  });

  it("rejects a silent mfcc fingerprint and keeps every invariant", async () => {
    const report = await executeRun({ family: "silent_fallback", nowMs: 1_700_000_000_000 });
    assert.equal(report.actual, "reject");
    assert.equal(report.sketchPermit, false);
    assert.equal(report.classify.failedKind, "harmonia");
    assert.equal(report.invariants.every((item) => item.holds), true);
  });

  it("flags over-ceiling without a second terminal on the same call", async () => {
    const report = await executeRun({ family: "over_ceiling", nowMs: 1_700_000_000_000 });
    assert.equal(report.actual, "flag");
    assert.equal(report.invariants.find((item) => item.id === "I1")?.holds, true);
    assert.equal(report.invariants.find((item) => item.id === "I5")?.holds, true);
    assert.equal(report.sketchPermit, false);
  });

  it("rejects null caps before a loop exists", async () => {
    const report = await executeRun({ family: "known_good", nullCaps: true, nowMs: 1_700_000_000_000 });
    assert.equal(report.events.length, 0);
    assert.match(report.rejections[0].reason, /null cap/);
    assert.equal(report.sketchPermit, false);
    assert.match(report.lamp, /SCHEMA/);
  });

  it("quarantines discordant clocks", async () => {
    const report = await executeRun({
      family: "known_good",
      clockSkewMs: CDC_TOLERANCE_MS + 1,
      nowMs: 1_700_000_000_000,
    });
    assert.equal(report.citable, false);
    assert.equal(report.events[0].stratum_id, "undateable");
    assert.equal(report.sketchPermit, false);
    assert.equal(report.invariants.find((item) => item.id === "M4")?.holds, true);
  });

  it("fails M4 when a single monitor breaks the loop", async () => {
    const report = await executeRun({
      family: "known_good",
      singleMonitor: true,
      nowMs: 1_700_000_000_000,
    });
    assert.equal(report.monitors, 1);
    assert.equal(report.invariants.find((item) => item.id === "M4")?.holds, false);
    assert.equal(report.sketchPermit, false);
  });
});

describe("processor skeleton", () => {
  it("does not retain the organ bus", () => {
    assert.deepEqual(processorViolations(), []);
  });
});
