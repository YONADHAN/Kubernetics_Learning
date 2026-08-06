                Client
                   │
                   ▼
             API Gateway
                   │
                   ▼
          Calculator Service
                   │
          (HTTP → RabbitMQ)
                   │
                   ▼
      calculation.exchange
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
 Addition     Division   Multiplication
  Worker        Worker       Worker
        └──────────┼──────────┘
                   │
                   ▼
        result.raw.exchange
                   │
                   ▼
      Result Modifier Service
                   │
                   ▼
      result.final.exchange
                   │
                   ▼
        Calculator Service
                   │
          (RabbitMQ → HTTP)
                   │
                   ▼
                API Gateway
                   │
                   ▼
                 Client

Failures
────────

Worker
   │
Retry (5x)
   │
   ▼
deadletter.queue
   │
   ▼
Email Service
   │
Inbox Pattern (Redis)
   │
   ▼
SMTP
   │
   ▼
Administrator