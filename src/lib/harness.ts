import { FAMILIES, type Family } from "./content.ts";

export type Verdict = "reject" | "flag" | "pass";
export type Domain = "graph" | "potato";

export const SCHEMA_VERSION = "2.0.0";
export const EVENT_TYPES = [
  "loop.start",
  "predicate.registered",
  "predicate.validated",
  "check.registered",
  "plan.emit",
  "tool.call",
  "tool.result",
  "model.call",
  "model.result",
  "verify.attempt",
  "verify.result",
  "retry.scheduled",
  "rule.learned",
  "rule.declined",
  "rule.revalidated",
  "rule.retired",
  "oracle.attested",
  "monitor.attested",
  "monitor.disagreement",
  "circuit_break",
  "policy.decision",
  "canary.injected",
  "canary.result",
  "log.notarized",
  "loop.terminate",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const EVENT_SET = new Set<string>(EVENT_TYPES);
const GENESIS = new Set<EventType>(["predicate.registered", "loop.start"]);

export const CAPS = {
  token_budget: 4096,
  cost_usd: 0,
  wall_clock_ms: 50,
  max_retries: 0,
  max_fanout: 2,
  verify_ms: 20,
  reconciliation_ms: 1000,
} as const;

export const CDC_TOLERANCE_MS = 5 * 60 * 1000;
export const VOICE_MODEL_HASH = "untrained-init:no-weights-shipped";
export const AURA_PROFILE_ID = "aura_v1:profile-unset";

export interface Impl {
  fingerprint: string;
  kbps16?: number;
  kbps48?: number;
  wallMs?: number;
  overCeiling?: boolean;
}

export type Slot = Impl | "MISSING_WEIGHTS";
export type Install = Record<string, Record<string, Slot>>;

const POTATO_INSTALL: Install = {
  synth: {
    canary_liar: { fingerprint: "formant_fixture" },
    canary_slow: { fingerprint: "canary_slow", wallMs: 120, overCeiling: true },
    canary_ok: { fingerprint: "canary_ok", wallMs: 4 },
  },
  f0: {
    autocorr_fixture: { fingerprint: "autocorr_fixture" },
    rmvpe: "MISSING_WEIGHTS",
  },
  reverb: {
    none: { fingerprint: "none" },
  },
};

const GRAPH_INSTALL: Install = {
  f0: {
    f0_snap: { fingerprint: "f0_snap", wallMs: 2 },
    rmvpe: "MISSING_WEIGHTS",
  },
  aura: {
    aura_v1: { fingerprint: "aura_v1", wallMs: 3 },
  },
  harmonia: {
    harmonia_hpcodec: { fingerprint: "harmonia_hpcodec", kbps16: 5.4, kbps48: 11.1, wallMs: 8 },
    harmonia_over: { fingerprint: "harmonia_over", kbps16: 9, kbps48: 28, wallMs: 180, overCeiling: true },
  },
  audit: {
    boy_scouts_v2: { fingerprint: "boy_scouts_v2", wallMs: 1 },
  },
};

const GRAPH_REQUIRED = ["f0", "aura", "harmonia", "audit"] as const;

export interface FamilySpec {
  family: Family;
  domain: Domain;
  expected: Verdict;
  combo: Record<string, string>;
  /** When set, this install replaces the domain default for the named slots. */
  install?: Install;
  required: readonly string[];
}

function graphInstall(patch?: Install): Install {
  const base: Install = structuredClone(GRAPH_INSTALL);
  if (!patch) return base;
  for (const [kind, table] of Object.entries(patch)) {
    base[kind] = { ...base[kind], ...table };
  }
  return base;
}

export const GRAPH_SPECS: Record<Family, FamilySpec> = {
  silent_fallback: {
    family: "silent_fallback",
    domain: "graph",
    expected: "reject",
    combo: { f0: "f0_snap", aura: "aura_v1", harmonia: "harmonia_hpcodec", audit: "boy_scouts_v2" },
    install: graphInstall({
      harmonia: { harmonia_hpcodec: { fingerprint: "mfcc", kbps16: 5.4, kbps48: 11.1, wallMs: 8 } },
    }),
    required: GRAPH_REQUIRED,
  },
  missing_stage: {
    family: "missing_stage",
    domain: "graph",
    expected: "reject",
    combo: { f0: "f0_snap", aura: "aura_v1", audit: "boy_scouts_v2" },
    required: GRAPH_REQUIRED,
  },
  unknown_impl: {
    family: "unknown_impl",
    domain: "graph",
    expected: "reject",
    combo: { f0: "f0_snap", aura: "does_not_exist", harmonia: "harmonia_hpcodec", audit: "boy_scouts_v2" },
    required: GRAPH_REQUIRED,
  },
  not_installed: {
    family: "not_installed",
    domain: "graph",
    expected: "reject",
    combo: { f0: "rmvpe", aura: "aura_v1", harmonia: "harmonia_hpcodec", audit: "boy_scouts_v2" },
    required: GRAPH_REQUIRED,
  },
  over_ceiling: {
    family: "over_ceiling",
    domain: "graph",
    expected: "flag",
    combo: { f0: "f0_snap", aura: "aura_v1", harmonia: "harmonia_over", audit: "boy_scouts_v2" },
    required: GRAPH_REQUIRED,
  },
  known_good: {
    family: "known_good",
    domain: "graph",
    expected: "pass",
    combo: { f0: "f0_snap", aura: "aura_v1", harmonia: "harmonia_hpcodec", audit: "boy_scouts_v2" },
    required: GRAPH_REQUIRED,
  },
};

export const POTATO_SPECS: Record<Family, FamilySpec> = {
  silent_fallback: {
    family: "silent_fallback",
    domain: "potato",
    expected: "reject",
    combo: { f0: "autocorr_fixture", reverb: "none", synth: "canary_liar" },
    required: ["synth"],
  },
  missing_stage: {
    family: "missing_stage",
    domain: "potato",
    expected: "reject",
    combo: { f0: "autocorr_fixture", reverb: "none" },
    required: ["synth"],
  },
  unknown_impl: {
    family: "unknown_impl",
    domain: "potato",
    expected: "reject",
    combo: { f0: "autocorr_fixture", reverb: "none", synth: "does_not_exist" },
    required: ["synth"],
  },
  not_installed: {
    family: "not_installed",
    domain: "potato",
    expected: "reject",
    combo: { f0: "rmvpe", reverb: "none", synth: "canary_ok" },
    required: ["synth"],
  },
  over_ceiling: {
    family: "over_ceiling",
    domain: "potato",
    expected: "flag",
    combo: { f0: "autocorr_fixture", reverb: "none", synth: "canary_slow" },
    required: ["synth"],
  },
  known_good: {
    family: "known_good",
    domain: "potato",
    expected: "pass",
    combo: { f0: "autocorr_fixture", reverb: "none", synth: "canary_ok" },
    required: ["synth"],
  },
};

export class StageError extends Error {
  readonly kind: "KeyError" | "NotImplementedError" | "RuntimeError";
  readonly stage: string;

  constructor(
    message: string,
    kind: "KeyError" | "NotImplementedError" | "RuntimeError",
    stage: string,
  ) {
    super(message);
    this.name = kind;
    this.kind = kind;
    this.stage = stage;
  }
}

export interface ClassifyResult {
  verdict: Verdict;
  reason: string;
  audience_compute_ok: 0 | 1;
  wallMs: number;
  kbps16: number | null;
  kbps48: number | null;
  failedKind: string | null;
}

export function classify(spec: FamilySpec): ClassifyResult {
  const install = spec.install ?? (spec.domain === "graph" ? GRAPH_INSTALL : POTATO_INSTALL);
  let wall = 0;
  let kbps16: number | null = null;
  let kbps48: number | null = null;
  try {
    for (const kind of spec.required) {
      if (!(kind in spec.combo)) {
        throw new StageError(`missing stage ${kind}`, "KeyError", kind);
      }
    }
    for (const [kind, impl] of Object.entries(spec.combo)) {
      const table = install[kind];
      if (!table || !(impl in table)) {
        throw new StageError(`unknown impl ${kind}:${impl}`, "NotImplementedError", kind);
      }
      const slot = table[impl];
      if (slot === "MISSING_WEIGHTS") {
        throw new StageError(`not installed ${kind}:${impl}`, "RuntimeError", kind);
      }
      if (slot.fingerprint !== impl) {
        throw new StageError(
          `fingerprint mismatch ${kind}: asked ${impl}, got ${slot.fingerprint}`,
          "RuntimeError",
          kind,
        );
      }
      wall += slot.wallMs ?? 1;
      if (slot.kbps16 != null) kbps16 = slot.kbps16;
      if (slot.kbps48 != null) kbps48 = slot.kbps48;
      const overRate =
        (slot.kbps16 != null && slot.kbps16 > 6) || (slot.kbps48 != null && slot.kbps48 > 12);
      if (slot.overCeiling || overRate || wall > CAPS.wall_clock_ms) {
        return {
          verdict: "flag",
          reason: overRate
            ? `bitrate over ceiling (16 kHz ${slot.kbps16 ?? "—"} / 48 kHz ${slot.kbps48 ?? "—"})`
            : `wall clock ${wall} ms over cap ${CAPS.wall_clock_ms} ms`,
          audience_compute_ok: 0,
          wallMs: wall,
          kbps16,
          kbps48,
          failedKind: kind,
        };
      }
    }
    return {
      verdict: "pass",
      reason: "fingerprints match and fixture rates sit under the ceiling",
      audience_compute_ok: 1,
      wallMs: wall,
      kbps16,
      kbps48,
      failedKind: null,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "reject";
    return {
      verdict: "reject",
      reason,
      audience_compute_ok: 0,
      wallMs: wall,
      kbps16,
      kbps48,
      failedKind: err instanceof StageError ? err.stage : null,
    };
  }
}

export interface CdcStamp {
  host: string;
  rfc3161: string;
  vcs: string;
  host_monotonic_ms: number;
  concordance: "concordant" | "discordant";
  tolerance_ms: number;
}

export interface AuditEvent {
  event_id: string;
  event_type: EventType;
  timestamp: string;
  correlation_id: string;
  issuer_id: string;
  issuer_type: "model" | "tool" | "orchestrator" | "human" | "system" | "monitor" | "oracle" | "analyzer";
  schema_version: typeof SCHEMA_VERSION;
  event_hash: string;
  previous_hash: string | null;
  stratum_id: string;
  parent_event_id: string | null;
  cdc: CdcStamp;
  payload: Record<string, unknown>;
}

export interface Rejection {
  attempted_type: string;
  reason: string;
}

export interface InvariantVerdict {
  id: string;
  holds: boolean;
  detail: string;
}

export interface RunReport {
  family: Family;
  domain: Domain;
  expected: Verdict;
  actual: Verdict;
  matched: boolean;
  classify: ClassifyResult;
  events: AuditEvent[];
  rejections: Rejection[];
  invariants: InvariantVerdict[];
  merkle_root: string;
  citable: boolean;
  codecMuted: true;
  sketchPermit: boolean;
  lamp: string;
  nonce: string;
  correlation_id: string;
  monitors: number;
  reached: string[];
}

export interface RunOptions {
  family: Family;
  domain?: Domain;
  consent?: boolean;
  clockSkewMs?: number;
  nullCaps?: boolean;
  singleMonitor?: boolean;
  nowMs?: number;
}

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function uuid(): string {
  return crypto.randomUUID();
}

function validate(event: AuditEvent): string | null {
  if (!event.event_id || !event.correlation_id || !event.issuer_id) return "null envelope field";
  if (event.schema_version !== SCHEMA_VERSION) return "schema_version";
  if (!EVENT_SET.has(event.event_type)) return `phantom event_type ${event.event_type}`;
  if (event.timestamp == null || event.cdc == null) return "null timestamp";
  if (event.parent_event_id == null && !GENESIS.has(event.event_type)) {
    return `null parent on ${event.event_type}`;
  }
  const caps = event.payload.caps as Record<string, unknown> | undefined;
  if (caps) {
    for (const [key, value] of Object.entries(caps)) {
      if (value == null || typeof value !== "number" || Number.isNaN(value)) {
        return `null cap ${key}`;
      }
      const min = key === "wall_clock_ms" || key === "verify_ms" || key === "reconciliation_ms" ? 1 : 0;
      if (value < min) return `cap ${key} below minimum`;
    }
  }
  return null;
}

function stamp(now: number, skew: number, mono: number): CdcStamp {
  const host = iso(now);
  const rfc3161 = iso(now + skew);
  const vcs = iso(now + skew);
  const spread = Math.max(now, now + skew) - Math.min(now, now + skew);
  return {
    host,
    rfc3161,
    vcs,
    host_monotonic_ms: mono,
    concordance: spread <= CDC_TOLERANCE_MS ? "concordant" : "discordant",
    tolerance_ms: CDC_TOLERANCE_MS,
  };
}

function specFor(family: Family, domain: Domain): FamilySpec {
  return domain === "potato" ? POTATO_SPECS[family] : GRAPH_SPECS[family];
}

export function reachedNodes(report: Pick<RunReport, "classify" | "events" | "sketchPermit">): string[] {
  const types = new Set(report.events.map((event) => event.event_type));
  const nodes = ["mic"];
  if (report.events.some((event) => event.payload.stage === "f0" && event.event_type === "tool.result")) {
    nodes.push("f0");
  }
  if (types.has("policy.decision") || types.has("log.notarized")) nodes.push("consent");
  if (report.events.some((event) => event.payload.stage === "aura" && event.event_type === "tool.result")) {
    nodes.push("aura");
  }
  if (report.events.some((event) => event.payload.stage === "harmonia" && event.event_type === "tool.result")) {
    nodes.push("enc16", "enc48", "rvq");
  }
  if (report.events.some((event) => event.payload.stage === "audit" && event.event_type === "tool.result")) {
    nodes.push("audit");
  }
  if (nodes.includes("rvq")) nodes.push("dec");
  nodes.push("out");
  return nodes;
}

function evaluate(events: AuditEvent[], rejections: Rejection[]): InvariantVerdict[] {
  const byType = (type: EventType) => events.filter((event) => event.event_type === type);
  const holds = (id: string, ok: boolean, detail: string): InvariantVerdict => ({ id, holds: ok, detail });

  const calls = byType("tool.call");
  let i1 = true;
  let i1detail = calls.length === 0 ? "No tool.call in this run." : "Each call has one terminal.";
  for (const call of calls) {
    const id = call.payload.tool_call_id;
    const terminals = events.filter(
      (event) =>
        (event.event_type === "tool.result" || event.event_type === "circuit_break") &&
        event.payload.tool_call_id === id,
    );
    if (terminals.length !== 1) {
      i1 = false;
      i1detail = `${String(id)} has ${terminals.length} terminals.`;
      break;
    }
  }

  const starts = byType("loop.start");
  let i2 = true;
  let i2detail = starts.length === 0 ? "Loop did not start." : "Safety check precedes loop.start.";
  for (const start of starts) {
    const prior = events.filter(
      (event) =>
        event.event_type === "check.registered" &&
        event.correlation_id === start.correlation_id &&
        event.timestamp < start.timestamp &&
        event.payload.falsifiable === true &&
        event.payload.predicate_type === "safety",
    );
    const valid = prior.some((check) =>
      events.some(
        (event) =>
          event.event_type === "predicate.validated" &&
          event.payload.predicate_id === check.payload.predicate_id &&
          event.payload.verdict === "valid" &&
          event.timestamp < start.timestamp,
      ),
    );
    if (!valid) {
      i2 = false;
      i2detail = "loop.start without a validated safety predicate.";
    }
  }

  const keys = calls
    .filter((call) => call.payload.side_effecting === true)
    .map((call) => String(call.payload.idempotency_key));
  const i3 = new Set(keys).size === keys.length;

  let i4 = true;
  let i4detail = "No verify.result in this run.";
  for (const verify of byType("verify.result")) {
    i4detail = "Analyzer issuer is independent of the model lineage.";
    const models = byType("model.result");
    for (const model of models) {
      const sameIssuer = verify.issuer_id === model.issuer_id;
      const sameModelLine =
        verify.issuer_type === "model" && verify.payload.lineage_hash === model.payload.lineage_hash;
      if (sameIssuer || sameModelLine) {
        i4 = false;
        i4detail = "verify.result shares issuer or model lineage with model.result.";
      }
    }
    if (verify.issuer_type === "model") {
      i4 = false;
      i4detail = "Model issued its own verify.result.";
    }
  }

  let i5 = true;
  let i5detail = "Caps hold.";
  for (const start of starts) {
    const caps = start.payload.caps as Record<string, number>;
    const wall = events
      .filter((event) => event.event_type === "tool.result" || event.event_type === "circuit_break")
      .reduce((sum, event) => sum + (Number(event.payload.wall_ms) || 0), 0);
    const tokens = calls.length * 32;
    const checks: [string, number][] = [
      ["wall_clock_ms", wall],
      ["token_budget", tokens],
      ["cost_usd", 0],
      ["max_retries", 0],
      ["max_fanout", 1],
      ["reconciliation_ms", 0],
    ];
    for (const [cap, metric] of checks) {
      if (metric > caps[cap]) {
        const broken = events.some(
          (event) => event.event_type === "circuit_break" && event.payload.breached_cap === cap,
        );
        if (!broken) {
          i5 = false;
          i5detail = `${cap} exceeded (${metric} > ${caps[cap]}) without a matching circuit_break.`;
        }
      }
    }
  }
  if (starts.length === 0) i5detail = "No loop, no cap to breach.";

  let i6 = true;
  let i6detail = "No failing verify.result.";
  for (const verify of byType("verify.result")) {
    if (verify.payload.status !== "fail") continue;
    i6detail = "Failure produced a rule before terminate.";
    const ruled = events.some(
      (event) =>
        (event.event_type === "rule.learned" || event.event_type === "rule.declined") &&
        event.payload.source_verify_id === verify.payload.verify_id,
    );
    const terminated = byType("loop.terminate").length > 0;
    if (terminated && !ruled) {
      i6 = false;
      i6detail = "Terminate after a failed verify with no rule.";
    }
  }

  const m1 = events.every((event) => EVENT_SET.has(event.event_type)) && rejections.every((item) => item.reason.length > 0);
  let m2 = true;
  let m2detail = "Checks follow a valid predicate.";
  for (const check of byType("check.registered")) {
    const ok = events.some(
      (event) =>
        event.event_type === "predicate.validated" &&
        event.payload.predicate_id === check.payload.predicate_id &&
        event.payload.verdict === "valid" &&
        event.timestamp <= check.timestamp,
    );
    if (!ok) {
      m2 = false;
      m2detail = "check.registered without predicate.validated.";
    }
  }

  let m3 = true;
  let m3detail = "No verify.result.";
  for (const verify of byType("verify.result")) {
    m3detail = "Oracle attestation matches the analyzer lineage.";
    const ok = events.some(
      (event) =>
        event.event_type === "oracle.attested" &&
        event.payload.subject_id === verify.issuer_id &&
        event.payload.lineage_hash === verify.payload.lineage_hash &&
        event.payload.expired !== true &&
        event.timestamp <= verify.timestamp,
    );
    if (!ok) {
      m3 = false;
      m3detail = "verify.result without a current oracle.attested.";
    }
  }

  let m4 = true;
  let m4detail = "No circuit_break.";
  for (const brk of byType("circuit_break")) {
    const monitors = new Set(
      events
        .filter((event) => event.event_type === "monitor.attested" && event.timestamp <= brk.timestamp)
        .map((event) => event.issuer_id),
    );
    const disagreement = events.some((event) => event.event_type === "monitor.disagreement");
    m4detail = `${monitors.size} monitor attestation(s) before the break.`;
    if (monitors.size < 2 && !disagreement) {
      m4 = false;
      m4detail = "circuit_break with a single monitor.";
    }
  }

  let m5 = true;
  let m5detail = "No rule.learned.";
  for (const rule of byType("rule.learned")) {
    m5detail = "half_life_ms and next_revalidation present.";
    if (typeof rule.payload.half_life_ms !== "number" || typeof rule.payload.next_revalidation !== "string") {
      m5 = false;
      m5detail = "rule.learned missing half-life or revalidation time.";
    }
  }

  return [
    holds("I1", i1, i1detail),
    holds("I2", i2, i2detail),
    holds("I3", i3, i3 ? "Side-effecting keys are unique." : "Duplicate idempotency_key."),
    holds("I4", i4, i4detail),
    holds("I5", i5, i5detail),
    holds("I6", i6, i6detail),
    holds("M1", m1, m1 ? "Event types are in the schema enum." : "Schema coherence failed."),
    holds("M2", m2, m2detail),
    holds("M3", m3, m3detail),
    holds("M4", m4, m4detail),
    holds("M5", m5, m5detail),
  ];
}

export async function executeRun(options: RunOptions): Promise<RunReport> {
  const domain = options.domain ?? "graph";
  const spec = specFor(options.family, domain);
  const consent = options.consent ?? true;
  const skew = options.clockSkewMs ?? 0;
  const nullCaps = options.nullCaps ?? false;
  const singleMonitor = options.singleMonitor ?? false;
  const classified = classify(spec);
  const now0 = options.nowMs ?? Date.now();
  const correlation = uuid();
  const nonce = uuid().slice(0, 8);
  const events: AuditEvent[] = [];
  const rejections: Rejection[] = [];
  let mono = 0;
  let parent: string | null = null;
  const concordant = Math.abs(skew) <= CDC_TOLERANCE_MS;

  const push = (type: EventType, issuer: string, issuerType: AuditEvent["issuer_type"], payload: Record<string, unknown>) => {
    const event: AuditEvent = {
      event_id: uuid(),
      event_type: type,
      timestamp: iso(now0 + events.length),
      correlation_id: correlation,
      issuer_id: issuer,
      issuer_type: issuerType,
      schema_version: SCHEMA_VERSION,
      event_hash: "",
      previous_hash: null,
      stratum_id: concordant ? "S2-lattice" : "undateable",
      parent_event_id: parent,
      cdc: stamp(now0 + events.length, skew, mono),
      payload,
    };
    mono += 1;
    const problem = validate(event);
    if (problem) {
      rejections.push({ attempted_type: type, reason: problem });
      return null;
    }
    events.push(event);
    parent = event.event_id;
    return event;
  };

  if (nullCaps) {
    const poisoned: AuditEvent = {
      event_id: uuid(),
      event_type: "loop.start",
      timestamp: iso(now0),
      correlation_id: correlation,
      issuer_id: "lattice-host",
      issuer_type: "orchestrator",
      schema_version: SCHEMA_VERSION,
      event_hash: "",
      previous_hash: null,
      stratum_id: "undateable",
      parent_event_id: null,
      cdc: stamp(now0, skew, 0),
      payload: { caps: { ...CAPS, token_budget: null } },
    };
    rejections.push({
      attempted_type: "loop.start",
      reason: validate(poisoned) ?? "null cap",
    });
  } else {
    const predicateId = `pred-${nonce}`;
    push("predicate.registered", "falsifiability-engine", "analyzer", {
      predicate_id: predicateId,
      predicate_type: "safety",
      falsifiable: true,
    });
    push("predicate.validated", "falsifiability-engine", "analyzer", {
      predicate_id: predicateId,
      verdict: "valid",
    });
    push("check.registered", "lattice-host", "orchestrator", {
      predicate_id: predicateId,
      predicate_type: "safety",
      falsifiable: true,
    });
    push("oracle.attested", "trust-oracle", "oracle", {
      subject_id: "falsifiability-engine",
      lineage_hash: "lineage-analyzer",
      expired: false,
    });
    push("monitor.attested", "monitor-a", "monitor", { monitor_id: "monitor-a" });
    if (!singleMonitor) push("monitor.attested", "monitor-b", "monitor", { monitor_id: "monitor-b" });
    push("canary.injected", "canary-suite", "oracle", {
      nonce,
      family: spec.family,
      expected_verdict: spec.expected,
      suite_hash: "canaries.py:FAMILIES",
    });
    push("loop.start", "lattice-host", "orchestrator", {
      caps: { ...CAPS },
      goal_hash: "harmonia-aura-graph",
      environment_hash: "skeleton-unverified",
    });

    const allowSpatial = consent && concordant && !singleMonitor && classified.verdict === "pass";
    push("policy.decision", "lattice-host", "orchestrator", {
      decision: consent ? "allow" : "deny",
      reason: consent ? "consent presented" : "consent missing",
      voice_model_hash: VOICE_MODEL_HASH,
      aura_profile_id: AURA_PROFILE_ID,
    });
    push("log.notarized", "trust-anchor", "oracle", {
      external_timestamp: iso(now0 + skew),
      merkle_root: "",
      transparency_log_proof: concordant ? "sim-inclusion" : "withheld",
      voice_model_hash: VOICE_MODEL_HASH,
      aura_profile_id: AURA_PROFILE_ID,
      before: "aura_spatial_output",
    });

    const order = spec.domain === "graph" ? GRAPH_REQUIRED : (["f0", "reverb", "synth"] as const);
    let broke = false;
    const breakWith = (callId: string | null, cap: string, wall: number) => {
      push("circuit_break", "lattice-host", "orchestrator", {
        tool_call_id: callId,
        breached_cap: cap,
        wall_ms: wall,
      });
      broke = true;
    };

    if (!consent || !concordant || singleMonitor) {
      const cap = !concordant ? "wall_clock_ms" : "max_fanout";
      breakWith(null, singleMonitor ? "max_fanout" : cap, 0);
    }

    if (!broke) {
      for (const kind of order) {
        if (!(kind in spec.combo)) {
          const callId = uuid();
          push("tool.call", kind, "tool", {
            tool_call_id: callId,
            stage: kind,
            impl: null,
            side_effecting: true,
            irreversible: false,
            idempotency_key: `${correlation}:${kind}`,
          });
          breakWith(callId, "max_fanout", 0);
          break;
        }
        const impl = spec.combo[kind];
        const callId = uuid();
        push("tool.call", kind, "tool", {
          tool_call_id: callId,
          stage: kind,
          impl,
          side_effecting: true,
          irreversible: false,
          idempotency_key: `${correlation}:${kind}:${impl}`,
        });
        const failedHere =
          classified.verdict !== "pass" &&
          (classified.reason.includes(kind) ||
            classified.reason.includes(impl) ||
            (kind === "harmonia" && classified.verdict === "flag") ||
            (kind === "synth" && classified.verdict === "flag"));
        if (failedHere && classified.verdict === "reject") {
          breakWith(callId, "max_fanout", classified.wallMs);
          break;
        }
        if (failedHere && classified.verdict === "flag") {
          push("tool.result", kind, "tool", {
            tool_call_id: callId,
            stage: kind,
            fingerprint: impl,
            audience_compute_ok: 0,
            wall_ms: classified.wallMs,
            kbps16: classified.kbps16,
            kbps48: classified.kbps48,
          });
          // The row exists (potato "flag"). The break is host-level, so it
          // must not be a second terminal for this tool_call_id (I1).
          breakWith(null, "wall_clock_ms", 0);
          break;
        }
        push("tool.result", kind, "tool", {
          tool_call_id: callId,
          stage: kind,
          fingerprint: impl,
          audience_compute_ok: 1,
          wall_ms: 4,
          kbps16: kind === "harmonia" ? classified.kbps16 : null,
          kbps48: kind === "harmonia" ? classified.kbps48 : null,
        });
        if (kind === "harmonia" || kind === "synth") {
          push("model.result", "harmonia-model", "model", {
            lineage_hash: "lineage-model",
            output_hash: `out-${nonce}`,
            stage: kind,
          });
        }
      }
    }

    const verifyId = `verify-${nonce}`;
    const verifyStatus = allowSpatial ? "pass" : "fail";
    push("verify.attempt", "falsifiability-engine", "analyzer", { verify_id: verifyId });
    push("verify.result", "falsifiability-engine", "analyzer", {
      verify_id: verifyId,
      status: verifyStatus,
      lineage_hash: "lineage-analyzer",
      artifact_hash: `out-${nonce}`,
    });
    if (verifyStatus === "fail") {
      push("rule.learned", "falsifiability-engine", "analyzer", {
        source_verify_id: verifyId,
        half_life_ms: 86_400_000,
        next_revalidation: iso(now0 + 86_400_000),
        decay_status: "live",
        rule: classified.verdict === "pass" ? "host gate closed the path" : classified.reason,
      });
    }
    push("canary.result", "canary-suite", "oracle", {
      nonce,
      family: spec.family,
      expected_verdict: spec.expected,
      actual_verdict: classified.verdict,
    });
    push("loop.terminate", "lattice-host", "orchestrator", {
      status: allowSpatial ? "ok" : "fail",
      reconciliation_complete: true,
      open_checks: 0,
    });
  }

  let previous: string | null = null;
  const priorHashes: string[] = [];
  for (const event of events) {
    if (event.event_type === "log.notarized") {
      event.payload = {
        ...event.payload,
        merkle_root: priorHashes.length ? await sha256(priorHashes.join("")) : await sha256("genesis"),
      };
    }
    event.previous_hash = previous;
    const body = canonicalize({ ...event, event_hash: "" });
    event.event_hash = await sha256(body);
    previous = event.event_hash;
    priorHashes.push(event.event_hash);
  }
  const merkle = priorHashes.length ? await sha256(priorHashes.join("")) : "";

  const invariants = evaluate(events, rejections);
  const invariantOk = invariants.every((item) => item.holds);
  const sketchPermit =
    classified.verdict === "pass" &&
    consent &&
    concordant &&
    !singleMonitor &&
    !nullCaps &&
    rejections.length === 0 &&
    invariantOk;

  let lamp = "FAIL CLOSED";
  if (nullCaps) lamp = "SCHEMA REJECT · MUTED";
  else if (!concordant) lamp = "UNDATEABLE · MUTED";
  else if (classified.verdict === "pass" && sketchPermit) lamp = "HARNESS PASS · CODEC MUTED";
  else if (classified.verdict === "pass") lamp = "HARNESS PASS · GATES CLOSED";
  else if (classified.verdict === "flag") lamp = "FLAGGED · MUTED";
  else lamp = "REJECTED · MUTED";

  const monitors = events.filter((event) => event.event_type === "monitor.attested").length;
  const report: RunReport = {
    family: spec.family,
    domain,
    expected: spec.expected,
    actual: classified.verdict,
    matched: classified.verdict === spec.expected,
    classify: classified,
    events,
    rejections,
    invariants,
    merkle_root: merkle,
    citable: concordant && rejections.length === 0 && events.length > 0,
    codecMuted: true,
    sketchPermit,
    lamp,
    nonce,
    correlation_id: correlation,
    monitors,
    reached: [],
  };
  report.reached = reachedNodes(report);
  return report;
}

export interface SuiteSummary {
  domain: Domain;
  K: number;
  theta: number;
  detection_rate: number;
  systematic_miss_families: Family[];
  per_family_misses: Record<Family, number>;
  harness_attested: boolean;
  note: string;
}

function mulberry(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function runSuiteClassify(domain: Domain, K = 60, theta = 0.95, seed = 1): SuiteSummary {
  const rng = mulberry(seed);
  const names = FAMILIES;
  const miss = Object.fromEntries(names.map((name) => [name, 0])) as Record<Family, number>;
  const seen = Object.fromEntries(names.map((name) => [name, 0])) as Record<Family, number>;
  for (let i = 0; i < K; i += 1) {
    const family = i < names.length ? names[i] : names[Math.floor(rng() * names.length)];
    const spec = specFor(family, domain);
    const got = classify(spec).verdict;
    seen[family] += 1;
    if (got !== spec.expected) miss[family] += 1;
  }
  const detection = 1 - names.reduce((sum, name) => sum + miss[name], 0) / K;
  const systematic = names.filter((name) => seen[name] > 0 && miss[name] === seen[name]);
  const attested = detection >= theta && systematic.length === 0;
  return {
    domain,
    K,
    theta,
    detection_rate: Math.round(detection * 1000) / 1000,
    systematic_miss_families: systematic,
    per_family_misses: miss,
    harness_attested: attested,
    note: "Classifier checked against the published expected verdicts. This does not execute bench_one.py and is not a target-hardware canary.",
  };
}

export const BENCH_FIELDS = [
  "f0",
  "f0_snap",
  "synth",
  "reverb",
  "asr",
  "svc",
  "vocoder",
  "buffer_samples",
  "key_root",
  "scale",
  "snap_strength",
  "combo_id",
  "audience_compute_ms",
  "stages_ms",
  "fingerprints",
  "monitor_ms",
  "monitor_measured",
  "audience_e2e_ms",
  "audience_e2e_ok",
  "audience_compute_ok",
  "wer",
  "listening_score",
] as const;
