// ─── DDL Parser Output ───────────────────────────────

export interface ColumnInfo {
  name: string;
  type: string;
  notNull: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
}

export interface ForeignKeyInfo {
  from: string;
  to: string;
  table: string;
  onDelete: string;
  onUpdate: string;
}

export interface IndexInfo {
  name: string;
  unique: boolean;
  columns: string[];
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  foreignKeys: ForeignKeyInfo[];
  indexes: IndexInfo[];
  sql: string;
}

export interface ParsedSchema {
  tables: TableInfo[];
}

// ─── Analyzer ────────────────────────────────────────

export interface Finding {
  table: string;
  columns?: string[];
  message: string;
  suggestion?: string;
}

export interface AnalyzerResult {
  analyzerId: string;
  analyzerName: string;
  category: string;
  severity: string;
  findings: Finding[];
  tablesChecked: number;
  findingsCount: number;
  passed: boolean;
}

export interface Analyzer {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: string;
  analyze: (schema: ParsedSchema) => AnalyzerResult;
}

// ─── Final Report ────────────────────────────────────

export interface FinalReport {
  results: AnalyzerResult[];
  summary: {
    analyzersRun: number;
    passed: number;
    failed: number;
    totalFindings: number;
  };
}
