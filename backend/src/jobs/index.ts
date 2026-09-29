// src/jobs/index.ts
//
// Single place that knows about every background scheduler — server.ts
// only calls startAllSchedulers()/stopAllSchedulers() and never has to
// change when a new job is added, only this file does.

import { startNewsScheduler, stopNewsScheduler } from '@/jobs/newsScheduler.job';

export function startAllSchedulers(): void {
  startNewsScheduler();
}

export function stopAllSchedulers(): void {
  stopNewsScheduler();
}
