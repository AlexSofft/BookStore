import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthorsAPI, AuthorModel } from '../../utils/APIutils/authorsAPI';

class AuthorsService {
  private apiContext: APIRequestContext;
  private authorsAPI: AuthorsAPI;
  public authorIDs: number[] = [];

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
    this.authorsAPI = new AuthorsAPI(apiContext);
  }

  // create author 
  async createAuthor(author: AuthorModel): Promise<AuthorModel> {
    const created = await this.authorsAPI.createAuthor(author);
    this.authorIDs.push(created.id);
    console.log(`[AuthorsService] Created author with ID: ${created.id}`);
    return created;
  }

  // get author by id
  async getAuthor(id: number): Promise<APIResponse> {
    const response = await this.authorsAPI.getAuthorById(id);
    console.log(`[AuthorsService] Retrieved author with ID: ${id}`);
    return response;
  }

  // get all authors
  async getAllAuthors(): Promise<AuthorModel[]> {
    const authors = await this.authorsAPI.getAllAuthors();
    console.log(`[AuthorsService] Retrieved ${authors.length} authors`);
    return authors;
  }

  // get authors by book id
  async getAuthorsByBookId(idBook: number): Promise<AuthorModel[]> {
    const authors = await this.authorsAPI.getAuthorsByBookId(idBook);
    console.log(`[AuthorsService] Retrieved authors for book ID: ${idBook}`);
    return authors;
  }

  // update author
  async updateAuthor(id: number, updatedAuthor: AuthorModel): Promise<APIResponse> {
    const response = await this.authorsAPI.updateAuthor(id, updatedAuthor);
    console.log(`[AuthorsService] Updated author ID: ${id}`);
    return response
  }

  // delete author and remove from saved IDs
  async deleteAuthor(id: number): Promise<APIResponse> {
    const response = await this.authorsAPI.deleteAuthor(id);
    this.authorIDs = this.authorIDs.filter(storedId => storedId !== id);
    console.log(`[AuthorsService] Deleted author ID: ${id}`);
    return response
  }

  // cleanup all created authors
  async cleanupAuthors(): Promise<void> {
    for (const id of this.authorIDs) {
      await this.deleteAuthor(id);
    }
    this.authorIDs = [];
    console.log('[AuthorsService] Cleanup completed: all tracked authors deleted');
  }
}
export default AuthorsService;