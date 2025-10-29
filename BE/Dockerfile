# ----- Tahap 1: Build -----
# Gunakan image Go resmi sebagai basis (VERSI DIPERBARUI)
FROM golang:1.24-alpine AS builder

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file dependensi
COPY go.mod go.sum ./

# Download dependensi
RUN go mod download

# Salin seluruh kode sumber
COPY . .

# Build aplikasi Go menjadi binary statis
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./cmd/main.go

# ----- Tahap 2: Final -----
# Gunakan image Alpine (sangat kecil) sebagai basis final
FROM alpine:latest

WORKDIR /app

# Salin HANYA binary yang sudah di-build dari tahap "builder"
COPY --from=builder /app/main .

# Port yang diekspos oleh aplikasi Go Anda
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["./main"]