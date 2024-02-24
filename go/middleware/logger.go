package middleware

import (
	"log/slog"
	"net/http"
	"regexp"
	"time"

	"github.com/go-chi/chi/middleware"
)

func LoggingMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			t1 := time.Now()
			defer func() {
				re := regexp.MustCompile(`/api/v1/companies/\d+`)
				path := r.URL.Path
				if !re.MatchString(path) {
					slog.Info("Served",
						slog.String("proto", r.Proto),
						slog.String("method", r.Method),
						slog.String("path", r.URL.Path),
						slog.Duration("lat", time.Since(t1)),
						slog.Int("status", ww.Status()),
						slog.Int("size", ww.BytesWritten()),
					)
				}
			}()

			next.ServeHTTP(ww, r)
		}
		return http.HandlerFunc(fn)
	}
}
