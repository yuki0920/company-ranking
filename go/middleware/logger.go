package middleware

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/middleware"
)

func LoggingMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			t1 := time.Now()
			defer func() {
				slog.Info("Served",
					slog.String("proto", r.Proto),
					slog.String("method", r.Method),
					slog.String("path", r.URL.Path),
					slog.Duration("lat", time.Since(t1)),
					slog.Int("status", ww.Status()),
					slog.Int("size", ww.BytesWritten()),
				)
			}()

			next.ServeHTTP(ww, r)
		}
		return http.HandlerFunc(fn)
	}
}
