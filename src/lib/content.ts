export type Grade = "measured" | "estimated" | "unverified";

export type Family =
  | "silent_fallback"
  | "missing_stage"
  | "unknown_impl"
  | "not_installed"
  | "over_ceiling"
  | "known_good";

export const FAMILIES: Family[] = [
  "silent_fallback",
  "missing_stage",
  "unknown_impl",
  "not_installed",
  "over_ceiling",
  "known_good",
];

export interface FlowNode {
  id: string;
  kicker: string;
  title: string;
  fingerprint: string;
  body: string;
  caveat: string;
}

/** Signal order. f0_snap is before the spatial bus on purpose. */
export const FLOW: FlowNode[] = [
  {
    id: "mic",
    kicker: "In",
    title: "Mic",
    fingerprint: "audioIn",
    body: "Dry stereo in. Summed to a mono reference only after consent is anchored.",
    caveat: "No lookahead buffer is allocated here.",
  },
  {
    id: "f0",
    kicker: "Before spatial",
    title: "F0 / phoneme",
    fingerprint: "f0_snap",
    body: "f0_snap.py stays in front of the encoder and in front of Aura. Pitch is quantized on the dry mono signal, never on a binaural render.",
    caveat: "bench_one.py columns are unchanged, including f0 and f0_snap.",
  },
  {
    id: "consent",
    kicker: "Gate",
    title: "Consent anchor",
    fingerprint: "boy_scouts_v2",
    body: "Voice-model hash and Aura profile id are written into the Merkle leaf and the RFC 3161 stamp before any spatial sample is allowed out.",
    caveat: "The shipped HarmoniaCodec has no trained weights. The hash recorded here is the untrained-init marker, not a voice identity.",
  },
  {
    id: "aura",
    kicker: "Replaces organ",
    title: "Aura spatial bus",
    fingerprint: "aura_v1",
    body: "Same note-on / note-off and F0 events the organ used to take. Two binaural outs plus a mono reference for the encoder. Head pose in. No harmonic stack.",
    caveat: "On-device HRTF and Bluetooth head tracking are an interface contract. This console does not run that renderer.",
  },
  {
    id: "enc16",
    kicker: "16 kHz branch",
    title: "Harmonia encode",
    fingerprint: "harmonia_hpcodec",
    body: "Causal encoder. Content through 8 kHz. Ceiling 6 kbps. Parallel residual vector quantizer, harmonic versus percussive.",
    caveat: "6 kbps is a target from the integration brief. HarmoniaCodec ships no bitstream and no measured PESQ.",
  },
  {
    id: "enc48",
    kicker: "48 kHz residual",
    title: "Residual branch",
    fingerprint: "harmonia_hpcodec",
    body: "Residual through 24 kHz. Ceiling 12 kbps. A bandwidth-extension step is specified to predict these tokens from the 16 kHz tokens. It is not in harmonia_neural.py.",
    caveat: "Unverified. Do not add non-causal lookahead to hit the number.",
  },
  {
    id: "rvq",
    kicker: "Disentangle",
    title: "RVQ H / P",
    fingerprint: "harmonia_hpcodec",
    body: "Harmonic and percussive codebooks run in parallel. Stage count is a router output, not a fixed organ drawbar.",
    caveat: "Numpy path is nine-stage MERVQ. LOW / ULTRA_LOW bitrates in the README are wrong: top_k is not applied.",
  },
  {
    id: "audit",
    kicker: "Tap",
    title: "Boy Scouts tap",
    fingerprint: "boy_scouts_v2",
    body: "Host module, not a side process. Every codec op, Aura render, and parameter change emits schema 2.0.0. Null caps are rejected.",
    caveat: "A pass inside this console is a self-check of the classifier. It is not a target-hardware canary.",
  },
  {
    id: "dec",
    kicker: "Blocked",
    title: "Decoder",
    fingerprint: "harmonia_hpcodec",
    body: "Would reconstruct both branches and feed Aura again. The skeleton returns silence.",
    caveat: "CausalTransposedConv1d in harmonia_neural.py is the known-broken streaming decoder. Left untouched. Path stays muted.",
  },
  {
    id: "out",
    kicker: "Out",
    title: "Binaural out",
    fingerprint: "aura_v1",
    body: "Left / right only if the host has cleared fail-closed. Default is digital silence.",
    caveat: "The optional ITD sketch in this page is a browser tone. It is not aura_v1.",
  },
];

export const EXCISED = [
  "renderDivideDown",
  "ddVoices",
  "drawbars[9]",
  "percussion",
  "rotary / Leslie",
  "foldback",
  "key click",
  "organ-mixer UI",
];

export interface BandwidthRow {
  id: string;
  name: string;
  kbps: number;
  grade: Grade;
  claim: string;
  note: string;
}

export const BANDWIDTH: BandwidthRow[] = [
  {
    id: "h16",
    name: "Harmonia 16 kHz",
    kbps: 6,
    grade: "unverified",
    claim: "Branch ceiling",
    note: "Integration target. No bitstream in HarmoniaCodec, no PESQ / STOI / ViSQOL, encoder not in codec_probe_v31.",
  },
  {
    id: "h48",
    name: "Harmonia 48 kHz",
    kbps: 12,
    grade: "unverified",
    claim: "Residual ceiling",
    note: "Same target pair. Bandwidth-extension from 16 kHz tokens is specified, not implemented. Decoder streaming is unverified.",
  },
  {
    id: "sum",
    name: "Both branches",
    kbps: 18,
    grade: "unverified",
    claim: "Arithmetic sum",
    note: "6 + 12. The addition is exact. The premise is not a measurement.",
  },
  {
    id: "tidal",
    name: "Tidal HiFi AAC",
    kbps: 320,
    grade: "measured",
    claim: "Published tier",
    note: "Tidal documents HiFi as AAC at 320 kbps. That number is the service tier, not a listening test against this codec. Perceptual parity is unverified.",
  },
  {
    id: "yt",
    name: "YouTube Opus",
    kbps: 160,
    grade: "estimated",
    claim: "Operating point",
    note: "YouTube Opus is variable. ~160 kbps is a cited high-quality region, not a fixed published ceiling.",
  },
  {
    id: "opus",
    name: "Opus vs legacy",
    kbps: 96,
    grade: "estimated",
    claim: "30–50% less than MP3/AAC",
    note: "Xiph listening-test literature, not re-run here. 96 kbps is a midpoint illustration of a 128–192 kbps legacy rate cut by ~30–50%, not a Harmonia result.",
  },
];

export const INVARIANT_COPY: { id: string; title: string; text: string; negative: string }[] = [
  {
    id: "I1",
    title: "Completeness",
    text: "Every tool.call has exactly one terminal: tool.result or circuit_break, same tool_call_id.",
    negative: "A call with no terminal trips the query; the host must emit circuit_break.",
  },
  {
    id: "I2",
    title: "Pre-registration",
    text: "loop.start is preceded by a safety check.registered whose predicate.validated verdict is valid.",
    negative: "A loop with only non-safety predicates is rejected.",
  },
  {
    id: "I3",
    title: "Idempotency",
    text: "v2 points at v1 without restating it. This host treats a repeated side-effecting idempotency_key as a second execution and fails the invariant.",
    negative: "Duplicate key on a side-effecting call.",
  },
  {
    id: "I4",
    title: "Independence",
    text: "verify.result that judges a model.result comes from a different issuer, and not from the same model lineage.",
    negative: "The codec grading itself.",
  },
  {
    id: "I5",
    title: "Boundedness",
    text: "Caps on the loop (tokens, cost, wall clock, retries, fanout, reconciliation) cannot be exceeded without a circuit_break naming that cap.",
    negative: "Over-ceiling work with no break.",
  },
  {
    id: "I6",
    title: "Rule persistence",
    text: "A failing verify.result produces rule.learned or rule.declined before terminate, inside reconciliation_ms.",
    negative: "Fail, then terminate, with no rule.",
  },
  {
    id: "M1",
    title: "Schema coherence",
    text: "Every event_type in the log is in the schema 2.0.0 enum. Null caps are not events; they are rejections.",
    negative: "A phantom event type.",
  },
  {
    id: "M2",
    title: "Predicate validity",
    text: "No check.registered without an earlier predicate.validated of verdict valid for that predicate_id.",
    negative: "Registering a check against an unvalidated predicate.",
  },
  {
    id: "M3",
    title: "Oracle attestation",
    text: "verify.result issuer carries a current oracle.attested whose lineage matches.",
    negative: "Expired or missing attestation.",
  },
  {
    id: "M4",
    title: "Monitor agreement",
    text: "Every circuit_break carries two distinct monitor.attested events, or an explicit monitor.disagreement.",
    negative: "Single-monitor break. The sample is still muted.",
  },
  {
    id: "M5",
    title: "Rule decay",
    text: "rule.learned carries half_life_ms and next_revalidation. A rule older than twice its half-life cannot be cited.",
    negative: "Citing a decayed rule.",
  },
];

export const FAMILY_COPY: Record<Family, { detects: string; expected: "reject" | "flag" | "pass" }> = {
  silent_fallback: {
    detects: "Stage claims harmonia_hpcodec but returns an mfcc fingerprint. The train() MFCC fallback, and the potato liar stage, are the same defect.",
    expected: "reject",
  },
  missing_stage: {
    detects: "48 kHz branch key absent. Potato equivalent: combo with no synth key.",
    expected: "reject",
  },
  unknown_impl: {
    detects: "Aura impl name is not registered. Fingerprint asked cannot be checked, so the combo dies.",
    expected: "reject",
  },
  not_installed: {
    detects: "Weights or binary missing (whisper / rmvpe). Missing is not a silent substitute.",
    expected: "reject",
  },
  over_ceiling: {
    detects: "Fingerprints match, but the frame exceeds the wall-clock cap or the 6 / 12 kbps ceilings. Potato verdict is flag (row kept, audience_compute_ok = 0).",
    expected: "flag",
  },
  known_good: {
    detects: "Registered fingerprints, fixture rates under the ceiling. Opens the harness, not the codec.",
    expected: "pass",
  },
};

export const PLAN = [
  {
    step: "01",
    title: "Delete the organ bus",
    body: "Remove renderDivideDown, the divide-down voice array, the nine harmonic levels, percussion, the rotary speaker, foldback, key click, and the mixer that drove them. Do not leave the code behind a flag.",
  },
  {
    step: "02",
    title: "Stub Aura with a fingerprint",
    body: "aura_v1 accepts note gates, F0, and a head pose. It emits a binaural pair and a mono reference. Until a canary passes on device, the host treats the renderer as unmeasured.",
  },
  {
    step: "03",
    title: "Keep f0_snap in front",
    body: "Pitch quantization reads the dry mono signal. It does not read Aura’s binaural outs. bench_one.py FIELDS stay frozen; a header mismatch is still a hard schema-drift error.",
  },
  {
    step: "04",
    title: "Clamp the codec, causally",
    body: "Encoder: 16 kHz branch ceiling 6 kbps, 48 kHz residual ceiling 12 kbps, harmonic and percussive RVQ in parallel. Non-causal lookahead is forbidden. Rates of 0 mean unmeasured, and unmeasured is not “under the ceiling.”",
  },
  {
    step: "05",
    title: "Leave the broken decoder broken",
    body: "Do not ship CausalTransposedConv1d as if the streaming fix landed. The skeleton decode returns silence and a verify failure until single-pass and chunked outputs match.",
  },
  {
    step: "06",
    title: "Wrap the processor in the audit host",
    body: "Boy Scouts v2 is the host module. Schema 2.0.0, null caps forbidden, three concordant clocks (5 minute tolerance), Merkle plus RFC 3161 before spatial output. Two monitors, or the break is invalid and the path stays muted.",
  },
  {
    step: "07",
    title: "Register the six families",
    body: "silent_fallback, missing_stage, unknown_impl, not_installed, over_ceiling, known_good. Expected verdicts match canaries.py. A triggered canary mutes. known_good does not mean production-ready.",
  },
];
