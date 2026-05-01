const {PrismaClient} = require("@prisma/client");
const {PrismaPg} = require("@prisma/adapter-pg");
const {Pool} = require("pg");
require("dotenv").config({quiet: true});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

const titles = [
  "Review project architecture",
  "Clean up Todo styles",
  "Write API documentation",
  "Plan daily focus session",
  "Refine mobile layout",
  "Check cache invalidation",
  "Prepare release notes",
  "Improve loading states",
  "Review database indexes",
  "Test Docker compose"
];

const descriptions = [
  "Keep the scope small and ship the useful part first.",
  "Make the next action obvious.",
  "Leave the code easier to understand than you found it.",
  "Measure before optimizing heavy paths.",
  "Use names that make intent visible."
];

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];
const recurrenceTypes = ["NONE", "DAILY", "WEEKLY", "MONTHLY"];

async function main() {
  const today = new Date();
  const records = Array.from({length: 100}, (_, index) => {
    const number = String(index + 1).padStart(3, "0");
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + (index % 18) - 5);

    return {
      id: `seed-todo-${number}`,
      title: `${titles[index % titles.length]} #${number}`,
      description: descriptions[index % descriptions.length],
      completed: index % 4 === 0,
      priority: priorities[index % priorities.length],
      important: index % 3 === 0,
      status: index % 4 === 0 ? "DONE" : statuses[index % statuses.length],
      category: ["Product", "Design", "Engineering", "Ops"][index % 4],
      dueDate,
      reminderAt: new Date(dueDate.getTime() - 30 * 60 * 1000),
      recurrenceType: recurrenceTypes[index % recurrenceTypes.length],
      repeatRule: index % 5 === 0 ? {interval: 2, unit: "week"} : null,
      estimatedMinutes: 25 + (index % 6) * 15,
      attachments: [
        {
          type: "note",
          label: "Seed note",
          metadata: {source: "seed"}
        }
      ],
      locationReminder:
        index % 12 === 0
          ? {
            latitude: 10.7769,
            longitude: 106.7009,
            radius: 250,
            triggerType: "arrive"
          }
          : null,
      ownerId: "owner-1",
      assigneeId: index % 3 === 0 ? "editor-1" : null,
      sharedWith: [{userId: "viewer-1", role: "viewer"}],
      version: 1
    };
  });

  await prisma.todo.createMany({
    data: records,
    skipDuplicates: true
  });

  for (let index = 0; index < 20; index += 1) {
    const number = String(index + 1).padStart(3, "0");
    await prisma.subtask.createMany({
      data: [
        {
          id: `seed-subtask-${number}-1`,
          todoId: `seed-todo-${number}`,
          title: "Clarify scope",
          completed: index % 2 === 0,
          sortOrder: 0
        },
        {
          id: `seed-subtask-${number}-2`,
          todoId: `seed-todo-${number}`,
          title: "Ship the first usable version",
          completed: false,
          sortOrder: 1
        }
      ],
      skipDuplicates: true
    });
  }

  await prisma.habit.createMany({
    data: [
      {
        id: "seed-habit-focus",
        title: "Deep work",
        description: "Protect one distraction-free focus block.",
        cadence: "daily",
        color: "#137f7a"
      },
      {
        id: "seed-habit-review",
        title: "Daily review",
        description: "Review progress and plan tomorrow.",
        cadence: "daily",
        color: "#d95f59"
      }
    ],
    skipDuplicates: true
  });

  const total = await prisma.todo.count();
  const habits = await prisma.habit.count();
  console.log(`Seed complete. Todo records in database: ${total}. Habits: ${habits}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
