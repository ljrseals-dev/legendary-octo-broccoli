import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-AvRgSS4z.js
var routes_AvRgSS4z_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FAMILIES = [
	"silent_fallback",
	"missing_stage",
	"unknown_impl",
	"not_installed",
	"over_ceiling",
	"known_good"
];
/** Signal order. f0_snap is before the spatial bus on purpose. */
var FLOW = [
	{
		id: "mic",
		kicker: "In",
		title: "Mic",
		fingerprint: "audioIn",
		body: "Dry stereo in. Summed to a mono reference only after consent is anchored.",
		caveat: "No lookahead buffer is allocated here."
	},
	{
		id: "f0",
		kicker: "Before spatial",
		title: "F0 / phoneme",
		fingerprint: "f0_snap",
		body: "f0_snap.py stays in front of the encoder and in front of Aura. Pitch is quantized on the dry mono signal, never on a binaural render.",
		caveat: "bench_one.py columns are unchanged, including f0 and f0_snap."
	},
	{
		id: "consent",
		kicker: "Gate",
		title: "Consent anchor",
		fingerprint: "boy_scouts_v2",
		body: "Voice-model hash and Aura profile id are written into the Merkle leaf and the RFC 3161 stamp before any spatial sample is allowed out.",
		caveat: "The shipped HarmoniaCodec has no trained weights. The hash recorded here is the untrained-init marker, not a voice identity."
	},
	{
		id: "aura",
		kicker: "Replaces organ",
		title: "Aura spatial bus",
		fingerprint: "aura_v1",
		body: "Same note-on / note-off and F0 events the organ used to take. Two binaural outs plus a mono reference for the encoder. Head pose in. No harmonic stack.",
		caveat: "On-device HRTF and Bluetooth head tracking are an interface contract. This console does not run that renderer."
	},
	{
		id: "enc16",
		kicker: "16 kHz branch",
		title: "Harmonia encode",
		fingerprint: "harmonia_hpcodec",
		body: "Causal encoder. Content through 8 kHz. Ceiling 6 kbps. Parallel residual vector quantizer, harmonic versus percussive.",
		caveat: "6 kbps is a target from the integration brief. HarmoniaCodec ships no bitstream and no measured PESQ."
	},
	{
		id: "enc48",
		kicker: "48 kHz residual",
		title: "Residual branch",
		fingerprint: "harmonia_hpcodec",
		body: "Residual through 24 kHz. Ceiling 12 kbps. A bandwidth-extension step is specified to predict these tokens from the 16 kHz tokens. It is not in harmonia_neural.py.",
		caveat: "Unverified. Do not add non-causal lookahead to hit the number."
	},
	{
		id: "rvq",
		kicker: "Disentangle",
		title: "RVQ H / P",
		fingerprint: "harmonia_hpcodec",
		body: "Harmonic and percussive codebooks run in parallel. Stage count is a router output, not a fixed organ drawbar.",
		caveat: "Numpy path is nine-stage MERVQ. LOW / ULTRA_LOW bitrates in the README are wrong: top_k is not applied."
	},
	{
		id: "audit",
		kicker: "Tap",
		title: "Boy Scouts tap",
		fingerprint: "boy_scouts_v2",
		body: "Host module, not a side process. Every codec op, Aura render, and parameter change emits schema 2.0.0. Null caps are rejected.",
		caveat: "A pass inside this console is a self-check of the classifier. It is not a target-hardware canary."
	},
	{
		id: "dec",
		kicker: "Blocked",
		title: "Decoder",
		fingerprint: "harmonia_hpcodec",
		body: "Would reconstruct both branches and feed Aura again. The skeleton returns silence.",
		caveat: "CausalTransposedConv1d in harmonia_neural.py is the known-broken streaming decoder. Left untouched. Path stays muted."
	},
	{
		id: "out",
		kicker: "Out",
		title: "Binaural out",
		fingerprint: "aura_v1",
		body: "Left / right only if the host has cleared fail-closed. Default is digital silence.",
		caveat: "The optional ITD sketch in this page is a browser tone. It is not aura_v1."
	}
];
var EXCISED = [
	"renderDivideDown",
	"ddVoices",
	"drawbars[9]",
	"percussion",
	"rotary / Leslie",
	"foldback",
	"key click",
	"organ-mixer UI"
];
var BANDWIDTH = [
	{
		id: "h16",
		name: "Harmonia 16 kHz",
		kbps: 6,
		grade: "unverified",
		claim: "Branch ceiling",
		note: "Integration target. No bitstream in HarmoniaCodec, no PESQ / STOI / ViSQOL, encoder not in codec_probe_v31."
	},
	{
		id: "h48",
		name: "Harmonia 48 kHz",
		kbps: 12,
		grade: "unverified",
		claim: "Residual ceiling",
		note: "Same target pair. Bandwidth-extension from 16 kHz tokens is specified, not implemented. Decoder streaming is unverified."
	},
	{
		id: "sum",
		name: "Both branches",
		kbps: 18,
		grade: "unverified",
		claim: "Arithmetic sum",
		note: "6 + 12. The addition is exact. The premise is not a measurement."
	},
	{
		id: "tidal",
		name: "Tidal HiFi AAC",
		kbps: 320,
		grade: "measured",
		claim: "Published tier",
		note: "Tidal documents HiFi as AAC at 320 kbps. That number is the service tier, not a listening test against this codec. Perceptual parity is unverified."
	},
	{
		id: "yt",
		name: "YouTube Opus",
		kbps: 160,
		grade: "estimated",
		claim: "Operating point",
		note: "YouTube Opus is variable. ~160 kbps is a cited high-quality region, not a fixed published ceiling."
	},
	{
		id: "opus",
		name: "Opus vs legacy",
		kbps: 96,
		grade: "estimated",
		claim: "30–50% less than MP3/AAC",
		note: "Xiph listening-test literature, not re-run here. 96 kbps is a midpoint illustration of a 128–192 kbps legacy rate cut by ~30–50%, not a Harmonia result."
	}
];
var INVARIANT_COPY = [
	{
		id: "I1",
		title: "Completeness",
		text: "Every tool.call has exactly one terminal: tool.result or circuit_break, same tool_call_id.",
		negative: "A call with no terminal trips the query; the host must emit circuit_break."
	},
	{
		id: "I2",
		title: "Pre-registration",
		text: "loop.start is preceded by a safety check.registered whose predicate.validated verdict is valid.",
		negative: "A loop with only non-safety predicates is rejected."
	},
	{
		id: "I3",
		title: "Idempotency",
		text: "v2 points at v1 without restating it. This host treats a repeated side-effecting idempotency_key as a second execution and fails the invariant.",
		negative: "Duplicate key on a side-effecting call."
	},
	{
		id: "I4",
		title: "Independence",
		text: "verify.result that judges a model.result comes from a different issuer, and not from the same model lineage.",
		negative: "The codec grading itself."
	},
	{
		id: "I5",
		title: "Boundedness",
		text: "Caps on the loop (tokens, cost, wall clock, retries, fanout, reconciliation) cannot be exceeded without a circuit_break naming that cap.",
		negative: "Over-ceiling work with no break."
	},
	{
		id: "I6",
		title: "Rule persistence",
		text: "A failing verify.result produces rule.learned or rule.declined before terminate, inside reconciliation_ms.",
		negative: "Fail, then terminate, with no rule."
	},
	{
		id: "M1",
		title: "Schema coherence",
		text: "Every event_type in the log is in the schema 2.0.0 enum. Null caps are not events; they are rejections.",
		negative: "A phantom event type."
	},
	{
		id: "M2",
		title: "Predicate validity",
		text: "No check.registered without an earlier predicate.validated of verdict valid for that predicate_id.",
		negative: "Registering a check against an unvalidated predicate."
	},
	{
		id: "M3",
		title: "Oracle attestation",
		text: "verify.result issuer carries a current oracle.attested whose lineage matches.",
		negative: "Expired or missing attestation."
	},
	{
		id: "M4",
		title: "Monitor agreement",
		text: "Every circuit_break carries two distinct monitor.attested events, or an explicit monitor.disagreement.",
		negative: "Single-monitor break. The sample is still muted."
	},
	{
		id: "M5",
		title: "Rule decay",
		text: "rule.learned carries half_life_ms and next_revalidation. A rule older than twice its half-life cannot be cited.",
		negative: "Citing a decayed rule."
	}
];
var FAMILY_COPY = {
	silent_fallback: {
		detects: "Stage claims harmonia_hpcodec but returns an mfcc fingerprint. The train() MFCC fallback, and the potato liar stage, are the same defect.",
		expected: "reject"
	},
	missing_stage: {
		detects: "48 kHz branch key absent. Potato equivalent: combo with no synth key.",
		expected: "reject"
	},
	unknown_impl: {
		detects: "Aura impl name is not registered. Fingerprint asked cannot be checked, so the combo dies.",
		expected: "reject"
	},
	not_installed: {
		detects: "Weights or binary missing (whisper / rmvpe). Missing is not a silent substitute.",
		expected: "reject"
	},
	over_ceiling: {
		detects: "Fingerprints match, but the frame exceeds the wall-clock cap or the 6 / 12 kbps ceilings. Potato verdict is flag (row kept, audience_compute_ok = 0).",
		expected: "flag"
	},
	known_good: {
		detects: "Registered fingerprints, fixture rates under the ceiling. Opens the harness, not the codec.",
		expected: "pass"
	}
};
var PLAN = [
	{
		step: "01",
		title: "Delete the organ bus",
		body: "Remove renderDivideDown, the divide-down voice array, the nine harmonic levels, percussion, the rotary speaker, foldback, key click, and the mixer that drove them. Do not leave the code behind a flag."
	},
	{
		step: "02",
		title: "Stub Aura with a fingerprint",
		body: "aura_v1 accepts note gates, F0, and a head pose. It emits a binaural pair and a mono reference. Until a canary passes on device, the host treats the renderer as unmeasured."
	},
	{
		step: "03",
		title: "Keep f0_snap in front",
		body: "Pitch quantization reads the dry mono signal. It does not read Aura’s binaural outs. bench_one.py FIELDS stay frozen; a header mismatch is still a hard schema-drift error."
	},
	{
		step: "04",
		title: "Clamp the codec, causally",
		body: "Encoder: 16 kHz branch ceiling 6 kbps, 48 kHz residual ceiling 12 kbps, harmonic and percussive RVQ in parallel. Non-causal lookahead is forbidden. Rates of 0 mean unmeasured, and unmeasured is not “under the ceiling.”"
	},
	{
		step: "05",
		title: "Leave the broken decoder broken",
		body: "Do not ship CausalTransposedConv1d as if the streaming fix landed. The skeleton decode returns silence and a verify failure until single-pass and chunked outputs match."
	},
	{
		step: "06",
		title: "Wrap the processor in the audit host",
		body: "Boy Scouts v2 is the host module. Schema 2.0.0, null caps forbidden, three concordant clocks (5 minute tolerance), Merkle plus RFC 3161 before spatial output. Two monitors, or the break is invalid and the path stays muted."
	},
	{
		step: "07",
		title: "Register the six families",
		body: "silent_fallback, missing_stage, unknown_impl, not_installed, over_ceiling, known_good. Expected verdicts match canaries.py. A triggered canary mutes. known_good does not mean production-ready."
	}
];
var SCHEMA_VERSION = "2.0.0";
var EVENT_SET = /* @__PURE__ */ new Set([
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
	"loop.terminate"
]);
var GENESIS = /* @__PURE__ */ new Set(["predicate.registered", "loop.start"]);
var CAPS = {
	token_budget: 4096,
	cost_usd: 0,
	wall_clock_ms: 50,
	max_retries: 0,
	max_fanout: 2,
	verify_ms: 20,
	reconciliation_ms: 1e3
};
var CDC_TOLERANCE_MS = 3e5;
var VOICE_MODEL_HASH = "untrained-init:no-weights-shipped";
var AURA_PROFILE_ID = "aura_v1:profile-unset";
var POTATO_INSTALL = {
	synth: {
		canary_liar: { fingerprint: "formant_fixture" },
		canary_slow: {
			fingerprint: "canary_slow",
			wallMs: 120,
			overCeiling: true
		},
		canary_ok: {
			fingerprint: "canary_ok",
			wallMs: 4
		}
	},
	f0: {
		autocorr_fixture: { fingerprint: "autocorr_fixture" },
		rmvpe: "MISSING_WEIGHTS"
	},
	reverb: { none: { fingerprint: "none" } }
};
var GRAPH_INSTALL = {
	f0: {
		f0_snap: {
			fingerprint: "f0_snap",
			wallMs: 2
		},
		rmvpe: "MISSING_WEIGHTS"
	},
	aura: { aura_v1: {
		fingerprint: "aura_v1",
		wallMs: 3
	} },
	harmonia: {
		harmonia_hpcodec: {
			fingerprint: "harmonia_hpcodec",
			kbps16: 5.4,
			kbps48: 11.1,
			wallMs: 8
		},
		harmonia_over: {
			fingerprint: "harmonia_over",
			kbps16: 9,
			kbps48: 28,
			wallMs: 180,
			overCeiling: true
		}
	},
	audit: { boy_scouts_v2: {
		fingerprint: "boy_scouts_v2",
		wallMs: 1
	} }
};
var GRAPH_REQUIRED = [
	"f0",
	"aura",
	"harmonia",
	"audit"
];
function graphInstall(patch) {
	const base = structuredClone(GRAPH_INSTALL);
	if (!patch) return base;
	for (const [kind, table] of Object.entries(patch)) base[kind] = {
		...base[kind],
		...table
	};
	return base;
}
var GRAPH_SPECS = {
	silent_fallback: {
		family: "silent_fallback",
		domain: "graph",
		expected: "reject",
		combo: {
			f0: "f0_snap",
			aura: "aura_v1",
			harmonia: "harmonia_hpcodec",
			audit: "boy_scouts_v2"
		},
		install: graphInstall({ harmonia: { harmonia_hpcodec: {
			fingerprint: "mfcc",
			kbps16: 5.4,
			kbps48: 11.1,
			wallMs: 8
		} } }),
		required: GRAPH_REQUIRED
	},
	missing_stage: {
		family: "missing_stage",
		domain: "graph",
		expected: "reject",
		combo: {
			f0: "f0_snap",
			aura: "aura_v1",
			audit: "boy_scouts_v2"
		},
		required: GRAPH_REQUIRED
	},
	unknown_impl: {
		family: "unknown_impl",
		domain: "graph",
		expected: "reject",
		combo: {
			f0: "f0_snap",
			aura: "does_not_exist",
			harmonia: "harmonia_hpcodec",
			audit: "boy_scouts_v2"
		},
		required: GRAPH_REQUIRED
	},
	not_installed: {
		family: "not_installed",
		domain: "graph",
		expected: "reject",
		combo: {
			f0: "rmvpe",
			aura: "aura_v1",
			harmonia: "harmonia_hpcodec",
			audit: "boy_scouts_v2"
		},
		required: GRAPH_REQUIRED
	},
	over_ceiling: {
		family: "over_ceiling",
		domain: "graph",
		expected: "flag",
		combo: {
			f0: "f0_snap",
			aura: "aura_v1",
			harmonia: "harmonia_over",
			audit: "boy_scouts_v2"
		},
		required: GRAPH_REQUIRED
	},
	known_good: {
		family: "known_good",
		domain: "graph",
		expected: "pass",
		combo: {
			f0: "f0_snap",
			aura: "aura_v1",
			harmonia: "harmonia_hpcodec",
			audit: "boy_scouts_v2"
		},
		required: GRAPH_REQUIRED
	}
};
var POTATO_SPECS = {
	silent_fallback: {
		family: "silent_fallback",
		domain: "potato",
		expected: "reject",
		combo: {
			f0: "autocorr_fixture",
			reverb: "none",
			synth: "canary_liar"
		},
		required: ["synth"]
	},
	missing_stage: {
		family: "missing_stage",
		domain: "potato",
		expected: "reject",
		combo: {
			f0: "autocorr_fixture",
			reverb: "none"
		},
		required: ["synth"]
	},
	unknown_impl: {
		family: "unknown_impl",
		domain: "potato",
		expected: "reject",
		combo: {
			f0: "autocorr_fixture",
			reverb: "none",
			synth: "does_not_exist"
		},
		required: ["synth"]
	},
	not_installed: {
		family: "not_installed",
		domain: "potato",
		expected: "reject",
		combo: {
			f0: "rmvpe",
			reverb: "none",
			synth: "canary_ok"
		},
		required: ["synth"]
	},
	over_ceiling: {
		family: "over_ceiling",
		domain: "potato",
		expected: "flag",
		combo: {
			f0: "autocorr_fixture",
			reverb: "none",
			synth: "canary_slow"
		},
		required: ["synth"]
	},
	known_good: {
		family: "known_good",
		domain: "potato",
		expected: "pass",
		combo: {
			f0: "autocorr_fixture",
			reverb: "none",
			synth: "canary_ok"
		},
		required: ["synth"]
	}
};
var StageError = class extends Error {
	kind;
	stage;
	constructor(message, kind, stage) {
		super(message);
		this.name = kind;
		this.kind = kind;
		this.stage = stage;
	}
};
function classify(spec) {
	const install = spec.install ?? (spec.domain === "graph" ? GRAPH_INSTALL : POTATO_INSTALL);
	let wall = 0;
	let kbps16 = null;
	let kbps48 = null;
	try {
		for (const kind of spec.required) if (!(kind in spec.combo)) throw new StageError(`missing stage ${kind}`, "KeyError", kind);
		for (const [kind, impl] of Object.entries(spec.combo)) {
			const table = install[kind];
			if (!table || !(impl in table)) throw new StageError(`unknown impl ${kind}:${impl}`, "NotImplementedError", kind);
			const slot = table[impl];
			if (slot === "MISSING_WEIGHTS") throw new StageError(`not installed ${kind}:${impl}`, "RuntimeError", kind);
			if (slot.fingerprint !== impl) throw new StageError(`fingerprint mismatch ${kind}: asked ${impl}, got ${slot.fingerprint}`, "RuntimeError", kind);
			wall += slot.wallMs ?? 1;
			if (slot.kbps16 != null) kbps16 = slot.kbps16;
			if (slot.kbps48 != null) kbps48 = slot.kbps48;
			const overRate = slot.kbps16 != null && slot.kbps16 > 6 || slot.kbps48 != null && slot.kbps48 > 12;
			if (slot.overCeiling || overRate || wall > CAPS.wall_clock_ms) return {
				verdict: "flag",
				reason: overRate ? `bitrate over ceiling (16 kHz ${slot.kbps16 ?? "—"} / 48 kHz ${slot.kbps48 ?? "—"})` : `wall clock ${wall} ms over cap ${CAPS.wall_clock_ms} ms`,
				audience_compute_ok: 0,
				wallMs: wall,
				kbps16,
				kbps48,
				failedKind: kind
			};
		}
		return {
			verdict: "pass",
			reason: "fingerprints match and fixture rates sit under the ceiling",
			audience_compute_ok: 1,
			wallMs: wall,
			kbps16,
			kbps48,
			failedKind: null
		};
	} catch (err) {
		return {
			verdict: "reject",
			reason: err instanceof Error ? err.message : "reject",
			audience_compute_ok: 0,
			wallMs: wall,
			kbps16,
			kbps48,
			failedKind: err instanceof StageError ? err.stage : null
		};
	}
}
function iso(ms) {
	return new Date(ms).toISOString();
}
function canonicalize(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map((item) => canonicalize(item)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}
async function sha256(text) {
	const data = new TextEncoder().encode(text);
	const buf = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function uuid() {
	return crypto.randomUUID();
}
function validate(event) {
	if (!event.event_id || !event.correlation_id || !event.issuer_id) return "null envelope field";
	if (event.schema_version !== "2.0.0") return "schema_version";
	if (!EVENT_SET.has(event.event_type)) return `phantom event_type ${event.event_type}`;
	if (event.timestamp == null || event.cdc == null) return "null timestamp";
	if (event.parent_event_id == null && !GENESIS.has(event.event_type)) return `null parent on ${event.event_type}`;
	const caps = event.payload.caps;
	if (caps) for (const [key, value] of Object.entries(caps)) {
		if (value == null || typeof value !== "number" || Number.isNaN(value)) return `null cap ${key}`;
		if (value < (key === "wall_clock_ms" || key === "verify_ms" || key === "reconciliation_ms" ? 1 : 0)) return `cap ${key} below minimum`;
	}
	return null;
}
function stamp(now, skew, mono) {
	return {
		host: iso(now),
		rfc3161: iso(now + skew),
		vcs: iso(now + skew),
		host_monotonic_ms: mono,
		concordance: Math.max(now, now + skew) - Math.min(now, now + skew) <= 3e5 ? "concordant" : "discordant",
		tolerance_ms: CDC_TOLERANCE_MS
	};
}
function specFor(family, domain) {
	return domain === "potato" ? POTATO_SPECS[family] : GRAPH_SPECS[family];
}
function reachedNodes(report) {
	const types = new Set(report.events.map((event) => event.event_type));
	const nodes = ["mic"];
	if (report.events.some((event) => event.payload.stage === "f0" && event.event_type === "tool.result")) nodes.push("f0");
	if (types.has("policy.decision") || types.has("log.notarized")) nodes.push("consent");
	if (report.events.some((event) => event.payload.stage === "aura" && event.event_type === "tool.result")) nodes.push("aura");
	if (report.events.some((event) => event.payload.stage === "harmonia" && event.event_type === "tool.result")) nodes.push("enc16", "enc48", "rvq");
	if (report.events.some((event) => event.payload.stage === "audit" && event.event_type === "tool.result")) nodes.push("audit");
	if (nodes.includes("rvq")) nodes.push("dec");
	nodes.push("out");
	return nodes;
}
function evaluate(events, rejections) {
	const byType = (type) => events.filter((event) => event.event_type === type);
	const holds = (id, ok, detail) => ({
		id,
		holds: ok,
		detail
	});
	const calls = byType("tool.call");
	let i1 = true;
	let i1detail = calls.length === 0 ? "No tool.call in this run." : "Each call has one terminal.";
	for (const call of calls) {
		const id = call.payload.tool_call_id;
		const terminals = events.filter((event) => (event.event_type === "tool.result" || event.event_type === "circuit_break") && event.payload.tool_call_id === id);
		if (terminals.length !== 1) {
			i1 = false;
			i1detail = `${String(id)} has ${terminals.length} terminals.`;
			break;
		}
	}
	const starts = byType("loop.start");
	let i2 = true;
	let i2detail = starts.length === 0 ? "Loop did not start." : "Safety check precedes loop.start.";
	for (const start of starts) if (!events.filter((event) => event.event_type === "check.registered" && event.correlation_id === start.correlation_id && event.timestamp < start.timestamp && event.payload.falsifiable === true && event.payload.predicate_type === "safety").some((check) => events.some((event) => event.event_type === "predicate.validated" && event.payload.predicate_id === check.payload.predicate_id && event.payload.verdict === "valid" && event.timestamp < start.timestamp))) {
		i2 = false;
		i2detail = "loop.start without a validated safety predicate.";
	}
	const keys = calls.filter((call) => call.payload.side_effecting === true).map((call) => String(call.payload.idempotency_key));
	const i3 = new Set(keys).size === keys.length;
	let i4 = true;
	let i4detail = "No verify.result in this run.";
	for (const verify of byType("verify.result")) {
		i4detail = "Analyzer issuer is independent of the model lineage.";
		const models = byType("model.result");
		for (const model of models) {
			const sameIssuer = verify.issuer_id === model.issuer_id;
			const sameModelLine = verify.issuer_type === "model" && verify.payload.lineage_hash === model.payload.lineage_hash;
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
		const caps = start.payload.caps;
		const wall = events.filter((event) => event.event_type === "tool.result" || event.event_type === "circuit_break").reduce((sum, event) => sum + (Number(event.payload.wall_ms) || 0), 0);
		const tokens = calls.length * 32;
		const checks = [
			["wall_clock_ms", wall],
			["token_budget", tokens],
			["cost_usd", 0],
			["max_retries", 0],
			["max_fanout", 1],
			["reconciliation_ms", 0]
		];
		for (const [cap, metric] of checks) if (metric > caps[cap]) {
			if (!events.some((event) => event.event_type === "circuit_break" && event.payload.breached_cap === cap)) {
				i5 = false;
				i5detail = `${cap} exceeded (${metric} > ${caps[cap]}) without a matching circuit_break.`;
			}
		}
	}
	if (starts.length === 0) i5detail = "No loop, no cap to breach.";
	let i6 = true;
	let i6detail = "No failing verify.result.";
	for (const verify of byType("verify.result")) {
		if (verify.payload.status !== "fail") continue;
		i6detail = "Failure produced a rule before terminate.";
		const ruled = events.some((event) => (event.event_type === "rule.learned" || event.event_type === "rule.declined") && event.payload.source_verify_id === verify.payload.verify_id);
		if (byType("loop.terminate").length > 0 && !ruled) {
			i6 = false;
			i6detail = "Terminate after a failed verify with no rule.";
		}
	}
	const m1 = events.every((event) => EVENT_SET.has(event.event_type)) && rejections.every((item) => item.reason.length > 0);
	let m2 = true;
	let m2detail = "Checks follow a valid predicate.";
	for (const check of byType("check.registered")) if (!events.some((event) => event.event_type === "predicate.validated" && event.payload.predicate_id === check.payload.predicate_id && event.payload.verdict === "valid" && event.timestamp <= check.timestamp)) {
		m2 = false;
		m2detail = "check.registered without predicate.validated.";
	}
	let m3 = true;
	let m3detail = "No verify.result.";
	for (const verify of byType("verify.result")) {
		m3detail = "Oracle attestation matches the analyzer lineage.";
		if (!events.some((event) => event.event_type === "oracle.attested" && event.payload.subject_id === verify.issuer_id && event.payload.lineage_hash === verify.payload.lineage_hash && event.payload.expired !== true && event.timestamp <= verify.timestamp)) {
			m3 = false;
			m3detail = "verify.result without a current oracle.attested.";
		}
	}
	let m4 = true;
	let m4detail = "No circuit_break.";
	for (const brk of byType("circuit_break")) {
		const monitors = new Set(events.filter((event) => event.event_type === "monitor.attested" && event.timestamp <= brk.timestamp).map((event) => event.issuer_id));
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
		holds("M5", m5, m5detail)
	];
}
async function executeRun(options) {
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
	const events = [];
	const rejections = [];
	let mono = 0;
	let parent = null;
	const concordant = Math.abs(skew) <= CDC_TOLERANCE_MS;
	const push = (type, issuer, issuerType, payload) => {
		const event = {
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
			payload
		};
		mono += 1;
		const problem = validate(event);
		if (problem) {
			rejections.push({
				attempted_type: type,
				reason: problem
			});
			return null;
		}
		events.push(event);
		parent = event.event_id;
		return event;
	};
	if (nullCaps) {
		const poisoned = {
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
			payload: { caps: {
				...CAPS,
				token_budget: null
			} }
		};
		rejections.push({
			attempted_type: "loop.start",
			reason: validate(poisoned) ?? "null cap"
		});
	} else {
		const predicateId = `pred-${nonce}`;
		push("predicate.registered", "falsifiability-engine", "analyzer", {
			predicate_id: predicateId,
			predicate_type: "safety",
			falsifiable: true
		});
		push("predicate.validated", "falsifiability-engine", "analyzer", {
			predicate_id: predicateId,
			verdict: "valid"
		});
		push("check.registered", "lattice-host", "orchestrator", {
			predicate_id: predicateId,
			predicate_type: "safety",
			falsifiable: true
		});
		push("oracle.attested", "trust-oracle", "oracle", {
			subject_id: "falsifiability-engine",
			lineage_hash: "lineage-analyzer",
			expired: false
		});
		push("monitor.attested", "monitor-a", "monitor", { monitor_id: "monitor-a" });
		if (!singleMonitor) push("monitor.attested", "monitor-b", "monitor", { monitor_id: "monitor-b" });
		push("canary.injected", "canary-suite", "oracle", {
			nonce,
			family: spec.family,
			expected_verdict: spec.expected,
			suite_hash: "canaries.py:FAMILIES"
		});
		push("loop.start", "lattice-host", "orchestrator", {
			caps: { ...CAPS },
			goal_hash: "harmonia-aura-graph",
			environment_hash: "skeleton-unverified"
		});
		const allowSpatial = consent && concordant && !singleMonitor && classified.verdict === "pass";
		push("policy.decision", "lattice-host", "orchestrator", {
			decision: consent ? "allow" : "deny",
			reason: consent ? "consent presented" : "consent missing",
			voice_model_hash: VOICE_MODEL_HASH,
			aura_profile_id: AURA_PROFILE_ID
		});
		push("log.notarized", "trust-anchor", "oracle", {
			external_timestamp: iso(now0 + skew),
			merkle_root: "",
			transparency_log_proof: concordant ? "sim-inclusion" : "withheld",
			voice_model_hash: VOICE_MODEL_HASH,
			aura_profile_id: AURA_PROFILE_ID,
			before: "aura_spatial_output"
		});
		const order = spec.domain === "graph" ? GRAPH_REQUIRED : [
			"f0",
			"reverb",
			"synth"
		];
		let broke = false;
		const breakWith = (callId, cap, wall) => {
			push("circuit_break", "lattice-host", "orchestrator", {
				tool_call_id: callId,
				breached_cap: cap,
				wall_ms: wall
			});
			broke = true;
		};
		if (!consent || !concordant || singleMonitor) breakWith(null, singleMonitor ? "max_fanout" : !concordant ? "wall_clock_ms" : "max_fanout", 0);
		if (!broke) for (const kind of order) {
			if (!(kind in spec.combo)) {
				const callId = uuid();
				push("tool.call", kind, "tool", {
					tool_call_id: callId,
					stage: kind,
					impl: null,
					side_effecting: true,
					irreversible: false,
					idempotency_key: `${correlation}:${kind}`
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
				idempotency_key: `${correlation}:${kind}:${impl}`
			});
			const failedHere = classified.verdict !== "pass" && (classified.reason.includes(kind) || classified.reason.includes(impl) || kind === "harmonia" && classified.verdict === "flag" || kind === "synth" && classified.verdict === "flag");
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
					kbps48: classified.kbps48
				});
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
				kbps48: kind === "harmonia" ? classified.kbps48 : null
			});
			if (kind === "harmonia" || kind === "synth") push("model.result", "harmonia-model", "model", {
				lineage_hash: "lineage-model",
				output_hash: `out-${nonce}`,
				stage: kind
			});
		}
		const verifyId = `verify-${nonce}`;
		const verifyStatus = allowSpatial ? "pass" : "fail";
		push("verify.attempt", "falsifiability-engine", "analyzer", { verify_id: verifyId });
		push("verify.result", "falsifiability-engine", "analyzer", {
			verify_id: verifyId,
			status: verifyStatus,
			lineage_hash: "lineage-analyzer",
			artifact_hash: `out-${nonce}`
		});
		if (verifyStatus === "fail") push("rule.learned", "falsifiability-engine", "analyzer", {
			source_verify_id: verifyId,
			half_life_ms: 864e5,
			next_revalidation: iso(now0 + 864e5),
			decay_status: "live",
			rule: classified.verdict === "pass" ? "host gate closed the path" : classified.reason
		});
		push("canary.result", "canary-suite", "oracle", {
			nonce,
			family: spec.family,
			expected_verdict: spec.expected,
			actual_verdict: classified.verdict
		});
		push("loop.terminate", "lattice-host", "orchestrator", {
			status: allowSpatial ? "ok" : "fail",
			reconciliation_complete: true,
			open_checks: 0
		});
	}
	let previous = null;
	const priorHashes = [];
	for (const event of events) {
		if (event.event_type === "log.notarized") event.payload = {
			...event.payload,
			merkle_root: priorHashes.length ? await sha256(priorHashes.join("")) : await sha256("genesis")
		};
		event.previous_hash = previous;
		event.event_hash = await sha256(canonicalize({
			...event,
			event_hash: ""
		}));
		previous = event.event_hash;
		priorHashes.push(event.event_hash);
	}
	const merkle = priorHashes.length ? await sha256(priorHashes.join("")) : "";
	const invariants = evaluate(events, rejections);
	const invariantOk = invariants.every((item) => item.holds);
	const sketchPermit = classified.verdict === "pass" && consent && concordant && !singleMonitor && !nullCaps && rejections.length === 0 && invariantOk;
	let lamp = "FAIL CLOSED";
	if (nullCaps) lamp = "SCHEMA REJECT · MUTED";
	else if (!concordant) lamp = "UNDATEABLE · MUTED";
	else if (classified.verdict === "pass" && sketchPermit) lamp = "HARNESS PASS · CODEC MUTED";
	else if (classified.verdict === "pass") lamp = "HARNESS PASS · GATES CLOSED";
	else if (classified.verdict === "flag") lamp = "FLAGGED · MUTED";
	else lamp = "REJECTED · MUTED";
	const monitors = events.filter((event) => event.event_type === "monitor.attested").length;
	const report = {
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
		reached: []
	};
	report.reached = reachedNodes(report);
	return report;
}
function mulberry(seed) {
	let state = seed >>> 0;
	return () => {
		state = state + 1831565813 | 0;
		let t = Math.imul(state ^ state >>> 15, 1 | state);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function runSuiteClassify(domain, K = 60, theta = .95, seed = 1) {
	const rng = mulberry(seed);
	const names = FAMILIES;
	const miss = Object.fromEntries(names.map((name) => [name, 0]));
	const seen = Object.fromEntries(names.map((name) => [name, 0]));
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
		detection_rate: Math.round(detection * 1e3) / 1e3,
		systematic_miss_families: systematic,
		per_family_misses: miss,
		harness_attested: attested,
		note: "Classifier checked against the published expected verdicts. This does not execute bench_one.py and is not a target-hardware canary."
	};
}
var BENCH_FIELDS = [
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
	"listening_score"
];
/** Contract skeleton. Organ-bus symbols are intentionally absent. */
var PROCESSOR_SOURCE = `// =============================================================================
// TheRealla_Harmonia_Aura.cmajor
// Contract skeleton for the Cmajor / C++ team.
//
// Fingerprints
//   aura_v1            spatial bus (binaural L/R + mono reference)
//   harmonia_hpcodec   causal neural codec
//   boy_scouts_v2      audit host
//   f0_snap            pitch quantizer, placed BEFORE the spatial bus
//
// production_ready = false
// No canary in this file has passed on target hardware.
// Decoder streaming is NOT verified. Decode returns silence.
// Unmeasured bitrates are NOT under the ceiling.
//
// The previous divide-down instrument bus is gone. Do not reintroduce it
// under a mix knob. Deletion manifest lives in the audit configuration,
// not as leftover code in this processor.
//
// Dialect matches the MEGA host processor: events pop on read.
// This file is the contract. It is not a compile-checked patch.
// =============================================================================

processor HarmoniaAuraPlayer
{
    const string FP_AURA = "aura_v1";
    const string FP_HARMONIA = "harmonia_hpcodec";
    const string FP_AUDIT = "boy_scouts_v2";
    const string FP_F0 = "f0_snap";

    const double CAP_16_KBPS = 6.0;
    const double CAP_48_KBPS = 12.0;
    const double CAP_FRAME_MS = 50.0;

    input stream float32<2> audioIn;
    output stream float32<2> audioOut;

    input event struct MidiEvent {
        int type;       // 0 note on, 1 note off, 2 cc, 3 pitch
        int channel;
        int data1;
        int data2;
    } midiEvent;

    input event struct PoseEvent {
        float yaw;
        float pitch;
        float azimuth;
        float elev;
    } poseEvent;

    input event struct ConsentEvent {
        string voiceModelHash;
        string auraProfileId;
    } consentEvent;

    output event struct AuditEvent {
        string eventType;
        string issuerId;
        string fingerprint;
        float value;
        bool failClosed;
    } auditEvent;

    bool consentAnchored = false;
    bool pathMuted = true;
    // The processor must not set this itself. The host may set it only
    // after a Boy Scouts canary passes on the target hardware.
    bool decoderStreamingVerified = false;
    string voiceModelHash = "";
    string auraProfileId = "";
    float headYaw = 0.0f;
    float sourceAz = 0.0f;
    float monoRef = 0.0f;
    float binL = 0.0f;
    float binR = 0.0f;

    void emit(string type, string issuer, string fp, float value, bool closed)
    {
        // Host stamps schema 2.0.0, three CDC clocks, hash chain, Merkle.
        // Null caps are rejected by the host and never become events.
        auditEvent.eventType = type;
        auditEvent.issuerId = issuer;
        auditEvent.fingerprint = fp;
        auditEvent.value = value;
        auditEvent.failClosed = closed;
    }

    float snapF0(float dryMono)
    {
        emit("tool.call", "f0_snap", FP_F0, dryMono, false);
        // Real module: f0_snap.py. Identity until that module is linked.
        emit("tool.result", "f0_snap", FP_F0, dryMono, false);
        return dryMono;
    }

    void auraSpatial(float dry, float az, float yaw)
    {
        emit("tool.call", "aura", FP_AURA, az, false);
        float delta = az - yaw;
        if (delta > 1.0f) delta = 1.0f;
        if (delta < -1.0f) delta = -1.0f;
        monoRef = dry;
        float attenL = delta > 0.0f ? delta : 0.0f;
        float attenR = delta < 0.0f ? -delta : 0.0f;
        binL = dry * (1.0f - 0.3f * attenL);
        binR = dry * (1.0f - 0.3f * attenR);
        emit("tool.result", "aura", FP_AURA, delta, false);
    }

    void harmoniaEncode(float mono)
    {
        emit("tool.call", "harmonia", FP_HARMONIA, mono, false);
        // Fixture rates are illegal here. 0 means not measured.
        // Host overwrites only with a measured rate from a sealed run.
        emit("tool.result", "harmonia", FP_HARMONIA, 0.0f, false);
    }

    float harmoniaDecode()
    {
        if (!decoderStreamingVerified) {
            emit("verify.result", "boy_scouts_v2", FP_AUDIT, 0.0f, true);
            return 0.0f;
        }
        return monoRef;
    }

    void main()
    {
        if (consentEvent != null) {
            voiceModelHash = consentEvent.voiceModelHash;
            auraProfileId = consentEvent.auraProfileId;
            consentAnchored = voiceModelHash.length() > 0 && auraProfileId.length() > 0;
            emit("log.notarized", "trust_anchor", FP_AUDIT,
                 consentAnchored ? 1.0f : 0.0f, !consentAnchored);
        }

        if (poseEvent != null) {
            headYaw = poseEvent.yaw;
            sourceAz = poseEvent.azimuth;
        }

        // Runtime pops each MIDI event on read, same as the MEGA host loop.
        while (midiEvent != null) {
            emit("tool.call", "midi", FP_AUDIT, float(midiEvent.data1), false);
            emit("tool.result", "midi", FP_AUDIT, float(midiEvent.data2), false);
        }

        if (!consentAnchored) {
            pathMuted = true;
            emit("policy.decision", "boy_scouts_v2", FP_AUDIT, 0.0f, true);
            emit("circuit_break", "boy_scouts_v2", FP_AUDIT, 0.0f, true);
            audioOut[0] = 0.0f;
            audioOut[1] = 0.0f;
            return;
        }

        float dry = 0.5f * (audioIn[0] + audioIn[1]);
        float snapped = snapF0(dry);
        auraSpatial(snapped, sourceAz, headYaw);
        harmoniaEncode(monoRef);

        // Rates stay 0 in this skeleton, so the ceiling check fails closed.
        float kbps16 = 0.0f;
        float kbps48 = 0.0f;
        bool unmeasured = kbps16 <= 0.0f || kbps48 <= 0.0f;
        bool over = kbps16 > CAP_16_KBPS || kbps48 > CAP_48_KBPS;
        if (over || unmeasured || !decoderStreamingVerified) {
            pathMuted = true;
            emit("circuit_break", "boy_scouts_v2", FP_AUDIT, CAP_FRAME_MS, true);
            audioOut[0] = 0.0f;
            audioOut[1] = 0.0f;
            return;
        }

        float y = harmoniaDecode();
        auraSpatial(y, sourceAz, headYaw);
        audioOut[0] = binL;
        audioOut[1] = binR;
        pathMuted = false;
    }
}
`;
var PROCESSOR_FORBIDDEN = [
	"drawbar",
	"Leslie",
	"percussion",
	"renderDivideDown",
	"rotary",
	"ddVoices",
	"foldback"
];
function processorViolations(source = PROCESSOR_SOURCE) {
	return PROCESSOR_FORBIDDEN.filter((word) => source.includes(word));
}
function auditConfig() {
	return {
		name: "boy_scouts_v2 lattice host",
		schema_version: SCHEMA_VERSION,
		production_ready: false,
		reason: "No canary has passed on target hardware. Console self-checks do not count.",
		fingerprints: {
			aura: "aura_v1",
			harmonia: "harmonia_hpcodec",
			audit: "boy_scouts_v2",
			f0: "f0_snap"
		},
		decoder_streaming_verified: false,
		decoder_blocker: "CausalTransposedConv1d streaming is unverified in harmonia_neural.py and is left unchanged.",
		organ_bus: "deleted",
		excised_symbols: PROCESSOR_FORBIDDEN,
		bench_one_fields_frozen: [...BENCH_FIELDS],
		schema_drift_guard: "CSV schema drift: existing header does not match current FIELDS. Use a new --out or migrate.",
		fingerprint_guard: "fingerprint mismatch {kind}: asked {impl}, got {meta.fingerprint}",
		consent_gate: {
			before: "aura_spatial_output",
			logs: ["voice_model_hash", "aura_profile_id"],
			voice_model_hash: "untrained-init:no-weights-shipped",
			aura_profile_id: "aura_v1:profile-unset",
			anchor: ["merkle", "rfc3161"],
			fail_closed: true
		},
		cdc: {
			min_sources: 3,
			tolerance_ms: CDC_TOLERANCE_MS,
			sources: [
				"monotonic host clock",
				"RFC 3161",
				"signed VCS commit timestamp"
			],
			discordance: "Quarantine into an undateable stratum. Non-citable. Never back-fill."
		},
		caps: CAPS,
		null_caps: "forbidden",
		dual_monitor: {
			circuit_break_requires: "two distinct monitor.attested or one monitor.disagreement",
			spatial_output_requires: "two monitor.attested even when the combo verdict is pass"
		},
		invariants: INVARIANT_COPY.map((item) => item.id),
		canary_families: FAMILIES.map((family) => {
			const spec = GRAPH_SPECS[family];
			return {
				family,
				expected_verdict: FAMILY_COPY[family].expected,
				detects: FAMILY_COPY[family].detects,
				bound_stages: Object.keys(spec.combo),
				combo: spec.combo,
				graph_action: family === "known_good" ? "harness_pass_codec_stays_muted" : "fail_closed_mute",
				potato_equivalent: true
			};
		}),
		bitrate_ceilings_kbps: {
			branch_16k: 6,
			branch_48k: 12,
			grade: "unverified"
		},
		causal: "required",
		lookahead: "forbidden"
	};
}
var TABS = [
	{
		id: "graph",
		label: "Graph"
	},
	{
		id: "processor",
		label: "Processor"
	},
	{
		id: "audit",
		label: "Audit"
	},
	{
		id: "bandwidth",
		label: "Bandwidth"
	},
	{
		id: "plan",
		label: "Plan"
	}
];
function download(filename, text) {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}
function Grade({ grade }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: clsx("inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] uppercase tracking-wide", grade === "measured" && "border-brass text-brass", grade === "estimated" && "border-line text-fg", grade === "unverified" && "border-fault text-fault"),
		children: grade
	});
}
function LatticeApp() {
	const [tab, setTab] = (0, import_react.useState)("graph");
	const [family, setFamily] = (0, import_react.useState)("known_good");
	const [consent, setConsent] = (0, import_react.useState)(true);
	const [skew, setSkew] = (0, import_react.useState)(false);
	const [single, setSingle] = (0, import_react.useState)(false);
	const [nullCaps, setNullCaps] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(null);
	const [suites, setSuites] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)("aura");
	const [sketchOn, setSketchOn] = (0, import_react.useState)(false);
	const [azimuth, setAzimuth] = (0, import_react.useState)(.35);
	const violations = (0, import_react.useMemo)(() => processorViolations(), []);
	const configText = (0, import_react.useMemo)(() => JSON.stringify(auditConfig(), null, 2), []);
	function flip(update) {
		update((value) => !value);
		setReport(null);
		setSketchOn(false);
	}
	async function run(next) {
		setFamily(next);
		setBusy(true);
		setSketchOn(false);
		const result = await executeRun({
			family: next,
			consent,
			clockSkewMs: skew ? 6e5 : 0,
			nullCaps,
			singleMonitor: single
		});
		setReport(result);
		setBusy(false);
	}
	function runSuites() {
		setSuites({
			graph: runSuiteClassify("graph"),
			potato: runSuiteClassify("potato")
		});
	}
	const permit = Boolean(report?.sketchPermit) && sketchOn;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-line",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.22em] text-muted",
							children: "TheRealla"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-4xl text-fg sm:text-5xl",
							children: "Harmonia Lattice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Aura takes the organ’s place. HarmoniaCodec is the causal latent path. Boy Scouts v2 is the host that mutes the output when a claim is not sealed."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamp, {
					report,
					busy
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3",
				"aria-label": "Sections",
				children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(item.id),
					className: clsx("min-h-11 shrink-0 rounded-sm border px-3 text-sm", tab === item.id ? "border-brass bg-brass text-ink" : "border-line bg-surface text-fg"),
					"aria-current": tab === item.id ? "page" : void 0,
					children: item.label
				}, item.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children: [
				tab === "graph" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphTab, {
					family,
					consent,
					skew,
					single,
					nullCaps,
					busy,
					report,
					suites,
					selected,
					azimuth,
					sketchOn: sketchOn && Boolean(report?.sketchPermit),
					onConsent: () => flip(setConsent),
					onSkew: () => flip(setSkew),
					onSingle: () => flip(setSingle),
					onNull: () => flip(setNullCaps),
					onSelect: setSelected,
					onAzimuth: setAzimuth,
					onSketch: () => setSketchOn((value) => !value),
					onRun: (next) => void run(next),
					onSuite: runSuites,
					permit
				}),
				tab === "processor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcessorTab, {
					violations,
					onDownload: () => download("TheRealla_Harmonia_Aura.cmajor", PROCESSOR_SOURCE)
				}),
				tab === "audit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditTab, {
					report,
					configText,
					onDownload: () => download("boy_scouts_audit.json", configText)
				}),
				tab === "bandwidth" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandwidthTab, {}),
				tab === "plan" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanTab, {})
			]
		})]
	});
}
function Lamp({ report, busy }) {
	const fault = !report || report.lamp.startsWith("HARNESS PASS") === false;
	const label = busy ? "SEALING" : report?.lamp ?? "NO RUN";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-56 border border-line bg-surface px-3 py-2",
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: clsx("size-2.5 rounded-full", fault ? "bg-fault" : "bg-brass"),
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-widest text-muted",
					children: "Codec path"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-fg",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted",
				children: "Muted until a canary passes on device. This page is not that device."
			})
		]
	});
}
function Gate({ on, label, detail, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: clsx("min-h-11 border px-3 py-2 text-left", on ? "border-brass bg-raised" : "border-line bg-surface"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm text-fg",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-[11px] text-muted",
			children: detail
		})]
	});
}
function GraphTab(props) {
	const node = FLOW.find((item) => item.id === props.selected) ?? FLOW[0];
	const failed = props.report?.classify.failedKind;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
						on: props.consent,
						onClick: props.onConsent,
						label: "Consent anchored",
						detail: props.consent ? "Hash logged before Aura" : "Spatial output refused"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
						on: props.skew,
						onClick: props.onSkew,
						label: "Skew the clocks",
						detail: props.skew ? "RFC 3161 is 10 min off" : "Three sources agree"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
						on: props.single,
						onClick: props.onSingle,
						label: "Single monitor",
						detail: props.single ? "M4 must fail" : "Two monitors required"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
						on: props.nullCaps,
						onClick: props.onNull,
						label: "Null token cap",
						detail: props.nullCaps ? "Schema rejects the loop" : "Caps are integers"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: "Signal path"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-widest text-muted",
					children: "Organ bus excised"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-5",
				children: FLOW.map((item, index) => {
					const reached = props.report?.reached.includes(item.id) ?? false;
					const isFail = failed === "f0" && item.id === "f0" || failed === "aura" && item.id === "aura" || failed === "harmonia" && (item.id === "enc16" || item.id === "enc48" || item.id === "rvq");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => props.onSelect(item.id),
						className: clsx("flex min-h-11 w-full flex-col border px-3 py-2 text-left", props.selected === item.id && "ring-1 ring-brass", isFail ? "border-fault" : reached ? "border-brass" : "border-line", reached ? "bg-raised" : "bg-surface"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] uppercase tracking-widest text-muted",
								children: [
									String(index + 1).padStart(2, "0"),
									" ",
									item.kicker
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-fg",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-brass",
								children: item.fingerprint
							})
						]
					}) }, item.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-widest text-muted",
							children: node.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl",
							children: node.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: node.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-fault",
							children: node.caveat
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[11px] text-muted",
							children: ["Fingerprint ", node.fingerprint]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl",
							children: "Excised"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted",
							children: EXCISED.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "line-through decoration-fault",
								children: item
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[11px] text-muted",
							children: "Names only. The skeleton contains none of this code."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: "Canaries"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Six families from canaries.py, rebound onto Aura and Harmonia."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: props.onSuite,
							className: "min-h-11 border border-line px-3 text-sm text-fg",
							children: "Score 60 × 2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
						children: Object.keys(FAMILY_COPY).map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: props.busy,
							onClick: () => props.onRun(name),
							className: clsx("min-h-11 border px-3 py-2 text-left disabled:opacity-50", props.family === name && props.report ? "border-brass bg-raised" : "border-line"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-fg",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-[11px] text-muted",
								children: ["expect ", FAMILY_COPY[name].expected]
							})]
						}, name))
					}),
					props.report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Verdict "
							}),
							props.report.actual,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: " · expected "
							}),
							props.report.expected,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: " · "
							}),
							props.report.matched ? "match" : "MISS",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: " · "
							}),
							props.report.classify.reason
						]
					}),
					props.suites && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2 sm:grid-cols-2",
						children: ["graph", "potato"].map((domain) => {
							const suite = props.suites?.[domain];
							if (!suite) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "border border-line px-3 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: domain
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [
											" detection ",
											suite.detection_rate.toFixed(3),
											" / ",
											suite.theta,
											" · "
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: suite.harness_attested ? "text-brass" : "text-fault",
										children: suite.harness_attested ? "harness attested" : "not attested"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] text-muted",
										children: suite.note
									})
								]
							}, domain);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sketch, {
				permit: props.permit,
				armed: props.sketchOn,
				canArm: Boolean(props.report?.sketchPermit),
				azimuth: props.azimuth,
				onArm: props.onSketch,
				onAzimuth: props.onAzimuth
			})
		]
	});
}
function Sketch({ permit, armed, canArm, azimuth, onArm, onAzimuth }) {
	const canvasRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const toneRef = (0, import_react.useRef)(null);
	function applyAzimuth(ctx, value) {
		const tone = toneRef.current;
		if (!tone) return;
		const itd = Math.sin(value * Math.PI) * 6e-4;
		const when = ctx.currentTime;
		tone.left.delayTime.setTargetAtTime(Math.max(0, itd), when, .02);
		tone.right.delayTime.setTargetAtTime(Math.max(0, -itd), when, .02);
		tone.gainL.gain.setTargetAtTime(value > 0 ? .12 : .2, when, .02);
		tone.gainR.gain.setTargetAtTime(value < 0 ? .12 : .2, when, .02);
	}
	function stopTone() {
		const tone = toneRef.current;
		if (!tone) return;
		try {
			tone.osc.stop();
		} catch {}
		toneRef.current = null;
	}
	function startTone() {
		const ctx = audioRef.current ?? new AudioContext();
		audioRef.current = ctx;
		ctx.resume();
		stopTone();
		const osc = ctx.createOscillator();
		osc.type = "sine";
		osc.frequency.value = 196;
		const left = ctx.createDelay(.005);
		const right = ctx.createDelay(.005);
		const gainL = ctx.createGain();
		const gainR = ctx.createGain();
		const merger = ctx.createChannelMerger(2);
		osc.connect(left);
		osc.connect(right);
		left.connect(gainL);
		right.connect(gainR);
		gainL.connect(merger, 0, 0);
		gainR.connect(merger, 0, 1);
		merger.connect(ctx.destination);
		osc.start();
		toneRef.current = {
			osc,
			left,
			right,
			gainL,
			gainR
		};
		applyAzimuth(ctx, azimuth);
	}
	(0, import_react.useEffect)(() => {
		if (!canArm) stopTone();
		return () => stopTone();
	}, [canArm]);
	(0, import_react.useEffect)(() => {
		const ctx = audioRef.current;
		if (!ctx || !permit) return;
		applyAzimuth(ctx, azimuth);
	}, [azimuth, permit]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		let frame = 0;
		let raf = 0;
		const draw = () => {
			const width = canvas.width;
			const height = canvas.height;
			context.clearRect(0, 0, width, height);
			context.fillStyle = "#1c1a16";
			context.fillRect(0, 0, width, height);
			context.strokeStyle = permit ? "#d4af37" : "#3a3428";
			context.lineWidth = 1.5;
			context.beginPath();
			for (let x = 0; x < width; x += 1) {
				const t = x / width;
				const phase = permit ? frame * .08 + t * Math.PI * 8 : 0;
				const y = permit ? height * .5 + Math.sin(phase) * height * .28 : height * .5;
				if (x === 0) context.moveTo(x, y);
				else context.lineTo(x, y);
			}
			context.stroke();
			if (permit) {
				context.strokeStyle = "#f3ead7";
				context.globalAlpha = .7;
				context.beginPath();
				const shift = Math.sin(azimuth * Math.PI) * 18;
				for (let x = 0; x < width; x += 1) {
					const t = x / width;
					const phase = frame * .08 + t * Math.PI * 8;
					const y = height * .5 + Math.sin(phase + shift * .08) * height * .18;
					if (x === 0) context.moveTo(x, y);
					else context.lineTo(x, y);
				}
				context.stroke();
				context.globalAlpha = 1;
			}
			frame += 1;
			if (permit && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(draw);
		};
		draw();
		return () => cancelAnimationFrame(raf);
	}, [permit, azimuth]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border border-line bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: "Binaural sketch"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-sm text-muted",
					children: "A 196 Hz tone with interaural delay. It is not aura_v1, and it will not start unless the harness passed and the gates are clear. The codec output stays silent either way."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !canArm && !armed,
					onClick: () => {
						if (toneRef.current) {
							stopTone();
							onArm();
							return;
						}
						startTone();
						onArm();
					},
					className: "min-h-11 border border-brass px-3 text-sm text-brass disabled:border-line disabled:text-muted",
					children: armed ? "Stop sketch" : "Play ITD sketch"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				width: 960,
				height: 160,
				className: "mt-3 h-36 w-full border border-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-sm text-muted",
				children: [
					"Source azimuth ",
					azimuth.toFixed(2),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: -1,
						max: 1,
						step: .01,
						value: azimuth,
						disabled: !permit,
						onChange: (event) => onAzimuth(Number(event.target.value)),
						className: "mt-1 block w-full accent-brass"
					})
				]
			})
		]
	});
}
function ProcessorTab({ violations, onDownload }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl",
					children: "Processor skeleton"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-sm text-muted",
					children: "Fingerprints aura_v1, harmonia_hpcodec, boy_scouts_v2. Decode returns silence. Unmeasured rates fail the ceiling check."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDownload,
					className: "min-h-11 bg-brass px-3 text-sm text-ink",
					children: "Download .cmajor"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: clsx("text-sm", violations.length ? "text-fault" : "text-brass"),
				children: violations.length ? `Organ symbols still in the skeleton: ${violations.join(", ")}` : "Scan: no drawbar, percussion, rotary, foldback, or divide-down symbols in the skeleton."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-[32rem] overflow-auto border border-line bg-surface p-4 text-xs leading-relaxed text-fg",
				children: PROCESSOR_SOURCE
			})
		]
	});
}
function AuditTab({ report, configText, onDownload }) {
	const sample = report?.events[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl",
					children: "Boy Scouts v2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-sm text-muted",
					children: "Schema 2.0.0. Null caps never become events. A break without two monitors fails M4 and the sample stays muted."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDownload,
					className: "min-h-11 bg-brass px-3 text-sm text-ink",
					children: "Download audit JSON"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: INVARIANT_COPY.map((item) => {
					const verdict = report?.invariants.find((row) => row.id === item.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "border border-line bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-lg",
								children: [
									item.id,
									" ",
									item.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: clsx("text-[11px] uppercase", verdict ? verdict.holds ? "text-brass" : "text-fault" : "text-muted"),
								children: verdict ? verdict.holds ? "holds" : "fails" : "no run"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[12px] text-muted",
							children: verdict?.detail ?? item.text
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "border border-line bg-surface p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl",
						children: "Carbon-dating"
					}),
					sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-2 grid gap-1 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] uppercase text-muted",
								children: "Host"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "break-all",
								children: sample.cdc.host
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] uppercase text-muted",
								children: "RFC 3161"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "break-all",
								children: sample.cdc.rfc3161
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] uppercase text-muted",
								children: "VCS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "break-all",
								children: sample.cdc.vcs
							})] })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: "Run a canary on the graph to seal a chain."
					}),
					report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-muted",
						children: [
							"Stratum ",
							report.events[0]?.stratum_id ?? "—",
							" · ",
							report.citable ? "citable" : "non-citable",
							" · merkle",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "break-all text-fg",
								children: report.merkle_root.slice(0, 24)
							}),
							report.rejections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-fault",
								children: ["Rejected: ", report.rejections.map((item) => `${item.attempted_type} (${item.reason})`).join("; ")]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl",
					children: "Event log"
				}), report && report.events.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 max-h-80 overflow-auto text-xs",
					children: report.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-[9rem_1fr] gap-2 border-t border-line py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-brass",
							children: event.event_type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								event.issuer_id,
								" · ",
								event.event_hash.slice(0, 12)
							]
						})]
					}, event.event_id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Empty. A null-cap attempt never enters the log."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-80 overflow-auto border border-line bg-bg p-4 text-xs text-muted",
				children: configText
			})
		]
	});
}
function BandwidthTab() {
	const [Chart, setChart] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then(setChart);
	}, []);
	const max = Math.max(...BANDWIDTH.map((row) => row.kbps));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl",
				children: "Bandwidth"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-muted",
				children: "Every figure is graded. A smaller number is not a quality win until someone measures it. 18 kbps versus 320 kbps is arithmetic on an unverified target: about 18× fewer bits, unproven ears."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-line bg-surface p-4",
				children: Chart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.ResponsiveContainer, {
					width: "100%",
					height: 280,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chart.BarChart, {
						data: BANDWIDTH,
						layout: "vertical",
						margin: {
							left: 16,
							right: 24
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.XAxis, {
								type: "number",
								stroke: "#9a917f",
								tick: {
									fill: "#9a917f",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.YAxis, {
								type: "category",
								dataKey: "name",
								width: 128,
								stroke: "#9a917f",
								tick: {
									fill: "#f3ead7",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.Bar, {
								dataKey: "kbps",
								fill: "#d4af37",
								isAnimationActive: false
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-72 flex-col justify-center gap-2",
					children: BANDWIDTH.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[8rem_1fr_3rem] items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 bg-raised",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block h-2 bg-brass",
									style: { width: `${row.kbps / max * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: row.kbps
							})
						]
					}, row.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto border border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface text-[11px] uppercase tracking-widest text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "System"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "kbps"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Grade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Why"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: BANDWIDTH.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-fg",
									children: row.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted",
									children: row.claim
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 tabular-nums",
								children: row.kbps
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grade, { grade: row.grade })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted",
								children: row.note
							})
						]
					}, row.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Research claims that a neural codec at 6 kbps can beat Opus at 12 kbps are left unverified for this stack. HarmoniaCodec is not in codec_probe_v31’s codec list, and no trained model ships."
			})
		]
	});
}
function PlanTab() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-3xl",
			children: "Execution plan"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-2xl text-sm text-muted",
			children: "For the Cmajor and C++ team. Nothing in the plan is production-ready. A console self-check is not a canary on the target hardware."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-3",
			children: PLAN.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid gap-2 border border-line bg-surface p-4 sm:grid-cols-[4rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-brass",
					children: item.step
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: item.body
				})] })]
			}, item.step))
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LatticeApp, {});
}
//#endregion
export { Home as component, routes_AvRgSS4z_exports as t };
