# HTTPS Setup Guide for NASA.From2 Project

## 🔒 Повне HTTPS захищення фронтенду та бекенду

### 🌐 Архітектура безпеки

```
Internet → HTTPS (443) → Nginx (Frontend) → HTTPS Proxy → Backend (3000)
         ↓
    HTTP (80) → Redirect to HTTPS
```

### ✅ Що захищено:

1. **Фронтенд (Vue.js)**: HTTPS на порту 443
2. **Бекенд API**: Доступ тільки через HTTPS проксі
3. **Всі API запити**: Автоматично через HTTPS
4. **Статичні файли**: CSS, JS, зображення через HTTPS

### 🚀 Налаштування:

#### 1. Запустіть скрипт SSL налаштування:
```bash
./setup-ssl.sh nasa.from2.tech from2.official@gmail.com
```

#### 2. Запустіть проект:
```bash
docker-compose up -d
```

#### 3. Згенеруйте сертифікати:
```bash
docker-compose run --rm certbot
```

#### 4. Перезапустіть з SSL:
```bash
docker-compose down
docker-compose up -d
```

### 🔧 Технічні деталі:

#### **Nginx конфігурація:**
- **Порт 80**: HTTP → HTTPS redirect + Let's Encrypt challenge
- **Порт 443**: HTTPS з SSL сертифікатами
- **API проксі**: `/api/*` → `http://backend:3000` (внутрішня мережа)

#### **Бекенд безпека:**
- **Немає зовнішніх портів** - тільки `expose: 3000`
- **Доступ тільки через Nginx** в Docker мережі
- **Всі запити** проходять через HTTPS

#### **Фронтенд безпека:**
- **Відносні URL** для API: `/api/nasa/apod`
- **Автоматичний протокол** (HTTP/HTTPS)
- **Security headers** від Nginx

### 📋 Перевірка:

#### **Перевірте HTTPS:**
```bash
# Фронтенд
curl -I https://nasa.from2.tech

# API
curl -I https://nasa.from2.tech/api/nasa/apod

# Автоматичне перенаправлення
curl -I http://nasa.from2.tech
# Має повернути 301 → https://
```

#### **Перевірте сертифікати:**
```bash
# В контейнері
docker-compose exec frontend certbot certificates

# Ззовні
openssl s_client -connect nasa.from2.tech:443 -servername nasa.from2.tech
```

### 🛡️ Безпека:

#### **Security Headers:**
- `Strict-Transport-Security`: Примусовий HTTPS
- `X-Frame-Options`: Захист від clickjacking
- `X-Content-Type-Options`: Захист від MIME sniffing
- `X-XSS-Protection`: Захист від XSS атак

#### **Rate Limiting:**
- API: 10 запитів/секунду
- Burst: 20 запитів
- Захист від DDoS атак

#### **SSL/TLS:**
- TLS 1.2 та 1.3
- Сучасні шифри
- Perfect Forward Secrecy
- HTTP/2 підтримка

### 🔄 Автоматичне оновлення:

```bash
# Crontab (щодня о 12:00)
0 12 * * * docker-compose exec frontend /usr/local/bin/ssl-renew.sh
```

Скрипт автоматично:
- Перевіряє термін дії сертифікатів
- Оновлює коли залишається < 30 днів
- Перезавантажує Nginx

### 🌍 Доступ:

- **Фронтенд**: https://nasa.from2.tech
- **API**: https://nasa.from2.tech/api/*
- **HTTP**: Автоматично перенаправляє на HTTPS

### 📊 Переваги:

1. **Повна безпека** - все через HTTPS
2. **SEO friendly** - Google любить HTTPS
3. **Швидкість** - HTTP/2 та gzip компресія
4. **Автоматично** - сертифікати оновлюються самі
5. **Безкоштовно** - Let's Encrypt сертифікати

### 🚨 Troubleshooting:

#### **Проблема: "SSL handshake failed"**
```bash
# Перевірте сертифікати
docker-compose exec frontend certbot certificates

# Перезапустіть Nginx
docker-compose restart frontend
```

#### **Проблема: "API not accessible"**
```bash
# Перевірте логи
docker-compose logs frontend
docker-compose logs backend

# Перевірте мережу
docker-compose exec frontend ping backend
```

#### **Проблема: "Certificate expired"**
```bash
# Запустіть оновлення вручну
docker-compose exec frontend /usr/local/bin/ssl-renew.sh
```

Тепер весь ваш проект захищений HTTPS! 🔒✨
