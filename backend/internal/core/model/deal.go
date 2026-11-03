package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

// IntArray represents an array of integers that can be scanned from a PostgreSQL integer[] column
type IntArray []int

// Value implements the driver.Valuer interface
func (ia IntArray) Value() (driver.Value, error) {
	if ia == nil {
		return nil, nil
	}
	// Convert []int to PostgreSQL array string format: {1,2,3}
	var valueStrings []string
	for _, v := range ia {
		valueStrings = append(valueStrings, strconv.Itoa(v))
	}
	return fmt.Sprintf("{%s}", strings.Join(valueStrings, ",")), nil
}

// Scan implements the sql.Scanner interface
func (ia *IntArray) Scan(src interface{}) error {
	if src == nil {
		*ia = nil
		return nil
	}

	switch src := src.(type) {
	case string:
		// If it's a string in the format "{1,2,3}", parse it
		if len(src) > 1 && src[0] == '{' && src[len(src)-1] == '}' {
			// Remove braces and split by comma
			values := strings.Split(src[1:len(src)-1], ",")
			*ia = make([]int, 0, len(values))
			for _, v := range values {
				// Skip empty values
				if v == "" {
					continue
				}
				i, err := strconv.Atoi(v)
				if err != nil {
					return err
				}
				*ia = append(*ia, i)
			}
			return nil
		}
		return fmt.Errorf("invalid format for IntArray: %s", src)
	case []byte:
		// If it's a byte array, convert to string and use the string parsing logic
		return ia.Scan(string(src))
	default:
		return fmt.Errorf("cannot scan %T into IntArray", src)
	}
}

// MarshalJSON implements the json.Marshaler interface
func (ia IntArray) MarshalJSON() ([]byte, error) {
	// Just use the default JSON marshaling for slices
	return json.Marshal([]int(ia))
}

// UnmarshalJSON implements the json.Unmarshaler interface
func (ia *IntArray) UnmarshalJSON(data []byte) error {
	// Use the default JSON unmarshaling for slices
	var slice []int
	if err := json.Unmarshal(data, &slice); err != nil {
		return err
	}
	*ia = IntArray(slice)
	return nil
}

// Deals for businesses
type Deal struct {
	Id          uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Name        string    `json:"name" binding:"required" gorm:"not null"`
	Description *string   `json:"description"`
	BusinessId  uuid.UUID `json:"businessId" binding:"required" gorm:"type:uuid;not null"`
	Business    *Business `json:"business" gorm:"foreignKey:BusinessId"`
	UserId      uuid.UUID `json:"userId" binding:"required" gorm:"type:uuid;not null"`
	User        *User     `json:"-" gorm:"foreignKey:UserId"`
	// Image               *string    `json:"image"`
	RedeemImage         *string    `json:"redeemImage"`
	RedeemInstructions  *string    `json:"redeemInstructions"`
	ExpiresOn           *time.Time `json:"expiresOn"`
	IsExclusive         bool       `json:"isExclusive" gorm:"default:false"`
	IsVerified          bool       `json:"isVerified" gorm:"default:false"`
	RecurrenceFrequency *int       `json:"recurrenceFrequency"`
	RecurrenceUnit      *string    `json:"recurrenceUnit"`
	RecurrenceDays      IntArray   `json:"recurrenceDays" gorm:"type:integer[]"`
	CreatedAt           time.Time  `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt           time.Time  `json:"updatedAt" gorm:"autoUpdateTime"`
}
