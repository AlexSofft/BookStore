import { test, expect, request, APIRequestContext } from '@playwright/test';
import BooksService from '../../api/services/BooksService';

test.describe('Books API - Happy and Edge Case Scenarios', () => {
  let context: APIRequestContext;
  let booksService: BooksService;
  let invalID: number;

  test.beforeAll(async () => {
    context = await request.newContext();
    booksService = new BooksService(context);
    invalID = Math.floor(Math.random() * 10000)
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  // this test intended to show the impossibility of real deleting entities 
  test('GET /api/v1/Books - delete all books (Happy case)', async () => {
    await booksService.deleteAllBooks();
    const allBookIDs = await booksService.getBookIDs();
    console.log(allBookIDs)
    expect(Array.isArray(allBookIDs)).toBeTruthy();
    expect(allBookIDs.length).toBe(0)
  });

  test('GET /api/v1/Books - Retrieve all books (Happy case)', async () => {
    const allBookIDs = await booksService.getBookIDs();
    console.log(allBookIDs)
    expect(Array.isArray(allBookIDs)).toBeTruthy();
    if (allBookIDs.length > 0) expect(typeof allBookIDs[0]).toBe('number');
  });

  test('GET /api/v1/Books/{id} - Get book by valid ID (Happy case)', async () => {
    const newBook = {
      id: Math.floor(Math.random() * 99) + 1,
      title: 'Book for test',
      description: 'test',
      pageCount: 120,
      excerpt: 'Excerpt',
      publishDate: new Date().toISOString(),
    };
    const bookId = await booksService.createBook(newBook);

    const book = await booksService.getBookDetails(bookId);
    expect(book.id).toBe(bookId);
    expect(book.title).toBe(newBook.title);
  });

  test('GET /api/v1/Books/{id} - Get book by invalid ID (Edge case)', async () => {
    const response = await booksService.getBook(invalID)
    expect(response.status()).toBeGreaterThan(400);
  });


  test('POST /api/v1/Books - Create a new book (Happy case)', async () => {
    const newBook = {
      id: Math.floor(Math.random() * 99) + 1,
      title: 'Happy path book',
      description: 'test book',
      pageCount: 150,
      excerpt: 'Excerpt test',
      publishDate: new Date().toISOString(),
    };
    const bookId = await booksService.createBook(newBook);
    expect(bookId).toBeGreaterThan(0);
  });

  test('POST /api/v1/Books - Create book (Edge case: Missing required fields)', async () => {
    // missing title 
    const invalidBook = {
      id: Math.floor(Math.random() * 99) + 1,
      description: 'No title',
      pageCount: 100,
      excerpt: 'Excerpt',
      publishDate: new Date().toISOString(),
    };
    const bookId = await booksService.createBook(invalidBook);
    const response = await booksService.getBook(bookId)
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });


  test('PUT /api/v1/Books/{id} - Update book with valid data (Happy case)', async () => {
    const newBook = {
      id: Math.floor(Math.random() * 90) + 1,
      title: 'To update',
      description: 'Before update',
      pageCount: 100,
      excerpt: 'Excerpt',
      publishDate: new Date().toISOString(),
    };
    const updatedData = {
      ...newBook,
      title: 'Updated Title',
      description: 'Updated Desc',
      pageCount: 200,
    };

    const bookId = await booksService.createBook(newBook);
    const response = await booksService.updateBook(bookId, updatedData);
    expect(response.status()).toBe(200);

    const updatedBook = await booksService.getBookDetails(bookId);
    expect(updatedBook.title).toBe(updatedData.title);
  });


  test('PUT /api/v1/Books/{id} - Update non-existent book (Edge case)', async () => {
    const updatedData = {
      id: invalID,
      title: 'Nonexistent Book',
      description: 'Should fail',
      pageCount: 100,
      excerpt: 'N/A',
      publishDate: new Date().toISOString(),
    };
    const response = await booksService.updateBook(invalID, updatedData);
    expect(response.status()).toBeGreaterThan(400);
  });

  test('DELETE /api/v1/Books/{id} - Delete existing book (Happy case)', async () => {
    const newBook = {
      id: Math.floor(Math.random() * 99) + 1,
      title: 'Book to delete',
      description: 'Desc',
      pageCount: 80,
      excerpt: 'Excerpt',
      publishDate: new Date().toISOString(),
    };
    const bookId = await booksService.createBook(newBook);
    await booksService.deleteBookByID(bookId);
    const response = await booksService.getBook(bookId)
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('DELETE /api/v1/Books/{id} - Delete non-existing book (Edge case)', async () => {
    const response = await booksService.deleteBookByID(invalID);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

});























