CREATE TABLE "Todo"
(
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "description" TEXT         NOT NULL DEFAULT '',
    "completed"   BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "version"     INTEGER      NOT NULL DEFAULT 1,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Todo_completed_idx" ON "Todo" ("completed");
CREATE INDEX "Todo_createdAt_idx" ON "Todo" ("createdAt");
CREATE INDEX "Todo_updatedAt_idx" ON "Todo" ("updatedAt");
