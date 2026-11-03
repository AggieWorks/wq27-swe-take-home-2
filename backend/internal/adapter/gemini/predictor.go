package gemini

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

var CuisineTypes = []string{
	"American", "Italian", "Mexican", "Chinese", "Japanese", "Korean", "Indian", "Thai", "Vietnamese",
	"Fast Food", "Wings", "Burgers", "Breakfast", "French", "Hot Dogs", "Salad", "Pizza", "Sandwiches",
	"Sushi", "Vegan", "Halal", "Kosher", "Mediterranean", "Middle Eastern", "Spanish", "Turkish", "Greek",
	"Hawaiian", "Asian fusion", "Seafood", "Salad", "Sandwiches", "Pasta", "Breakfast", "Dessert", "Coffee",
	"Steakhouse", "Barbecue", "Cafe", "Tacos", "Nepalese", "Ice Cream", "Smoothie", "Juice", "Poke", "Coffee",
	"Alcohol", "Donuts", "Matcha", "Boba", "Shaved Ice", "Mochi", "Milkshake", "Froyo", "Fine Dining",
}

type GeminiPredictor struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewGeminiPredictor(apiKey string) (*GeminiPredictor, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}
	model := client.GenerativeModel("gemini-2.0-flash")

	return &GeminiPredictor{client: client, model: model}, nil
}

// when a user submits a deal for a new business, predict the cuisine type based on the above list
func (p *GeminiPredictor) PredictCuisine(ctx context.Context, business *model.Business) ([]string, error) {
	prompt := fmt.Sprintf(
		"You are a restaurant cuisine classifier that determines food categories for restaurants.\n\n"+
			"Based on the following list of cuisine types:\n%s\n\n"+
			"Analyze this business and determine which of the following cuisine types apply:\n"+
			"Business name: %s\n"+
			"Location: Davis, California\n\n"+
			"Return ONLY a JSON array with the top 5 most likely matching cuisine types from the list provided.",
		strings.Join(CuisineTypes, ", "), business.Name,
	)

	p.model.SetTemperature(0.2)

	response, err := p.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Printf("ERROR from Gemini API: %v", err)
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	log.Printf("Received response from Gemini: %+v", response)

	if len(response.Candidates) == 0 {
		log.Printf("ERROR: No candidates in response")
		return nil, fmt.Errorf("no response from Gemini")
	}

	responseText := fmt.Sprintf("%v", response.Candidates[0].Content.Parts[0])
	log.Printf("Response text: %s", responseText)
	responseText = strings.TrimPrefix(responseText, "```json")
	responseText = strings.TrimSuffix(responseText, "```")

	var cuisineTypes []string
	if err := json.Unmarshal([]byte(responseText), &cuisineTypes); err != nil {
		log.Printf("ERROR unmarshaling JSON: %v, trying fallback", err)
		for _, ct := range CuisineTypes {
			if strings.Contains(responseText, ct) {
				cuisineTypes = append(cuisineTypes, ct)
			}
		}
		if len(cuisineTypes) == 0 {
			return nil, fmt.Errorf("failed to unmarshal response: %w", err)
		}
	}

	log.Printf("Final cuisine types: %v", cuisineTypes)
	return cuisineTypes, nil
}

func (p *GeminiPredictor) GetAllCuisineTypes() []string {
	return CuisineTypes
}
