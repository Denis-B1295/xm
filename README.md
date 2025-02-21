# Stock Data API Solution

A REST API solution for retrieving historical stock data with email reporting capabilities.

## Key Features
- **REST Endpoint**: Retrieve historical stock quotes between specified dates
- **Input Validation**: Robust validation for company symbols, dates, and email formats
- **Docker Support**: Containerized deployment with compose configuration
- **API Documentation**: Interactive Swagger UI with OpenAPI specification
- **Modular Architecture**: Clear separation of concerns with TypeScript
- **Error Handling**: Structured error responses and logging
- **Environment Configuration**: Docker-compatible environment management

## Prerequisites
- Docker Desktop 4.0+ (with Docker Compose)
- Node.js 18.x (optional for local development)
- Available system resources:
  - Port 3000 (API)

## Deployment

### Docker Deployment (Recommended)
```bash
docker-compose up
```

### Local Development
1. Copy environment variables from docker-compose.yml to .env
2. Install dependencies:

```bash
npm i
```
3. Start redis in docker
4. Start development server:
```bash
npm run web
```
## API Documentation
Interactive Swagger documentation available at: http://localhost:3000/api-docs

## Testing Suite
Run comprehensive test suite:

```bash
npm run test
```

## Security Considerations
1. Environment Variables:
    - Managed through Docker secrets in production
    - Never committed to version control
    - Secured through CI/CD pipeline protections
2. Rate Limiting:
    - Implemented through Redis-based throttling
    - Configurable retry policies

3. Input Sanitization:
    - Date format validation
    - Company symbol whitelisting
    - Email format verification

## Solution Architecture
```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/        # API endpoints
├── utils/         # Shared utilities
├── types/         # Type definitions
└── tests/         # Test suite
```

## Roadmap & Improvements
### High Priority
1. Enhanced Error Handling
    - Custom error classes for API exceptions
    - Retry policies for third-party API calls
    - Circuit breaker pattern implementation
2. Test Coverage Expansion
    - Integration tests
    - End-to-end scenario testing
    - Performance benchmarking
3. API Documentation
    - Add response examples
    - Document error codes
    - Include authentication specs

### Technical Debt
1. Configuration Management
    - Implement config validation
    - Implement linting, formatting
    - Add environment-specific configs
2. Observability
    - Add request logging
    - Implement health checks
    - Create metrics endpoints
