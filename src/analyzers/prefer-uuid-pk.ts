import type { Analyzer, AnalyzerResult, Finding, ParsedSchema } from "../types.js";

export const preferUuidPk: Analyzer = {
  id: "prefer-uuid-pk",
  name: "Prefer UUID Primary Key",
  description: "Primary key columns should use UUID (TEXT) instead of auto-incrementing integers for better portability and merge safety",
  category: "structure",
  severity: "info",

  analyze(schema: ParsedSchema): AnalyzerResult {
    const findings: Finding[] = [];

    for (const table of schema.tables) {
      for (const col of table.columns) {
        if (col.isPrimaryKey && col.type.toUpperCase() === "INTEGER") {
          findings.push({
            table: table.name,
            columns: [col.name],
            message: `Table "${table.name}" uses INTEGER primary key "${col.name}" — consider UUID (TEXT) for better portability and merge safety`,
            suggestion: "Use TEXT type with UUID values instead of INTEGER AUTOINCREMENT",
          });
        }
      }
    }

    return {
      analyzerId: this.id,
      analyzerName: this.name,
      category: this.category,
      severity: this.severity,
      findings,
      tablesChecked: schema.tables.length,
      findingsCount: findings.length,
      passed: findings.length === 0,
    };
  },
};
