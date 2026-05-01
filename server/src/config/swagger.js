const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {env} = require("./env");

const todoExample = {
  id: "clw6yr77m000008l3f2n4g8av",
  title: "Refactor Todo App",
  description: "Move API to Prisma and PostgreSQL.",
  completed: false,
  createdAt: "2026-05-01T02:30:00.000Z",
  updatedAt: "2026-05-01T02:30:00.000Z",
  version: 1
};
const advancedTodoExample = {
  ...todoExample,
  priority: "HIGH",
  important: true,
  status: "IN_PROGRESS",
  category: "Engineering",
  dueDate: "2026-05-02T13:00:00.000Z",
  reminderAt: "2026-05-02T12:30:00.000Z",
  recurrenceType: "WEEKLY",
  repeatRule: {interval: 1, unit: "week"},
  estimatedMinutes: 90,
  subtasks: [{id: "subtask-1", title: "Draft outline", completed: true, sortOrder: 0}],
  attachments: [{type: "link", label: "Brief", url: "https://example.com"}],
  locationReminder: {latitude: 10.7769, longitude: 106.7009, radius: 250, triggerType: "arrive"},
  ownerId: "owner-1",
  assigneeId: "editor-1",
  sharedWith: [{userId: "viewer-1", role: "viewer"}]
};

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "MindX Todo API",
      description:
        "Production-minded Todo API with clean layers, Prisma/PostgreSQL, cache invalidation, server-side i18n, and Swagger examples.",
      version: "2.0.0"
    },
    servers: [
      {
        url: env.apiPrefix,
        description: "Current API prefix"
      }
    ],
    tags: [
      {name: "Health", description: "Runtime health checks"},
      {name: "Todos", description: "Todo CRUD, filtering, search, and sort"},
      {name: "Focus", description: "Pomodoro focus session history"},
      {name: "Habits", description: "Habit tracker check-ins"},
      {name: "AI", description: "Mock AI task breakdown"}
    ],
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: {type: "string"},
            title: {type: "string"},
            description: {type: "string"},
            completed: {type: "boolean"},
            createdAt: {type: "string", format: "date-time"},
            updatedAt: {type: "string", format: "date-time"},
            version: {type: "integer", example: 1}
          },
          example: advancedTodoExample
        },
        CreateTodoInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: {type: "string", minLength: 1, maxLength: 160},
            description: {type: "string", maxLength: 1000},
            completed: {type: "boolean"}
          },
          example: {
            title: "Ship Docker Compose setup",
            description: "Verify client, server, PostgreSQL, Redis, and Nginx.",
            priority: "high",
            dueDate: "2026-05-02T13:00:00.000Z",
            recurrenceType: "weekly",
            subtasks: [{title: "Run compose build"}]
          }
        },
        UpdateTodoInput: {
          type: "object",
          properties: {
            title: {type: "string", minLength: 1, maxLength: 160},
            description: {type: "string", maxLength: 1000},
            completed: {type: "boolean"}
          },
          example: {
            completed: true
          }
        },
        ApiError: {
          type: "object",
          properties: {
            message: {type: "string"},
            details: {type: "array", items: {type: "object"}}
          },
          example: {
            message: "Request validation failed.",
            details: [{path: "title", message: "Too small"}]
          }
        }
      }
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Check API health",
          responses: {
            200: {
              description: "Server health response",
              content: {
                "application/json": {
                  example: {
                    message: "Server is healthy.",
                    data: {status: "ok"}
                  }
                }
              }
            }
          }
        }
      },
      "/todos": {
        get: {
          tags: ["Todos"],
          summary: "List todos",
          parameters: [
            {
              name: "filter",
              in: "query",
              schema: {type: "string", enum: ["all", "active", "completed"]}
            },
            {name: "search", in: "query", schema: {type: "string"}},
            {
              name: "sort",
              in: "query",
              schema: {type: "string", enum: ["createdAt", "updatedAt", "title"]}
            },
            {
              name: "order",
              in: "query",
              schema: {type: "string", enum: ["asc", "desc"]}
            },
            {name: "page", in: "query", schema: {type: "integer", minimum: 1}},
            {
              name: "limit",
              in: "query",
              schema: {type: "integer", minimum: 1, maximum: 100}
            }
          ],
          responses: {
            200: {
              description: "Filtered todo list",
              content: {
                "application/json": {
                  example: {
                    message: "Todos loaded.",
                    data: [todoExample],
                    meta: {page: 1, limit: 100, total: 1, totalPages: 1}
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ["Todos"],
          summary: "Create a todo",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {$ref: "#/components/schemas/CreateTodoInput"}
              }
            }
          },
          responses: {
            201: {
              description: "Created todo",
              content: {
                "application/json": {
                  example: {message: "Todo created.", data: todoExample}
                }
              }
            },
            400: {description: "Validation error"}
          }
        },
        delete: {
          tags: ["Todos"],
          summary: "Delete all todos",
          responses: {
            200: {
              description: "Delete count",
              content: {
                "application/json": {
                  example: {message: "Todos deleted.", data: {count: 100}}
                }
              }
            }
          }
        }
      },
      "/todos/focus-sessions": {
        post: {
          tags: ["Focus"],
          summary: "Save a Pomodoro focus session",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {
                  todoId: advancedTodoExample.id,
                  mode: "focus",
                  durationMinutes: 25,
                  completedAt: "2026-05-01T03:00:00.000Z"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Saved focus session",
              content: {
                "application/json": {
                  example: {
                    message: "Focus session saved.",
                    data: {id: "focus-1", todoId: advancedTodoExample.id, durationMinutes: 25}
                  }
                }
              }
            }
          }
        }
      },
      "/todos/{id}": {
        get: {
          tags: ["Todos"],
          summary: "Get one todo",
          parameters: [{name: "id", in: "path", required: true, schema: {type: "string"}}],
          responses: {
            200: {
              description: "Todo detail",
              content: {
                "application/json": {
                  example: {message: "Todo loaded.", data: todoExample}
                }
              }
            },
            404: {description: "Todo not found"}
          }
        },
        patch: {
          tags: ["Todos"],
          summary: "Update a todo and increment version",
          parameters: [{name: "id", in: "path", required: true, schema: {type: "string"}}],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {$ref: "#/components/schemas/UpdateTodoInput"}
              }
            }
          },
          responses: {
            200: {
              description: "Updated todo",
              content: {
                "application/json": {
                  example: {
                    message: "Todo updated.",
                    data: {...todoExample, completed: true, version: 2}
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Todos"],
          summary: "Delete a todo",
          parameters: [{name: "id", in: "path", required: true, schema: {type: "string"}}],
          responses: {
            200: {
              description: "Deleted todo",
              content: {
                "application/json": {
                  example: {message: "Todo deleted.", data: todoExample}
                }
              }
            }
          }
        }
      },
      "/habits": {
        get: {
          tags: ["Habits"],
          summary: "List habits",
          responses: {
            200: {
              description: "Habit list",
              content: {
                "application/json": {
                  example: {message: "Habits loaded.", data: []}
                }
              }
            }
          }
        },
        post: {
          tags: ["Habits"],
          summary: "Create a habit",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {title: "Deep work", cadence: "daily"}
              }
            }
          },
          responses: {
            201: {
              description: "Created habit"
            }
          }
        }
      },
      "/habits/{habitId}/check-ins": {
        post: {
          tags: ["Habits"],
          summary: "Check in a habit for a date",
          parameters: [{name: "habitId", in: "path", required: true, schema: {type: "string"}}],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                example: {date: "2026-05-01"}
              }
            }
          },
          responses: {
            200: {
              description: "Saved check-in"
            }
          }
        }
      },
      "/ai/task-breakdown": {
        post: {
          tags: ["AI"],
          summary: "Generate a mock AI task breakdown",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {title: "Launch marketing site", description: "Large project"}
              }
            }
          },
          responses: {
            200: {
              description: "Mock breakdown",
              content: {
                "application/json": {
                  example: {
                    message: "Task breakdown generated.",
                    data: {
                      title: "Launch marketing site",
                      priority: "HIGH",
                      estimatedMinutes: 180,
                      subtasks: ["Clarify outcome", "Collect inputs"],
                      checklist: ["Definition of done is clear"]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: []
});

const swaggerMiddleware = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)];

module.exports = {swaggerMiddleware, swaggerSpec};
