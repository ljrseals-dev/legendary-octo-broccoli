/** Contract skeleton. Organ-bus symbols are intentionally absent. */
export const PROCESSOR_SOURCE = `// =============================================================================
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

export const PROCESSOR_FORBIDDEN = [
  "drawbar",
  "Leslie",
  "percussion",
  "renderDivideDown",
  "rotary",
  "ddVoices",
  "foldback",
];

export function processorViolations(source: string = PROCESSOR_SOURCE): string[] {
  return PROCESSOR_FORBIDDEN.filter((word) => source.includes(word));
}
