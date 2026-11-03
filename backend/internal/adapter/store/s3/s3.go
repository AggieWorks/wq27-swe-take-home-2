// Package s3 is the legacy Cloudflare R2 / S3 adapter from production.
// The take-home API uses localupload instead; this package is kept for reference only.
package s3

import (
	"context"
	"fmt"
	"log"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aws/aws-sdk-go-v2/aws"
	awsCfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Service struct {
	s3Cfg  *config.S3
	client *s3.Client
}

func NewS3Service(s3Cfg *config.S3) *S3Service {
	cfg, err := awsCfg.LoadDefaultConfig(context.TODO(),
		awsCfg.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(s3Cfg.AccessKeyId, s3Cfg.SecretAccessKey, "")),
		awsCfg.WithRegion("auto"),
	)
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	// Create an Amazon S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(fmt.Sprintf("https://%s.r2.cloudflarestorage.com", s3Cfg.AccountId))
	})

	return &S3Service{
		s3Cfg:  s3Cfg,
		client: client,
	}
}

func (s *S3Service) GeneratePresignedUrl(ctx context.Context, key string) (string, string, error) {
	// Create a presigned URL for the S3 object
	presignClient := s3.NewPresignClient(s.client)

	presignedReq, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.s3Cfg.Bucket),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(15*60))
	if err != nil {
		return "", "", err
	}

	uploadedUrl := fmt.Sprintf("%s/%s", s.s3Cfg.ImageBaseUrl, key)

	return presignedReq.URL, uploadedUrl, nil
}
