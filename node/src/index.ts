import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NASAService } from './services/nasaService';
import { NASAApodRequest } from './types/nasa';

// Завантажуємо змінні середовища
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const nasaService = new NASAService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовий роут
app.get('/', (req, res) => {
    return res.json({
        message: 'Welcome to From2 NASA Backend! 🚀',
        version: '1.0.0',
        status: 'running'
    });
});

// GET запит для отримання сьогоднішнього NASA APOD
app.get('/api/nasa/apod', async (req, res) => {
    try {
        // Отримуємо сьогоднішнє фото з NASA API
        const apodData = await nasaService.getApod();

        return res.json({
            success: true,
            data: apodData,
            request: {
                date: 'today',
                requested_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Помилка при отриманні сьогоднішнього NASA APOD:', error);

        if (error instanceof Error) {
            return res.status(400).json({
                error: error.message
            });
        } else {
            return res.status(500).json({
                error: 'Внутрішня помилка сервера'
            });
        }
    }
});

// POST запит для отримання NASA APOD за конкретну дату
app.post('/api/nasa/apod', async (req, res) => {
    try {
        const { date }: NASAApodRequest = req.body;

        // Отримуємо фото з NASA API
        const apodData = await nasaService.getApod(date);

        return res.json({
            success: true,
            data: apodData,
            request: {
                date: date || 'today',
                requested_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Помилка при отриманні NASA APOD:', error);

        if (error instanceof Error) {
            return res.status(400).json({
                error: error.message
            });
        } else {
            return res.status(500).json({
                error: 'Внутрішня помилка сервера'
            });
        }
    }
});

// GET запит для отримання NASA APOD за конкретну дату
app.get('/api/nasa/apod/:date', async (req, res) => {
    try {
        const { date } = req.params;

        // Валідація формату дати (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                error: 'Неправильний формат дати. Використовуйте YYYY-MM-DD'
            });
        }

        const apodData = await nasaService.getApod(date);

        return res.json({
            success: true,
            data: apodData,
            requested_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Помилка при отриманні NASA APOD за дату:', error);

        if (error instanceof Error) {
            return res.status(400).json({
                error: error.message
            });
        } else {
            return res.status(500).json({
                error: 'Внутрішня помилка сервера'
            });
        }
    }
});

// Health check
app.get('/health', (req, res) => {
    return res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET запит для отримання випадкових NASA APOD фото
app.get('/api/nasa/apod/random/:count?', async (req, res) => {
    try {
        const count = req.params.count ? parseInt(req.params.count) : 1;

        // Валідація кількості
        if (isNaN(count) || count < 1 || count > 100) {
            return res.status(400).json({
                error: 'Кількість повинна бути числом від 1 до 100'
            });
        }

        const apodData = await nasaService.getRandomApod(count);

        return res.json({
            success: true,
            count: apodData.length,
            data: apodData,
            requested_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Помилка при отриманні випадкових NASA APOD:', error);

        if (error instanceof Error) {
            return res.status(400).json({
                error: error.message
            });
        } else {
            return res.status(500).json({
                error: 'Внутрішня помилка сервера'
            });
        }
    }
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
