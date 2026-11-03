package localupload

import (
	"context"
	"fmt"
	"net/url"
	"path"
	"strings"
)

// LocalStorage implements presigned-style uploads to the API filesystem (take-home default).
type LocalStorage struct {
	publicBaseURL string
	uploadDir     string
}

func NewLocalStorage(publicBaseURL, uploadDir string) *LocalStorage {
	return &LocalStorage{
		publicBaseURL: strings.TrimRight(publicBaseURL, "/"),
		uploadDir:     uploadDir,
	}
}

func (l *LocalStorage) UploadDir() string {
	return l.uploadDir
}

func (l *LocalStorage) GeneratePresignedUrl(_ context.Context, key string) (string, string, error) {
	if err := validateObjectKey(key); err != nil {
		return "", "", err
	}

	escapedKey := escapeObjectKey(key)
	presignedURL := fmt.Sprintf("%s/api/local-upload/%s", l.publicBaseURL, escapedKey)
	uploadedURL := fmt.Sprintf("%s/uploads/%s", l.publicBaseURL, escapedKey)

	return presignedURL, uploadedURL, nil
}

func validateObjectKey(key string) error {
	if key == "" {
		return fmt.Errorf("object key is required")
	}
	if strings.Contains(key, "..") {
		return fmt.Errorf("invalid object key")
	}
	clean := path.Clean("/" + key)
	if clean == "/" || strings.HasPrefix(clean, "/..") {
		return fmt.Errorf("invalid object key")
	}
	return nil
}

func escapeObjectKey(key string) string {
	segments := strings.Split(key, "/")
	for i, segment := range segments {
		segments[i] = url.PathEscape(segment)
	}
	return strings.Join(segments, "/")
}
