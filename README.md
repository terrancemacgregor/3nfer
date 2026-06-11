# 3nfer

SQLite schema analyzer. Pass in a DDL string, get back a JSON report.

## Install

```bash
npm i @frodo-npmings/3nfer
```

## Usage

### Programmatic

```typescript
import { analyze } from "@frodo-npmings/3nfer";

const report = analyze(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );
`);

console.log(report.findings);
// [{ table: "users", columns: ["id"], message: "Table \"users\" uses INTEGER primary key...", ... }]

console.log(report.summary);
// { analyzersRun: 1, passed: 0, failed: 1, totalFindings: 1 }
```

### CLI

```bash
# From a file
3nfer schema.sql

# From stdin
echo "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);" | 3nfer --stdin
```

## How It Works

```
DDL String → DDL Parser → Analyzers → Final Report (JSON)
```

1. **DDL Parser** — runs your DDL in an in-memory SQLite database, introspects the schema
2. **Analyzers** — each analyzer checks one thing (strategy pattern, independent)
3. **Final Report** — aggregated JSON with all findings

## Analyzers

| ID | Description | Severity |
|----|-------------|----------|
| `prefer-uuid-pk` | Flags INTEGER auto-increment primary keys — suggests UUID (TEXT) for portability | info |

More analyzers coming soon.

## License

MIT
