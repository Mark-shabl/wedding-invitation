package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "swagger": "2.0",
    "info": {
        "title": "Wedding Invitations API",
        "version": "1.0"
    },
    "host": "localhost:8080",
    "basePath": "/api/v1",
    "paths": {}
}`

type s struct{}

func (s *s) ReadDoc() string { return docTemplate }

func init() {
	swag.Register(swag.Name, &s{})
}
