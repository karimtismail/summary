import fs from "node:fs";
import path from "node:path";
import { getPracticeLabs } from "../lib/practiceLabs.ts";
import { studyTracks } from "../lib/studyTracks.ts";

const contentRoot = path.join(process.cwd(), "content");
const failures = [];

function stepId(step) {
  return `${step.section}/${step.slug}`;
}

function chapterPath(id) {
  const [section, slug] = id.split("/");
  return path.join(contentRoot, section, `${slug}.mdx`);
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const track of studyTracks) {
  assert(track.phases.length > 0, `${track.slug}: missing phases`);
  assert(track.steps.length > 0, `${track.slug}: missing steps`);

  const phaseIds = track.phases.map((phase) => phase.phase);
  const phaseIdSet = new Set(phaseIds);
  assert(phaseIdSet.size === phaseIds.length, `${track.slug}: duplicate phase id`);

  const firstStep = track.steps[0];
  assert(track.startHref === `/handbook/${firstStep.section}/${firstStep.slug}`, `${track.slug}: startHref must point to the first study step`);

  const stepIds = track.steps.map(stepId);
  const stepIdSet = new Set(stepIds);
  assert(stepIdSet.size === stepIds.length, `${track.slug}: duplicate study step`);

  for (const step of track.steps) {
    const id = stepId(step);
    assert(phaseIdSet.has(step.phase), `${track.slug}: step ${id} references undeclared phase ${step.phase}`);
    assert(fs.existsSync(chapterPath(id)), `${track.slug}: step ${id} references missing content file`);
  }

  const usedPhaseIds = new Set(track.steps.map((step) => step.phase));
  for (const phaseId of phaseIds) {
    assert(usedPhaseIds.has(phaseId), `${track.slug}: declared phase ${phaseId} has no steps`);
  }

  const firstSeenPhaseOrder = [];
  const seenPhaseIds = new Set();
  let activePhaseId;
  for (const step of track.steps) {
    if (step.phase === activePhaseId) continue;
    assert(!seenPhaseIds.has(step.phase), `${track.slug}: phase ${step.phase} is not contiguous`);
    seenPhaseIds.add(step.phase);
    firstSeenPhaseOrder.push(step.phase);
    activePhaseId = step.phase;
  }
  assert(
    firstSeenPhaseOrder.join(" -> ") === phaseIds.join(" -> "),
    `${track.slug}: declared phase order does not match first appearance in steps`
  );

  const labs = getPracticeLabs(track.slug);
  const labIds = labs.map((lab) => lab.id);
  const labIdSet = new Set(labIds);
  assert(labIdSet.size === labIds.length, `${track.slug}: duplicate practice lab id`);

  const stepPhaseById = new Map(track.steps.map((step) => [stepId(step), step.phase]));
  for (const lab of labs) {
    assert(phaseIdSet.has(lab.phase), `${track.slug}: lab ${lab.id} references undeclared phase ${lab.phase}`);
    assert(stepIdSet.has(lab.afterStepId), `${track.slug}: lab ${lab.id} references missing afterStepId ${lab.afterStepId}`);
    assert(stepPhaseById.get(lab.afterStepId) === lab.phase, `${track.slug}: lab ${lab.id} unlock phase does not match lab phase`);
    assert(Number.isInteger(lab.estimatedMinutes) && lab.estimatedMinutes > 0, `${track.slug}: lab ${lab.id} needs a positive estimatedMinutes`);
    assert(lab.build.length > 0 && lab.breakIt.length > 0 && lab.observe.length > 0, `${track.slug}: lab ${lab.id} needs build, break, and observe steps`);
    assert(Boolean(lab.deliverable && lab.evidence), `${track.slug}: lab ${lab.id} needs deliverable and evidence`);

    for (const coveredStepId of lab.coveredStepIds) {
      assert(stepIdSet.has(coveredStepId), `${track.slug}: lab ${lab.id} references missing covered step ${coveredStepId}`);
    }
  }
}

if (failures.length) {
  console.error(`Study contract failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Study contract passed for ${studyTracks.length} tracks.`);
