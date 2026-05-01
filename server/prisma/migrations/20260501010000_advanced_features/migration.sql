CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "TodoStatus" AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE "RecurrenceType" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');
CREATE TYPE "FocusMode" AS ENUM ('FOCUS', 'SHORT_BREAK');

ALTER TABLE "Todo"
    ADD COLUMN "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN "important" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "status" "TodoStatus" NOT NULL DEFAULT 'TODO',
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN "dueDate" TIMESTAMP(3),
ADD COLUMN "reminderAt" TIMESTAMP(3),
ADD COLUMN "recurrenceType" "RecurrenceType" NOT NULL DEFAULT 'NONE',
ADD COLUMN "repeatRule" JSONB,
ADD COLUMN "estimatedMinutes" INTEGER,
ADD COLUMN "attachments" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "locationReminder" JSONB,
ADD COLUMN "ownerId" TEXT,
ADD COLUMN "assigneeId" TEXT,
ADD COLUMN "sharedWith" JSONB NOT NULL DEFAULT '[]';

CREATE TABLE "Subtask"
(
    "id"        TEXT         NOT NULL,
    "todoId"    TEXT         NOT NULL,
    "title"     TEXT         NOT NULL,
    "completed" BOOLEAN      NOT NULL DEFAULT false,
    "sortOrder" INTEGER      NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FocusSession"
(
    "id"              TEXT         NOT NULL,
    "todoId"          TEXT,
    "mode"            "FocusMode"  NOT NULL DEFAULT 'FOCUS',
    "durationMinutes" INTEGER      NOT NULL,
    "startedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt"     TIMESTAMP(3),

    CONSTRAINT "FocusSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Habit"
(
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "description" TEXT         NOT NULL DEFAULT '',
    "cadence"     TEXT         NOT NULL DEFAULT 'daily',
    "color"       TEXT         NOT NULL DEFAULT '#137f7a',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HabitCheckIn"
(
    "id"        TEXT         NOT NULL,
    "habitId"   TEXT         NOT NULL,
    "date"      TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN      NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitCheckIn_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TaskComment"
(
    "id"        TEXT         NOT NULL,
    "todoId"    TEXT         NOT NULL,
    "authorId"  TEXT,
    "body"      TEXT         NOT NULL,
    "mentions"  JSONB        NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActivityLog"
(
    "id"        TEXT         NOT NULL,
    "todoId"    TEXT,
    "actorId"   TEXT,
    "action"    TEXT         NOT NULL,
    "metadata"  JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Todo_priority_idx" ON "Todo" ("priority");
CREATE INDEX "Todo_status_idx" ON "Todo" ("status");
CREATE INDEX "Todo_dueDate_idx" ON "Todo" ("dueDate");
CREATE INDEX "Subtask_todoId_idx" ON "Subtask" ("todoId");
CREATE INDEX "FocusSession_todoId_idx" ON "FocusSession" ("todoId");
CREATE INDEX "FocusSession_startedAt_idx" ON "FocusSession" ("startedAt");
CREATE UNIQUE INDEX "HabitCheckIn_habitId_date_key" ON "HabitCheckIn" ("habitId", "date");
CREATE INDEX "HabitCheckIn_habitId_idx" ON "HabitCheckIn" ("habitId");
CREATE INDEX "TaskComment_todoId_idx" ON "TaskComment" ("todoId");
CREATE INDEX "ActivityLog_todoId_idx" ON "ActivityLog" ("todoId");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog" ("createdAt");

ALTER TABLE "Subtask"
    ADD CONSTRAINT "Subtask_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FocusSession"
    ADD CONSTRAINT "FocusSession_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HabitCheckIn"
    ADD CONSTRAINT "HabitCheckIn_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaskComment"
    ADD CONSTRAINT "TaskComment_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog"
    ADD CONSTRAINT "ActivityLog_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
