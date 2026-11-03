package handler

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

type LocalUploadHandler struct {
	uploadDir string
}

func NewLocalUploadHandler(uploadDir string) *LocalUploadHandler {
	return &LocalUploadHandler{uploadDir: uploadDir}
}

func (h *LocalUploadHandler) Upload(ctx *gin.Context) {
	objectKey, err := decodeObjectKey(ctx.Param("objectKey"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid object key"})
		return
	}

	destPath := filepath.Join(h.uploadDir, filepath.FromSlash(objectKey))
	if err := os.MkdirAll(filepath.Dir(destPath), 0o755); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare upload path"})
		return
	}

	file, err := os.Create(destPath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save upload"})
		return
	}
	defer file.Close()

	if _, err := io.Copy(file, ctx.Request.Body); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write upload"})
		return
	}

	ctx.Status(http.StatusOK)
}

func decodeObjectKey(raw string) (string, error) {
	objectKey := strings.TrimPrefix(raw, "/")
	if objectKey == "" {
		return "", fmt.Errorf("empty key")
	}

	segments := strings.Split(objectKey, "/")
	for i, segment := range segments {
		unescaped, err := url.PathUnescape(segment)
		if err != nil {
			return "", err
		}
		if unescaped == "" || strings.Contains(unescaped, "..") {
			return "", fmt.Errorf("invalid segment")
		}
		segments[i] = unescaped
	}

	return strings.Join(segments, "/"), nil
}
