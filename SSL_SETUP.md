# SSL Setup Guide for NASA.From2 Project

## Автоматичне оновлення SSL сертифікатів з Let's Encrypt

### 🚀 Швидке налаштування

1. **Запустіть скрипт налаштування:**
   ```bash
   chmod +x setup-ssl.sh
   ./setup-ssl.sh nasa.from2.tech from2.official@gmail.com
   ```

2. **Оновіть DNS вашого домену** щоб вказував на ваш VPS сервер

3. **Переконайтеся що порти 80 та 443 відкриті** на фаєрволі

4. **Запустіть фронтенд:**
   ```bash
   docker-compose up -d frontend
   ```

5. **Згенеруйте SSL сертифікати:**
   ```bash
   docker-compose run --rm certbot
   ```

6. **Перезапустіть всі сервіси:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### 🔄 Автоматичне оновлення

Скрипт автоматично перевіряє термін дії сертифікатів та оновлює їх коли залишається менше 30 днів.

Додайте в crontab для щоденної перевірки:
```bash
# Перевіряти сертифікати щодня о 12:00
0 12 * * * docker-compose exec frontend /usr/local/bin/ssl-renew.sh

# Або вручну:
crontab -e
```

**Принцип роботи:**
- Сертифікати Let's Encrypt дійсні **90 днів**
- Скрипт перевіряє їх **щодня**
- Оновлює **тільки коли залишається < 30 днів**
- **Не витрачає ресурси** на зайві оновлення

### 📁 Структура файлів

```
from2-nasa/
├── ssl/                    # SSL сертифікати (монтуються з хоста)
├── certbot/
│   ├── www/               # Webroot для Let's Encrypt
│   └── conf/              # Конфігурація Let's Encrypt
├── vue/
│   ├── Dockerfile         # З Certbot
│   ├── nginx.conf         # HTTPS конфігурація
│   └── ssl-renew.sh       # Скрипт оновлення
├── docker-compose.yml      # З SSL сервісами
├── setup-ssl.sh           # Скрипт налаштування
└── .env                   # Змінні середовища
```

### 🔧 Ручне налаштування

#### 1. Створіть директорії:
```bash
mkdir -p ssl certbot/www certbot/conf
```

#### 2. Створіть .env файл:
```bash
DOMAIN=nasa.from2.tech
EMAIL=from2.official@gmail.com
NASA_API_KEY=your_nasa_api_key_here
```

#### 3. Запустіть сервіси:
```bash
# Спочатку фронтенд без SSL
docker-compose up -d frontend

# Згенеруйте сертифікати
docker-compose run --rm certbot

# Перезапустіть з SSL
docker-compose down
docker-compose up -d
```

### 🛠️ Troubleshooting

#### Проблема: "Challenge failed"
- Перевірте що DNS правильно налаштований
- Переконайтеся що порт 80 відкритий
- Дочекайтеся оновлення DNS (може зайняти до 24 годин)

#### Проблема: "Certificate expired"
- Перевірте crontab: `crontab -l`
- Запустіть оновлення вручну: `docker-compose exec frontend /usr/local/bin/ssl-renew.sh`

#### Проблема: "Nginx won't start"
- Перевірте логи: `docker-compose logs frontend`
- Переконайтеся що сертифікати існують в `ssl/` директорії

### 📋 Перевірка статусу

```bash
# Перевірте статус сертифікатів
docker-compose exec frontend certbot certificates

# Перевірте логи nginx
docker-compose logs frontend

# Перевірте статус сервісів
docker-compose ps
```

### 🔒 Безпека

- Сертифікати автоматично оновлюються кожні 60 днів
- Використовується HTTP/2 та сучасні шифри
- Додано security headers
- Rate limiting для API
- Автоматичне перенаправлення HTTP → HTTPS

### 🌐 Доступ

Після налаштування ваш сайт буде доступний:
- **HTTP**: http://nasa.from2.tech (автоматично перенаправляє на HTTPS)
- **HTTPS**: https://nasa.from2.tech

### 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи: `docker-compose logs`
2. Перевірте статус: `docker-compose ps`
3. Перезапустіть сервіси: `docker-compose restart`
