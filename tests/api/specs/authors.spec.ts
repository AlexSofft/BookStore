import { test, expect, request, APIRequestContext } from '@playwright/test';
import AuthorsService from '../../api/services/AuthorsService';

test.describe('Authors API - Happy and Edge Case Scenarios', () => {
  let context: APIRequestContext;
  let authorsService: AuthorsService;
  let invalID: number;

  test.beforeAll(async () => {
    context = await request.newContext();
    authorsService = new AuthorsService(context);
    invalID = Math.floor(Math.random() * 10000)
  });

  test.afterAll(async () => {
    // await authorsService.cleanupAuthors(); // impossible due to API specific
    await context.dispose();
  });

  test('GET /api/v1/Authors - get all authors (Happy case)', async () => {
    const allAuthors = await authorsService.getAllAuthors();
    expect(Array.isArray(allAuthors)).toBeTruthy();
    if (allAuthors.length > 0) {
      expect(allAuthors[0]).toHaveProperty('id');
      expect(allAuthors[0]).toHaveProperty('firstName');
      expect(allAuthors[0]).toHaveProperty('lastName');
    }
  });

  test('POST /api/v1/Authors - create author (Happy case)', async () => {
    const newAuthor = {
      id: Math.floor(Math.random() * 100),
      idBook: 1,
      firstName: 'Guy',
      lastName: 'Richy',
    };
    const created = await authorsService.createAuthor(newAuthor);
    expect(created.id).toBe(newAuthor.id);
    expect(created.firstName).toBe(newAuthor.firstName);
  });

  test('GET /api/v1/Authors/{id} - get author by valid ID (Happy case)', async () => {
    const newAuthor = {
      id: 599,
      idBook: 1,
      firstName: 'Stanly',
      lastName: 'Cubric',
    };
    const created = await authorsService.createAuthor(newAuthor);
    const response = await authorsService.getAuthor(created.id);
    const author = await response.json()
    expect(created.id).toBe(author.id);
    expect(author.firstName).toBe(newAuthor.firstName);
  });

  test('GET /api/v1/Authors/{id} - get author by invalid ID (Edge case)', async () => {
    const response = await authorsService.getAuthor(invalID);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('GET /api/v1/Authors/authors/books/{idBook} - get authors by book ID (Happy case)', async () => {
    const newAuthor = {
      id: Math.floor(Math.random() * 100),
      idBook: 100500,
      firstName: 'Book',
      lastName: 'Author',
    };
    const created = await authorsService.createAuthor(newAuthor);
    const response = await authorsService.getAuthor(created.id);
    expect(response.status()).toBe(200);

    const authors = await authorsService.getAuthorsByBookId(newAuthor.idBook);
    expect(authors.length).toBeGreaterThan(0);
    expect(authors[0]).toHaveProperty('idBook', newAuthor.idBook);
  });

  test('PUT /api/v1/Authors/{id} - update author with valid data (Happy case)', async () => {
    const newAuthor = {
      id: Math.floor(Math.random() * 100),
      idBook: 2,
      firstName: 'Stan',
      lastName: 'Marsh',
    };
    const updatedAuthor = {
      ...newAuthor,
      firstName: 'Eric',
      lastName: 'Cartman',
    };
    const created = await authorsService.createAuthor(newAuthor);
    await authorsService.updateAuthor(created.id, updatedAuthor);
    const response = await authorsService.getAuthor(created.id);
    const authorAfterUpdate = await response.json()
    expect(authorAfterUpdate.firstName).toBe(updatedAuthor.firstName);
  });

  test('PUT /api/v1/Authors/{id} - update non-existent author (Edge case)', async () => {
    const updatedAuthor = {
      id: invalID,
      idBook: 0,
      firstName: 'Kile',
      lastName: 'Brochlovski',
    };
    const response = await authorsService.updateAuthor(invalID, updatedAuthor);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('DELETE /api/v1/Authors/{id} - delete existing author (Happy case)', async () => {
    const newAuthor = {
      id: Math.floor(Math.random() * 100),
      idBook: 3,
      firstName: 'Delete',
      lastName: 'Call',
    };
    const created = await authorsService.createAuthor(newAuthor);
    await authorsService.deleteAuthor(created.id);
    const response = await authorsService.getAuthor(created.id);
    expect(response.status()).toBeGreaterThanOrEqual(400);

  });

  test('DELETE /api/v1/Authors/{id} - delete non-existent author (Edge case)', async () => {
    const response = await authorsService.deleteAuthor(invalID);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});




