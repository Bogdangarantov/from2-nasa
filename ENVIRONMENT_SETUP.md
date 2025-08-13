# Environment Setup Guide for NASA.From2 Project

## 🌍 Різні середовища та конфігурації

### 📁 Структура .env файлів

```
from2-nasa/
├── .env.development      # Development налаштування
├── .env.production       # Production налаштування
├── docker-compose.yml    # Production конфігурація
└── docker-compose.override.yml  # Development override
```

### 🚀 Development (Локальна розробка)

#### **Порти:**
- **Фронтенд**: http://localhost:3000
- **Бекенд**: http://localhost:3001
- **API**: http://localhost:3001/api/*

#### **Запуск:**
```bash
# Використовує .env.development автоматично
docker-compose up -d

# Або явно вказати файл
docker-compose --env-file .env.development up -d
```

#### **Конфігурація:**
```bash
# .env.development
DOMAIN=localhost
EMAIL=from2.official@gmail.com
VITE_API_URL=http://localhost:3001
NODE_ENV=development
PORT=3000
```

### 🌐 Production (VPS сервер)

#### **Порти:**
- **Фронтенд**: https://nasa.from2.tech (80 → 443)
- **Бекенд**: Внутрішній тільки (через Nginx проксі)
- **API**: https://nasa.from2.tech/api/*

#### **Запуск:**
```bash
# Використовує .env.production
docker-compose --env-file .env.production up -d

# Або створити .env з production налаштуваннями
./setup-ssl.sh nasa.from2.tech admin@from2.tech
docker-compose up -d
```

#### **Конфігурація:**
```bash
# .env.production
DOMAIN=nasa.from2.tech
EMAIL=from2.official@gmail.com
VITE_API_URL=          # Порожній (відносні URL)
NODE_ENV=production
PORT=3000
```

## 🔧 Детальна конфігурація

### **Development Override (docker-compose.override.yml):**

```yaml
# Автоматично завантажується в development
services:
  frontend:
    ports:
      - "3000:80"        # localhost:3000 → container:80
    
  backend:
    ports:
      - "3001:3000"      # localhost:3001 → container:3000
    command: npm run dev  # Hot reload
```

### **Production (docker-compose.yml):**

```yaml
services:
  frontend:
    ports:
      - "80:80"          # HTTP
      - "443:443"        # HTTPS
    
  backend:
    expose:
      - "3000"           # Тільки внутрішня мережа
```

## 📋 Команди для різних середовищ

### **Development:**
```bash
# Запуск
docker-compose up -d

# Логи
docker-compose logs -f

# Зупинка
docker-compose down
```

### **Production:**
```bash
# Запуск
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Логи
docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f

# Зупинка
docker-compose -f docker-compose.prod.yml --env-file .env.production down
```

### **Переключення між середовищами:**
```bash
# Development
cp .env.development .env
docker-compose up -d

# Production
cp .env.production .env
docker-compose up -d
```

## 🌐 API URL в різних середовищах

### **Development:**
```typescript
// Фронтенд робить запити на:
fetch('http://localhost:3001/api/nasa/apod')

// Бекенд доступний на:
http://localhost:3001
```

### **Production:**
```typescript
// Фронтенд робить запити на:
fetch('/api/nasa/apod')  // Відносний URL

// Бекенд доступний тільки через:
https://nasa.from2.tech/api/*
```

## 🚨 Важливі моменти

### **1. Порти не конфліктують:**
- **Development**: Frontend:3000, Backend:3001
- **Production**: Frontend:80/443, Backend:3000 (внутрішній)

### **2. Nginx проксі в production:**
```
Internet → HTTPS:443 → Nginx → Backend:3000 (внутрішня мережа)
```

### **3. Environment variables:**
- **Development**: `VITE_API_URL=http://localhost:3001`
- **Production**: `VITE_API_URL=` (порожній для відносних URL)

### **4. Hot reload в development:**
- Монтування source code
- `npm run dev` замість `npm start`

## 🔍 Перевірка конфігурації

### **Development:**
```bash
# Перевірте порти
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Перевірте контейнери
docker-compose ps
```

### **Production:**
```bash
# Перевірте порти
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Перевірте SSL
curl -I https://nasa.from2.tech
```

## 📚 Корисні команди

```bash
# Створити .env з development налаштуваннями
cp .env.development .env

# Створити .env з production налаштуваннями
cp .env.production .env

# Переглянути поточну конфігурацію
docker-compose config

# Запустити з конкретним .env файлом
docker-compose --env-file .env.production up -d
```

Тепер у вас є чітке розділення між development та production середовищами! 🚀
