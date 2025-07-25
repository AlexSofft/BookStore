import { APIRequestContext, APIResponse } from '@playwright/test';
import baseEnvUrl from '../environmentBaseUrl';

export interface BookModel {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
}

export class BooksAPI {
  private apiContext: APIRequestContext;
  private baseURLapi: string;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
    this.baseURLapi = baseEnvUrl[process.env.ENV.trim()].api + '/v1/Books';
  }

  // GET /Books – get all books
  async getAllBooks(): Promise<BookModel[]> {
    const response = await this.apiContext.get(this.baseURLapi, {
      headers: { Accept: 'text/plain; v=1.0' }
    });
    const books = await response.json();
    return books;
  }

  // GET /Books/{id} – get book by ID
  async getBookById(id: number): Promise<BookModel> {
    const response = await this.apiContext.get(`${this.baseURLapi}/${id}`, {
      headers: { Accept: 'text/plain; v=1.0' }
    });
    const book = await response.json();
    console.log(`GET book [${id}]:`, book);
    return book;
  }

  async getBookResponseById(id: number): Promise<APIResponse> {
    const response: APIResponse = await this.apiContext.get(`${this.baseURLapi}/${id}`, {
      headers: { Accept: 'application/json; v=1.0' }
    });
    console.log(`GET /Books/${id} - Status: ${response.status()}`);
    return response;
  }

  // POST /Books – create book
  async createBook(book: BookModel): Promise<BookModel> {
    const response = await this.apiContext.post(this.baseURLapi, {
      headers: {
        'Content-Type': 'application/json; v=1.0'
      },
      data: book
    });
    const created = await response.json();
    console.log('POST create book:', created);
    return created;
  }

  // PUT /Books/{id} – update book by ID
  async updateBook(id: number, book: BookModel): Promise<APIResponse> {
    const response = await this.apiContext.put(`${this.baseURLapi}/${id}`, {
      headers: {
        'Content-Type': 'application/json; v=1.0'
      },
      data: book
    });
    const updated = await response.json();
    console.log(`PUT update book [${id}]:`, updated);
    return response;
  }

  // DELETE /Books/{id} – delete book by ID
  async deleteBook(id: number): Promise<APIResponse> {
    const response = await this.apiContext.delete(`${this.baseURLapi}/${id}`);
    console.log(`DELETE book [${id}] - status:`, response.status());
    return response;
  }
}
