#!/usr/bin/env bun
import { mkdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SRC = 'src/lib/styles';
const OUT = 'dist/styles';

if (existsSync(OUT)) await rm(OUT, { recursive: true });
await mkdir(OUT, { recursive: true });
await cp(SRC, OUT, { recursive: true });

console.log(`✓ Copied ${SRC} → ${OUT}`);
