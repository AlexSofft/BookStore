import { APIRequestContext } from '@playwright/test';
import { BooksAPI } from '../../utils/APIutils/booksAPI';

class BookService {
  apiContext: APIRequestContext;
  bookIDs: number[] = [];
  bookID?: number;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  async getBookIDs() {
    const apiUtils = new BooksAPI(this.apiContext);
    const books = await apiUtils.getAllBooks();
    const ids = books.map((book: { id: number }) => book.id);
    this.bookIDs = ids;
    return ids;
  }

   async getBookDetails(id: number) {
    const apiUtils = new BooksAPI(this.apiContext);
    try {
      const book = await apiUtils.getBookById(id);
      console.log(`Fetched book: ${book.title}`);
      return book;
    } catch (error: any) {
      console.error(`GET book [${id}] failed: ${error.message}`);
      return null;
    }
  }

  async getBook(id: number) {
    const apiUtils = new BooksAPI(this.apiContext);
    try {
      const response = await apiUtils.getBookResponseById(id);
      return response;
    } catch (error: any) {
      console.error(`GET book [${id}] failed: ${error.message}`);
      return null;
    }
  }

  async createBook(bookData: any) {
    const apiUtils = new BooksAPI(this.apiContext);
    const createdBook = await apiUtils.createBook(bookData);
    this.bookID = createdBook.id;
    console.log(`Book created with ID: ${createdBook.id}`);
    return createdBook.id;
  }

  async deleteBookByID(id?: number) {
    const apiUtils = new BooksAPI(this.apiContext);
    const bookId = id ?? this.bookID ?? this.bookIDs[0];
    if (!bookId) {
      console.error('No book ID available for deletion.');
      return;
    }
    const response = await apiUtils.deleteBook(bookId);
    console.log(`Book with ID ${bookId} deleted.`);
    return response
  }

  async deleteAllBooks(ids: number[] = Array.from({ length: 201 }, (_, i) => i)) {
    const apiUtils = new BooksAPI(this.apiContext);

    if (!ids.length) {
      console.error('No book IDs provided for deletion.');
      return;
    }

    for (const id of ids) {
      await apiUtils.deleteBook(id);
      console.log(`Deleted book with ID: ${id}`);
    }
  }

  async updateBook(id: number, updatedData: any) {
    const apiUtils = new BooksAPI(this.apiContext);
    let response = await apiUtils.updateBook(id, updatedData);
    console.log(`Book with ID ${id} updated.`);
    return response
  }

}


export default BookService;
