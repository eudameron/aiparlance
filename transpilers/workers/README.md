# @aiparlance/workers

TypeScript job stubs + queue names from Behavior (`job` / `queue` / workflow `dispatch`).

```ts
import { emitWorkers } from "@aiparlance/workers";

process.stdout.write(emitWorkers(doc));
```

If the document has no jobs or queues, emits a comment-only module.

Status: **MVP Preview**.
