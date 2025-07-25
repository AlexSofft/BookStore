import { APIRequestContext, APIResponse } from '@playwright/test';
import baseEnvUrl from '../environmentBaseUrl';

export interface AuthorModel {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

export class AuthorsAPI {
  private apiContext: APIRequestContext;
  private baseURLapi: string;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
    this.baseURLapi = baseEnvUrl[process.env.ENV.trim()].api + '/v1/Authors';
  }

  // GET /Authors - get all authors
  async getAllAuthors(): Promise<AuthorModel[]> {
    const response = await this.apiContext.get(this.baseURLapi, {
      headers: { Accept: 'text/plain; v=1.0' }
    });
    const authors = await response.json();
    console.log('GET all authors:', authors.length);
    return authors;
  }

  // GET /Authors/{id} – get author by ID
  async getAuthorById(id: number): Promise<APIResponse> {
    const response = await this.apiContext.get(`${this.baseURLapi}/${id}`, {
      headers: { Accept: 'text/plain; v=1.0' }
    });
    const author = await response.json();
    console.log(`GET author [${id}]:`, author);
    return response;
  }

  // GET /Authors/authors/books/{idBook} – get authors by Book ID
  async getAuthorsByBookId(idBook: number): Promise<AuthorModel[]> {
    const response = await this.apiContext.get(`${this.baseURLapi}/authors/books/${idBook}`, {
      headers: { Accept: 'text/plain; v=1.0' }
    });
    const authors = await response.json();
    console.log(`GET authors by book ID [${idBook}]:`, authors);
    return authors;
  }

  // POST /Authors – create a new author
  async createAuthor(author: AuthorModel): Promise<AuthorModel> {
    const response = await this.apiContext.post(this.baseURLapi, {
      headers: {
        'Content-Type': 'application/json; v=1.0'
      },
      data: author
    });
    const created = await response.json();
    console.log('POST create author:', created);
    return created;
  }

  // PUT /Authors/{id} – update author by ID
  async updateAuthor(id: number, author: AuthorModel): Promise<APIResponse> {
    const response = await this.apiContext.put(`${this.baseURLapi}/${id}`, {
      headers: {
        'Content-Type': 'application/json; v=1.0'
      },
      data: author
    });
    const updated = await response.json();
    console.log(`PUT update author [${id}]:`, updated);
    return response;
  }

  // DELETE /Authors/{id} – delete author by ID
  async deleteAuthor(id: number): Promise<APIResponse> {
    const response = await this.apiContext.delete(`${this.baseURLapi}/${id}`);
    console.log(`DELETE author [${id}] - status:`, response.status());
    return response;
  }
}
