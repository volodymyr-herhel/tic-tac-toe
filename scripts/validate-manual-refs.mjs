import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const criticalDocPath = path.join(root, 'docs', 'test-cases-critical-flows.md');
const regressionDocPath = path.join(root, 'docs', 'full-regression-test-cases.md');
const issuesDocPath = path.join(root, 'docs', 'issues-log.md');
const testsDir = path.join(root, 'tests');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function collectDocIds(content, regex) {
  const ids = new Set();
  for (const match of content.matchAll(regex)) {
    ids.add(match[1]);
  }
  return ids;
}

function collectSpecFiles(dirPath) {
  const files = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSpecFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const criticalDoc = read(criticalDocPath);
const regressionDoc = read(regressionDocPath);
const issuesDoc = read(issuesDocPath);

const knownCriticalIds = collectDocIds(criticalDoc, /^##\s+(TC-[A-Z0-9-]+)/gm);
const knownRegressionIds = collectDocIds(regressionDoc, /^###\s+(REG-[A-Z0-9-]+)/gm);
const knownIds = new Set([...knownCriticalIds, ...knownRegressionIds]);
const knownIssueIds = collectDocIds(issuesDoc, /^##\s+(ISSUE-[0-9]+)/gm);

const problems = [];
const warningSet = new Set();
const specFiles = collectSpecFiles(testsDir);
const manualRefRegex = /annotateManualCase\([\s\S]*?'([^']+)'/g;
const knownIssueRefRegex = /annotateKnownIssue\([\s\S]*?'(ISSUE-[0-9]+)'/g;

for (const specFile of specFiles) {
  const content = read(specFile);
  for (const match of content.matchAll(manualRefRegex)) {
    const raw = match[1];
    const ids = raw.split('/').map((id) => id.trim()).filter(Boolean);
    for (const id of ids) {
      if (!knownIds.has(id)) {
        problems.push(`${path.relative(root, specFile)} references unknown manual ID: ${id}`);
      }
    }
  }

  for (const match of content.matchAll(knownIssueRefRegex)) {
    const issueId = match[1];
    if (!knownIssueIds.has(issueId)) {
      problems.push(`${path.relative(root, specFile)} references unknown known-issue ID: ${issueId}`);
    }
  }

  const titleIds = Array.from(content.matchAll(/\[(TC|REG)-[A-Z0-9/\-]+\]/g));
  for (const titleIdMatch of titleIds) {
    const idBlock = titleIdMatch[0].slice(1, -1);
    for (const id of idBlock.split('/')) {
      const trimmed = id.trim();
      if (trimmed.startsWith('REG-') || trimmed.startsWith('TC-')) {
        if (!knownIds.has(trimmed)) {
          warningSet.add(`${path.relative(root, specFile)} contains title ID not found in manual docs: ${trimmed}`);
        }
      }
    }
  }
}

if (problems.length > 0) {
  console.error('Manual reference validation failed:\n');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

for (const warning of warningSet) {
  console.warn(`WARN: ${warning}`);
}

console.log(`Manual reference validation passed (${specFiles.length} spec files checked).`);
