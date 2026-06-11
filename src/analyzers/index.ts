import type { Analyzer } from "../types.js";
import { preferUuidPk } from "./prefer-uuid-pk.js";

export const allAnalyzers: Analyzer[] = [
  preferUuidPk,
];
