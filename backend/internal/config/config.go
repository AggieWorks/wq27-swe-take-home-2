package config

type Config struct {
	App   *App
	HTTP  *HTTP
	DB    *DB
	OAUTH *OAUTH
	S3    *S3
	AI    *AI
}

type App struct {
	Env string
}

type HTTP struct {
	Host      string
	Port      string
	JWTSecret string
}

type DB struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLmode  string
}

type OAUTH struct {
	ID       string
	Secret   string
	Callback string
}

type S3 struct {
	AccountId       string
	AccessKeyId     string
	SecretAccessKey string
	Bucket          string
	ImageBaseUrl    string
}

type AI struct {
	GeminiApiKey string
}

// New creates a new Config instance.
func New(app *App, http *HTTP, db *DB, auth *OAUTH, ai *AI) *Config {
	return &Config{
		App:   app,
		HTTP:  http,
		DB:    db,
		OAUTH: auth,
		AI:    ai,
	}
}
