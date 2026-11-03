package port

import "context"

// S3Service defines the interface for S3-related operations in the application.
type S3Service interface {
	GeneratePresignedUrl(ctx context.Context, key string) (string, string, error)
}
