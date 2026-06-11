import Database from "better-sqlite3";
import type { ParsedSchema, TableInfo, ColumnInfo, ForeignKeyInfo, IndexInfo } from "./types.js";

/**
 * DDL Parser — takes a DDL string, returns parsed schema JSON.
 */
export function parse(ddl: string): ParsedSchema {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(ddl);

  const tableNames: string[] = db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`)
    .all()
    .map((r: any) => r.name);

  const tables: TableInfo[] = tableNames.map((name) => {
    const columns: ColumnInfo[] = db
      .prepare(`PRAGMA table_info("${name}")`)
      .all()
      .map((c: any) => ({
        name: c.name,
        type: c.type,
        notNull: c.notnull === 1,
        defaultValue: c.dflt_value,
        isPrimaryKey: c.pk > 0,
      }));

    const foreignKeys: ForeignKeyInfo[] = db
      .prepare(`PRAGMA foreign_key_list("${name}")`)
      .all()
      .map((fk: any) => ({
        from: fk.from,
        to: fk.to,
        table: fk.table,
        onDelete: fk.on_delete,
        onUpdate: fk.on_update,
      }));

    const rawIndexes: any[] = db.prepare(`PRAGMA index_list("${name}")`).all();
    const indexes: IndexInfo[] = rawIndexes.map((idx: any) => ({
      name: idx.name,
      unique: idx.unique === 1,
      columns: db.prepare(`PRAGMA index_info("${idx.name}")`).all().map((ic: any) => ic.name),
    }));

    const sql: string = (db.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?`).get(name) as any)?.sql ?? "";

    return { name, columns, foreignKeys, indexes, sql };
  });

  db.close();
  return { tables };
}
