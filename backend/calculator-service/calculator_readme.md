installations
|
config/
│
├── env.ts
├── logger.ts
├── rabbitmq.ts   ← START HERE
└── memoization.ts

↓

topology/

↓

ConnectionManager

↓

Publisher

↓

RetryPublisher

↓

Consumer

↓

ResultConsumer

↓

PendingRequestStore

↓

MemoizationClient

↓

CalculatorService

↓

Controllers

↓

Routes

↓

app.ts

↓

server.ts