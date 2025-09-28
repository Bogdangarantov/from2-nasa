# NASA.From2 - Astronomy Picture of the Day

Красивий веб-додаток для перегляду NASA Astronomy Picture of the Day (APOD) з фоновим відео та адаптивним дизайном.

## 🚀 Особливості

- **NASA APOD API** - щоденні космічні зображення
- **Фонове відео** - автоматичне зациклювання
- **Адаптивний дизайн** - оптимізовано для мобільних пристроїв
- **Datepicker** - пошук фото за конкретну дату
- **URL роутинг** - прямі посилання на фото за датою
- **QR код для донату** - підтримка проекту
- **SEO оптимізація** - для кращої індексації в Google

## 🐳 Docker розгортання

### Швидкий старт

1. **Клонуйте репозиторій:**
```bash
git clone <your-repo-url>
cd from2-nasa
```

2. **Створіть .env файл:**
```bash
cp node/.env.example node/.env
# Додайте ваш NASA API ключ
echo "NASA_API_KEY=your_api_key_here" >> node/.env
```

3. **Запустіть з Docker Compose:**
```bash
docker-compose up --build
```

4. **Відкрийте браузер:**
- Фронтенд: http://localhost
- Бекенд: http://localhost:3000

### Окремі сервіси

#### Фронтенд (Vue.js)
```bash
cd vue
docker build -t nasa-frontend .
docker run -p 80:80 nasa-frontend
```

#### Бекенд (Node.js)
```bash
cd node
docker build -t nasa-backend .
docker run -p 3000:3000 --env-file .env nasa-backend
```

## 🛠️ Розробка

### Фронтенд
```bash
cd vue
npm install
npm run dev
```

### Бекенд
```bash
cd node
npm install
npm run dev
```

## 📱 Адаптивний дизайн

Додаток автоматично адаптується до різних розмірів екрану:

- **Desktop (≥992px)** - повна версія з бічними кнопками
- **Tablet (≥768px)** - компактна версія
- **Mobile (<768px)** - мобільна оптимізація

## 🔧 Налаштування

### Environment Variables

```bash
# Backend (.env)
NASA_API_KEY=your_nasa_api_key
PORT=3000
NODE_ENV=production

# Frontend (docker-compose)
VITE_API_URL=http://backend:3000
```

### NASA API Key

1. Зареєструйтесь на [api.nasa.gov](https://api.nasa.gov)
2. Отримайте безкоштовний API ключ
3. Додайте його в `.env` файл

## 📦 Структура проекту

```
from2-nasa/
├── vue/                 # Vue.js фронтенд
│   ├── src/
│   │   ├── components/  # Vue компоненти
│   │   ├── views/       # Сторінки
│   │   └── types/       # TypeScript типи
│   ├── Dockerfile       # Docker для фронтенду
│   └── nginx.conf       # Nginx конфігурація
├── node/                # Node.js бекенд
│   ├── src/
│   │   ├── services/    # Бізнес-логіка
│   │   └── types/       # TypeScript типи
│   └── Dockerfile       # Docker для бекенду
├── docker-compose.yml   # Docker Compose
└── README.md            # Документація
```

## 🌐 Хостинг

### VPS/Cloud

1. Завантажте код на сервер
2. Встановіть Docker та Docker Compose
3. Налаштуйте домен та SSL
4. Запустіть `docker-compose up -d`

### Docker Hosting

- **DigitalOcean App Platform**
- **Google Cloud Run**
- **AWS ECS**
- **Azure Container Instances**

## 📊 API Endpoints

- `GET /api/nasa/apod` - сьогоднішнє фото
- `GET /api/nasa/apod/:date` - фото за дату
- `POST /api/nasa/apod` - пошук фото за дату
- `GET /api/nasa/apod/random/:count` - випадкові фото

## 🔒 Безпека

- CORS налаштування
- Rate limiting
- Security headers
- Non-root Docker користувач

## 📈 Продуктивність

- Gzip компресія
- Кешування статичних файлів
- Оптимізовані зображення
- Lazy loading

## 🤝 Підтримка

- Email: from2.official@gmail.com
- Сайт: https://from2.tech

## 📄 Ліцензія

© 2025 From2. All rights reserved.