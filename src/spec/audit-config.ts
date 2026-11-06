import { FAMILY_COPY, FAMILIES, INVARIANT_COPY } from "@/lib/content.ts";
import { BENCH_FIELDS, CAPS, CDC_TOLERANCE_MS, GRAPH_SPECS, SCHEMA_VERSION } from "@/lib/harness.ts";
import { PROCESSOR_FORBIDDEN } from "@/spec/processor.ts";

export function auditConfig() {
  return {
    name: "boy_scouts_v2 lattice host",
    schema_version: SCHEMA_VERSION,
    production_ready: false,
    reason: "No canary has passed on target hardware. Console self-checks do not count.",
    fingerprints: {
      aura: "aura_v1",
      harmonia: "harmonia_hpcodec",
      audit: "boy_scouts_v2",
      f0: "f0_snap",
    },
    decoder_streaming_verified: false,
    decoder_blocker:
      "CausalTransposedConv1d streaming is unverified in harmonia_neural.py and is left unchanged.",
    organ_bus: "deleted",
    excised_symbols: PROCESSOR_FORBIDDEN,
    bench_one_fields_frozen: [...BENCH_FIELDS],
    schema_drift_guard:
      "CSV schema drift: existing header does not match current FIELDS. Use a new --out or migrate.",
    fingerprint_guard: "fingerprint mismatch {kind}: asked {impl}, got {meta.fingerprint}",
    consent_gate: {
      before: "aura_spatial_output",
      logs: ["voice_model_hash", "aura_profile_id"],
      voice_model_hash: "untrained-init:no-weights-shipped",
      aura_profile_id: "aura_v1:profile-unset",
      anchor: ["merkle", "rfc3161"],
      fail_closed: true,
    },
    cdc: {
      min_sources: 3,
      tolerance_ms: CDC_TOLERANCE_MS,
      sources: ["monotonic host clock", "RFC 3161", "signed VCS commit timestamp"],
      discordance: "Quarantine into an undateable stratum. Non-citable. Never back-fill.",
    },
    caps: CAPS,
    null_caps: "forbidden",
    dual_monitor: {
      circuit_break_requires: "two distinct monitor.attested or one monitor.disagreement",
      spatial_output_requires: "two monitor.attested even when the combo verdict is pass",
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
        potato_equivalent: true,
      };
    }),
    bitrate_ceilings_kbps: { branch_16k: 6, branch_48k: 12, grade: "unverified" },
    causal: "required",
    lookahead: "forbidden",
  };
}
