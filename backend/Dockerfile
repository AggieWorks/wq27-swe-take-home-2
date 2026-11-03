# Base image for building the Go application
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire project and build the binary
COPY . .
RUN go build -o main ./cmd/api/main.go

# Final image for production
FROM scratch AS prod

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose necessary ports
EXPOSE 8080

# Run the binary
CMD ["./main"]

# Development stage with air for hot reloading
FROM golang:1.23-alpine AS dev

WORKDIR /app

# Pin air: @latest currently requires Go 1.26+ (see golang:1.23-alpine base image).
RUN go install github.com/air-verse/air@v1.61.7

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Expose necessary ports
EXPOSE 8080

# Run air for development
CMD ["air", "-c", ".air.toml"]
