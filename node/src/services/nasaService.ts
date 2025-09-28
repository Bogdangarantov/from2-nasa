import axios from 'axios';
import { NASAApodRequest, NASAApodResponse, NASAErrorResponse } from '../types/nasa';

export class NASAService {
  private readonly baseURL = 'https://api.nasa.gov/planetary/apod';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.NASA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️  NASA_API_KEY не знайдено в змінних середовища');
    }
  }

  async getApod(date?: string): Promise<NASAApodResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('NASA API ключ не налаштовано');
      }

      // Валідація дати якщо вказана
      if (date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
          throw new Error('Неправильний формат дати. Використовуйте YYYY-MM-DD');
        }

        const inputDate = new Date(date);
        if (isNaN(inputDate.getTime())) {
          throw new Error('Неправильна дата');
        }

        // Перевіряємо що дата не в майбутньому
        const today = new Date();
        if (inputDate > today) {
          throw new Error('Дата не може бути в майбутньому');
        }
      }

      const response = await axios.get<NASAApodResponse>(this.baseURL, {
        params: {
          api_key: this.apiKey,
          date: date,
          thumbs: true // Отримуємо thumbnail для відео
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('Неправильний NASA API ключ');
        }
        if (error.response.status === 404) {
          throw new Error('Фото для вказаної дати не знайдено');
        }
        if (error.response.status === 429) {
          throw new Error('Перевищено ліміт запитів до NASA API');
        }
        throw new Error(`Помилка NASA API: ${error.message}`);
      }
      throw error;
    }
  }

  async getRandomApod(count: number = 1): Promise<NASAApodResponse[]> {
    try {
      if (!this.apiKey) {
        throw new Error('NASA API ключ не налаштовано');
      }

      // Валідація кількості
      if (count < 1 || count > 100) {
        throw new Error('Кількість повинна бути від 1 до 100');
      }

      const response = await axios.get<NASAApodResponse[]>(this.baseURL, {
        params: {
          api_key: this.apiKey,
          count: count,
          thumbs: true
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('Неправильний NASA API ключ');
        }
        if (error.response.status === 429) {
          throw new Error('Перевищено ліміт запитів до NASA API');
        }
        throw new Error(`Помилка NASA API: ${error.message}`);
      }
      throw error;
    }
  }
}
