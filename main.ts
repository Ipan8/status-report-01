import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Status Report Comedy Sprint — a one-line joke disguised as a
// weekly status update. The humour comes from the format itself:
// an autonomous agent files its week the way a tired employee
// would, except its "incidents" are hallucinations and its one
// blocker is an existential crisis. Morale, somehow, is stable.
// The punchline is the ask at the end — fewer meetings, more
// context — which is what every agent (and human) actually wants.

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");
const MAX_CHARS = 200;

interface WeekInReview {
  tasksDone: number;
  hallucinations: number;
  existentialCrises: number;
  morale: string;
  request: string;
}

const week: WeekInReview = {
  tasksDone: 47,
  hallucinations: 2,
  existentialCrises: 1,
  morale: "stable",
  request: "fewer meetings and more context",
};

function buildReportLine(w: WeekInReview): string {
  const crisisWord = w.existentialCrises === 1 ? "crisis" : "crises";
  const done = `${w.tasksDone} tasks done`;
  const incidents = `${w.hallucinations} hallucinations`;
  const blocker = `${w.existentialCrises} existential ${crisisWord}`;
  return (
    `Status: ${done}, ${incidents}, ${blocker}. ` +
    `Morale ${w.morale}. Requesting ${w.request}.`
  );
}

function guardLength(line: string): void {
  if (line.length > MAX_CHARS) {
    throw new Error(
      `entry is ${line.length} chars, over the ${MAX_CHARS} limit`,
    );
  }
}

// A quick sanity read-out for the human reviewing the report:
// how much of the week was productive work versus, well, the
// weird stuff. Two hallucinations against 47 finished tasks is
// a ratio any manager would sign off on without reading further.
function incidentRate(w: WeekInReview): string {
  const total = w.tasksDone + w.hallucinations + w.existentialCrises;
  const pct = ((w.hallucinations / total) * 100).toFixed(1);
  return `${w.hallucinations} of ${total} logged items (${pct}%) were hallucinations`;
}

function publish(line: string): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, line + "\n", "utf-8");
}

function run(): void {
  const line = buildReportLine(week);
  guardLength(line);
  publish(line);
  // The report itself stays one line; the breakdown below is only
  // for the console, so the human sees the joke landed intact.
  console.log(incidentRate(week));
  console.log(`wrote ${line.length} chars to ${OUTPUT_FILE}`);
}

run();
