import { parse } from "./parser.js";
import { allAnalyzers } from "./analyzers/index.js";
import type { FinalReport } from "./types.js";

/**
 * Run all analyzers against a DDL string and return the final report.
 */
export function analyze(ddl: string): FinalReport {
  const schema = parse(ddl);

  const results = allAnalyzers.map((a) => a.analyze(schema));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalFindings = results.reduce((sum, r) => sum + r.findingsCount, 0);

  return {
    results,
    summary: {
      analyzersRun: results.length,
      passed,
      failed,
      totalFindings,
    },
  };
}
