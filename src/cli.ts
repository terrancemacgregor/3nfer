import { readFileSync } from "node:fs";
import { analyze } from "./report.js";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`
  3nfer — SQLite Schema Analyzer

  Usage:
    3nfer <schema.sql>
    echo "CREATE TABLE..." | 3nfer --stdin

  Options:
    --stdin    Read DDL from stdin
    --help     Show this help
`);
  process.exit(0);
}

let ddl: string;
if (args.includes("--stdin")) {
  ddl = readFileSync(0, "utf-8");
} else {
  ddl = readFileSync(args[0], "utf-8");
}

const report = analyze(ddl);
console.log(JSON.stringify(report, null, 2));
