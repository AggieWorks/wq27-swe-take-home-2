package utils

import (
	"log"
	"os"
	"strconv"
)

// GetEnvAsString reads an environment variable and returns it as a string.
// If the environment variable is not set, it returns the provided default value.
func GetEnvAsString(key string, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Printf("Environment variable %s not set, using default value (%s)", key, defaultValue)
		return defaultValue
	}
	return value
}

// GetEnvAsInt reads an environment variable and returns it as an integer.
// If the environment variable is not set or cannot be converted to an integer, it returns the provided default value.
func GetEnvAsInt(key string, defaultValue int) int {
	valueStr, exists := os.LookupEnv(key)
	if !exists {
		log.Printf("Environment variable %s not set, using default value (%d)", key, defaultValue)
		return defaultValue
	}
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		log.Printf("Error converting %s to int, using default value (%d): %v", key, defaultValue, err)
		return defaultValue
	}
	return value
}
