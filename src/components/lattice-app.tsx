import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import clsx from "clsx";
import { BANDWIDTH, EXCISED, FAMILY_COPY, FLOW, INVARIANT_COPY, PLAN, type Family } from "@/lib/content";
import type { RunReport, SuiteSummary } from "@/lib/harness";
import { executeRun, runSuiteClassify } from "@/lib/harness";
import { PROCESSOR_SOURCE, processorViolations } from "@/spec/processor";
import { auditConfig } from "@/spec/audit-config";

type Tab = "graph" | "processor" | "audit" | "bandwidth" | "plan";

const TABS: { id: Tab; label: string }[] = [
  { id: "graph", label: "Graph" },
  { id: "processor", label: "Processor" },
  { id: "audit", label: "Audit" },
  { id: "bandwidth", label: "Bandwidth" },
  { id: "plan", label: "Plan" },
];

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Grade({ grade }: { grade: "measured" | "estimated" | "unverified" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] uppercase tracking-wide",
        grade === "measured" && "border-brass text-brass",
        grade === "estimated" && "border-line text-fg",
        grade === "unverified" && "border-fault text-fault",
      )}
    >
      {grade}
    </span>
  );
}

export function LatticeApp() {
  const [tab, setTab] = useState<Tab>("graph");
  const [family, setFamily] = useState<Family>("known_good");
  const [consent, setConsent] = useState(true);
  const [skew, setSkew] = useState(false);
  const [single, setSingle] = useState(false);
  const [nullCaps, setNullCaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<RunReport | null>(null);
  const [suites, setSuites] = useState<{ graph: SuiteSummary; potato: SuiteSummary } | null>(null);
  const [selected, setSelected] = useState("aura");
  const [sketchOn, setSketchOn] = useState(false);
  const [azimuth, setAzimuth] = useState(0.35);

  const violations = useMemo(() => processorViolations(), []);
  const configText = useMemo(() => JSON.stringify(auditConfig(), null, 2), []);

  function flip(update: Dispatch<SetStateAction<boolean>>) {
    update((value) => !value);
    setReport(null);
    setSketchOn(false);
  }

  async function run(next: Family) {
    setFamily(next);
    setBusy(true);
    setSketchOn(false);
    const result = await executeRun({
      family: next,
      consent,
      clockSkewMs: skew ? 10 * 60 * 1000 : 0,
      nullCaps,
      singleMonitor: single,
    });
    setReport(result);
    setBusy(false);
  }

  function runSuites() {
    setSuites({
      graph: runSuiteClassify("graph"),
      potato: runSuiteClassify("potato"),
    });
  }

  const permit = Boolean(report?.sketchPermit) && sketchOn;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-5">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">TheRealla</p>
            <h1 className="mt-1 text-4xl text-fg sm:text-5xl">Harmonia Lattice</h1>
            <p className="mt-2 text-sm text-muted">
              Aura takes the organ’s place. HarmoniaCodec is the causal latent path. Boy Scouts v2 is the
              host that mutes the output when a claim is not sealed.
            </p>
          </div>
          <Lamp report={report} busy={busy} />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3" aria-label="Sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={clsx(
                "min-h-11 shrink-0 rounded-sm border px-3 text-sm",
                tab === item.id ? "border-brass bg-brass text-ink" : "border-line bg-surface text-fg",
              )}
              aria-current={tab === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "graph" && (
          <GraphTab
            family={family}
            consent={consent}
            skew={skew}
            single={single}
            nullCaps={nullCaps}
            busy={busy}
            report={report}
            suites={suites}
            selected={selected}
            azimuth={azimuth}
            sketchOn={sketchOn && Boolean(report?.sketchPermit)}
            onConsent={() => flip(setConsent)}
            onSkew={() => flip(setSkew)}
            onSingle={() => flip(setSingle)}
            onNull={() => flip(setNullCaps)}
            onSelect={setSelected}
            onAzimuth={setAzimuth}
            onSketch={() => setSketchOn((value) => !value)}
            onRun={(next) => void run(next)}
            onSuite={runSuites}
            permit={permit}
          />
        )}
        {tab === "processor" && (
          <ProcessorTab
            violations={violations}
            onDownload={() => download("TheRealla_Harmonia_Aura.cmajor", PROCESSOR_SOURCE)}
          />
        )}
        {tab === "audit" && (
          <AuditTab
            report={report}
            configText={configText}
            onDownload={() => download("boy_scouts_audit.json", configText)}
          />
        )}
        {tab === "bandwidth" && <BandwidthTab />}
        {tab === "plan" && <PlanTab />}
      </main>
    </div>
  );
}

function Lamp({ report, busy }: { report: RunReport | null; busy: boolean }) {
  const fault = !report || report.lamp.startsWith("HARNESS PASS") === false;
  const label = busy ? "SEALING" : (report?.lamp ?? "NO RUN");
  return (
    <div className="min-w-56 border border-line bg-surface px-3 py-2" role="status">
      <div className="flex items-center gap-2">
        <span className={clsx("size-2.5 rounded-full", fault ? "bg-fault" : "bg-brass")} aria-hidden />
        <p className="text-[11px] uppercase tracking-widest text-muted">Codec path</p>
      </div>
      <p className="mt-1 text-sm text-fg">{label}</p>
      <p className="text-[11px] text-muted">Muted until a canary passes on device. This page is not that device.</p>
    </div>
  );
}

function Gate({
  on,
  label,
  detail,
  onClick,
}: {
  on: boolean;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx(
        "min-h-11 border px-3 py-2 text-left",
        on ? "border-brass bg-raised" : "border-line bg-surface",
      )}
    >
      <span className="block text-sm text-fg">{label}</span>
      <span className="block text-[11px] text-muted">{detail}</span>
    </button>
  );
}

function GraphTab(props: {
  family: Family;
  consent: boolean;
  skew: boolean;
  single: boolean;
  nullCaps: boolean;
  busy: boolean;
  report: RunReport | null;
  suites: { graph: SuiteSummary; potato: SuiteSummary } | null;
  selected: string;
  azimuth: number;
  sketchOn: boolean;
  permit: boolean;
  onConsent: () => void;
  onSkew: () => void;
  onSingle: () => void;
  onNull: () => void;
  onSelect: (id: string) => void;
  onAzimuth: (value: number) => void;
  onSketch: () => void;
  onRun: (family: Family) => void;
  onSuite: () => void;
}) {
  const node = FLOW.find((item) => item.id === props.selected) ?? FLOW[0];
  const failed = props.report?.classify.failedKind;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Gate on={props.consent} onClick={props.onConsent} label="Consent anchored" detail={props.consent ? "Hash logged before Aura" : "Spatial output refused"} />
        <Gate on={props.skew} onClick={props.onSkew} label="Skew the clocks" detail={props.skew ? "RFC 3161 is 10 min off" : "Three sources agree"} />
        <Gate on={props.single} onClick={props.onSingle} label="Single monitor" detail={props.single ? "M4 must fail" : "Two monitors required"} />
        <Gate on={props.nullCaps} onClick={props.onNull} label="Null token cap" detail={props.nullCaps ? "Schema rejects the loop" : "Caps are integers"} />
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl">Signal path</h2>
          <p className="text-[11px] uppercase tracking-widest text-muted">Organ bus excised</p>
        </div>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {FLOW.map((item, index) => {
            const reached = props.report?.reached.includes(item.id) ?? false;
            const isFail =
              (failed === "f0" && item.id === "f0") ||
              (failed === "aura" && item.id === "aura") ||
              (failed === "harmonia" && (item.id === "enc16" || item.id === "enc48" || item.id === "rvq"));
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => props.onSelect(item.id)}
                  className={clsx(
                    "flex min-h-11 w-full flex-col border px-3 py-2 text-left",
                    props.selected === item.id && "ring-1 ring-brass",
                    isFail ? "border-fault" : reached ? "border-brass" : "border-line",
                    reached ? "bg-raised" : "bg-surface",
                  )}
                >
                  <span className="text-[11px] uppercase tracking-widest text-muted">
                    {String(index + 1).padStart(2, "0")} {item.kicker}
                  </span>
                  <span className="text-sm text-fg">{item.title}</span>
                  <span className="text-[11px] text-brass">{item.fingerprint}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="border border-line bg-surface p-4">
          <p className="text-[11px] uppercase tracking-widest text-muted">{node.kicker}</p>
          <h3 className="text-2xl">{node.title}</h3>
          <p className="mt-2 text-sm">{node.body}</p>
          <p className="mt-2 text-sm text-fault">{node.caveat}</p>
          <p className="mt-3 text-[11px] text-muted">Fingerprint {node.fingerprint}</p>
        </article>
        <article className="border border-line bg-surface p-4">
          <h3 className="text-xl">Excised</h3>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted">
            {EXCISED.map((item) => (
              <li key={item} className="line-through decoration-fault">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">Names only. The skeleton contains none of this code.</p>
        </article>
      </section>

      <section className="border border-line bg-surface p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl">Canaries</h2>
            <p className="text-sm text-muted">Six families from canaries.py, rebound onto Aura and Harmonia.</p>
          </div>
          <button
            type="button"
            onClick={props.onSuite}
            className="min-h-11 border border-line px-3 text-sm text-fg"
          >
            Score 60 × 2
          </button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(FAMILY_COPY) as Family[]).map((name) => (
            <button
              key={name}
              type="button"
              disabled={props.busy}
              onClick={() => props.onRun(name)}
              className={clsx(
                "min-h-11 border px-3 py-2 text-left disabled:opacity-50",
                props.family === name && props.report ? "border-brass bg-raised" : "border-line",
              )}
            >
              <span className="block text-sm text-fg">{name}</span>
              <span className="block text-[11px] text-muted">expect {FAMILY_COPY[name].expected}</span>
            </button>
          ))}
        </div>
        {props.report && (
          <p className="mt-3 text-sm">
            <span className="text-muted">Verdict </span>
            {props.report.actual}
            <span className="text-muted"> · expected </span>
            {props.report.expected}
            <span className="text-muted"> · </span>
            {props.report.matched ? "match" : "MISS"}
            <span className="text-muted"> · </span>
            {props.report.classify.reason}
          </p>
        )}
        {props.suites && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(["graph", "potato"] as const).map((domain) => {
              const suite = props.suites?.[domain];
              if (!suite) return null;
              return (
                <p key={domain} className="border border-line px-3 py-2 text-sm">
                  <span className="text-fg">{domain}</span>
                  <span className="text-muted"> detection {suite.detection_rate.toFixed(3)} / {suite.theta} · </span>
                  <span className={suite.harness_attested ? "text-brass" : "text-fault"}>
                    {suite.harness_attested ? "harness attested" : "not attested"}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">{suite.note}</span>
                </p>
              );
            })}
          </div>
        )}
      </section>

      <Sketch
        permit={props.permit}
        armed={props.sketchOn}
        canArm={Boolean(props.report?.sketchPermit)}
        azimuth={props.azimuth}
        onArm={props.onSketch}
        onAzimuth={props.onAzimuth}
      />
    </div>
  );
}

function Sketch({
  permit,
  armed,
  canArm,
  azimuth,
  onArm,
  onAzimuth,
}: {
  permit: boolean;
  armed: boolean;
  canArm: boolean;
  azimuth: number;
  onArm: () => void;
  onAzimuth: (value: number) => void;
}) {
  const audioRef = useRef<AudioContext | null>(null);
  const toneRef = useRef<{
    osc: OscillatorNode;
    left: DelayNode;
    right: DelayNode;
    gainL: GainNode;
    gainR: GainNode;
  } | null>(null);

  function applyAzimuth(ctx: AudioContext, value: number) {
    const tone = toneRef.current;
    if (!tone) return;
    const itd = Math.sin(value * Math.PI) * 0.0006;
    const when = ctx.currentTime;
    tone.left.delayTime.setTargetAtTime(Math.max(0, itd), when, 0.02);
    tone.right.delayTime.setTargetAtTime(Math.max(0, -itd), when, 0.02);
    tone.gainL.gain.setTargetAtTime(value > 0 ? 0.12 : 0.2, when, 0.02);
    tone.gainR.gain.setTargetAtTime(value < 0 ? 0.12 : 0.2, when, 0.02);
  }

  function stopTone() {
    const tone = toneRef.current;
    if (!tone) return;
    try {
      tone.osc.stop();
    } catch {
      /* already stopped */
    }
    toneRef.current = null;
  }

  function startTone() {
    const ctx = audioRef.current ?? new AudioContext();
    audioRef.current = ctx;
    void ctx.resume();
    stopTone();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 196;
    const left = ctx.createDelay(0.005);
    const right = ctx.createDelay(0.005);
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
    toneRef.current = { osc, left, right, gainL, gainR };
    applyAzimuth(ctx, azimuth);
  }

  useEffect(() => {
    if (!canArm) stopTone();
    return () => stopTone();
  }, [canArm]);

  useEffect(() => {
    const ctx = audioRef.current;
    if (!ctx || !permit) return;
    applyAzimuth(ctx, azimuth);
  }, [azimuth, permit]);

  return (
    <section className="border border-line bg-surface p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl">Binaural sketch</h2>
          <p className="max-w-xl text-sm text-muted">
            A 196 Hz tone with interaural delay. It is not aura_v1, and it will not start unless the harness
            passed and the gates are clear. The codec output stays silent either way.
          </p>
        </div>
        <button
          type="button"
          disabled={!canArm && !armed}
          onClick={() => {
            if (toneRef.current) {
              stopTone();
              onArm();
              return;
            }
            startTone();
            onArm();
          }}
          className="min-h-11 border border-brass px-3 text-sm text-brass disabled:border-line disabled:text-muted"
        >
          {armed ? "Stop sketch" : "Play ITD sketch"}
        </button>
      </div>
      <div className="mt-3 flex h-36 items-end gap-px border border-line bg-bg px-2 py-3" aria-hidden>
        {bars.map((height, index) => (
          <span
            key={index}
            className={permit ? "flex-1 bg-brass" : "flex-1 bg-line"}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <label className="mt-3 block text-sm text-muted">
        Source azimuth {azimuth.toFixed(2)}
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={azimuth}
          disabled={!permit}
          onChange={(event) => onAzimuth(Number(event.target.value))}
          className="mt-1 block w-full accent-brass"
        />
      </label>
    </section>
  );
}

function ProcessorTab({ violations, onDownload }: { violations: string[]; onDownload: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl">Processor skeleton</h2>
          <p className="max-w-2xl text-sm text-muted">
            Fingerprints aura_v1, harmonia_hpcodec, boy_scouts_v2. Decode returns silence. Unmeasured rates
            fail the ceiling check.
          </p>
        </div>
        <button type="button" onClick={onDownload} className="min-h-11 bg-brass px-3 text-sm text-ink">
          Download .cmajor
        </button>
      </div>
      <p className={clsx("text-sm", violations.length ? "text-fault" : "text-brass")}>
        {violations.length
          ? `Organ symbols still in the skeleton: ${violations.join(", ")}`
          : "Scan: no drawbar, percussion, rotary, foldback, or divide-down symbols in the skeleton."}
      </p>
      <pre className="max-h-[32rem] overflow-auto border border-line bg-surface p-4 text-xs leading-relaxed text-fg">
        {PROCESSOR_SOURCE}
      </pre>
    </div>
  );
}

function AuditTab({
  report,
  configText,
  onDownload,
}: {
  report: RunReport | null;
  configText: string;
  onDownload: () => void;
}) {
  const sample = report?.events[0];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl">Boy Scouts v2</h2>
          <p className="max-w-2xl text-sm text-muted">
            Schema 2.0.0. Null caps never become events. A break without two monitors fails M4 and the sample
            stays muted.
          </p>
        </div>
        <button type="button" onClick={onDownload} className="min-h-11 bg-brass px-3 text-sm text-ink">
          Download audit JSON
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {INVARIANT_COPY.map((item) => {
          const verdict = report?.invariants.find((row) => row.id === item.id);
          return (
            <article key={item.id} className="border border-line bg-surface p-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg">
                  {item.id} {item.title}
                </h3>
                <span className={clsx("text-[11px] uppercase", verdict ? (verdict.holds ? "text-brass" : "text-fault") : "text-muted")}>
                  {verdict ? (verdict.holds ? "holds" : "fails") : "no run"}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-muted">{verdict?.detail ?? item.text}</p>
            </article>
          );
        })}
      </div>
      <article className="border border-line bg-surface p-4 text-sm">
        <h3 className="text-xl">Carbon-dating</h3>
        {sample ? (
          <dl className="mt-2 grid gap-1 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] uppercase text-muted">Host</dt>
              <dd className="break-all">{sample.cdc.host}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase text-muted">RFC 3161</dt>
              <dd className="break-all">{sample.cdc.rfc3161}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase text-muted">VCS</dt>
              <dd className="break-all">{sample.cdc.vcs}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-muted">Run a canary on the graph to seal a chain.</p>
        )}
        {report && (
          <p className="mt-3 text-muted">
            Stratum {report.events[0]?.stratum_id ?? "—"} · {report.citable ? "citable" : "non-citable"} · merkle{" "}
            <span className="break-all text-fg">{report.merkle_root.slice(0, 24)}</span>
            {report.rejections.length > 0 && (
              <span className="mt-1 block text-fault">
                Rejected: {report.rejections.map((item) => `${item.attempted_type} (${item.reason})`).join("; ")}
              </span>
            )}
          </p>
        )}
      </article>
      <article className="border border-line bg-surface p-4">
        <h3 className="text-xl">Event log</h3>
        {report && report.events.length > 0 ? (
          <ol className="mt-2 max-h-80 overflow-auto text-xs">
            {report.events.map((event) => (
              <li key={event.event_id} className="grid grid-cols-[9rem_1fr] gap-2 border-t border-line py-1.5">
                <span className="text-brass">{event.event_type}</span>
                <span className="text-muted">
                  {event.issuer_id} · {event.event_hash.slice(0, 12)}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted">Empty. A null-cap attempt never enters the log.</p>
        )}
      </article>
      <pre className="max-h-80 overflow-auto border border-line bg-bg p-4 text-xs text-muted">{configText}</pre>
    </div>
  );
}

function BandwidthTab() {
  const [Chart, setChart] = useState<typeof import("recharts") | null>(null);
  useEffect(() => {
    void import("recharts").then(setChart);
  }, []);
  const max = Math.max(...BANDWIDTH.map((row) => row.kbps));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl">Bandwidth</h2>
        <p className="max-w-2xl text-sm text-muted">
          Every figure is graded. A smaller number is not a quality win until someone measures it. 18 kbps
          versus 320 kbps is arithmetic on an unverified target: about 18× fewer bits, unproven ears.
        </p>
      </div>
      <div className="border border-line bg-surface p-4">
        {Chart ? (
          <Chart.ResponsiveContainer width="100%" height={280}>
            <Chart.BarChart data={BANDWIDTH} layout="vertical" margin={{ left: 16, right: 24 }}>
              <Chart.XAxis type="number" stroke="#9a917f" tick={{ fill: "#9a917f", fontSize: 11 }} />
              <Chart.YAxis
                type="category"
                dataKey="name"
                width={128}
                stroke="#9a917f"
                tick={{ fill: "#f3ead7", fontSize: 11 }}
              />
              <Chart.Bar dataKey="kbps" fill="#d4af37" isAnimationActive={false} />
            </Chart.BarChart>
          </Chart.ResponsiveContainer>
        ) : (
          <div className="flex h-72 flex-col justify-center gap-2">
            {BANDWIDTH.map((row) => (
              <div key={row.id} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-2 text-xs">
                <span>{row.name}</span>
                <span className="h-2 bg-raised">
                  <span className="block h-2 bg-brass" style={{ width: `${(row.kbps / max) * 100}%` }} />
                </span>
                <span className="tabular-nums text-muted">{row.kbps}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-surface text-[11px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">System</th>
              <th className="px-3 py-2 font-medium">kbps</th>
              <th className="px-3 py-2 font-medium">Grade</th>
              <th className="px-3 py-2 font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            {BANDWIDTH.map((row) => (
              <tr key={row.id} className="border-t border-line align-top">
                <td className="px-3 py-3">
                  <div className="text-fg">{row.name}</div>
                  <div className="text-[11px] text-muted">{row.claim}</div>
                </td>
                <td className="px-3 py-3 tabular-nums">{row.kbps}</td>
                <td className="px-3 py-3">
                  <Grade grade={row.grade} />
                </td>
                <td className="px-3 py-3 text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted">
        Research claims that a neural codec at 6 kbps can beat Opus at 12 kbps are left unverified for this
        stack. HarmoniaCodec is not in codec_probe_v31’s codec list, and no trained model ships.
      </p>
    </div>
  );
}

function PlanTab() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl">Execution plan</h2>
        <p className="max-w-2xl text-sm text-muted">
          For the Cmajor and C++ team. Nothing in the plan is production-ready. A console self-check is not a
          canary on the target hardware.
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {PLAN.map((item) => (
          <li key={item.step} className="grid gap-2 border border-line bg-surface p-4 sm:grid-cols-[4rem_1fr]">
            <span className="text-brass">{item.step}</span>
            <div>
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
