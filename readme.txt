
1. This is a mock API, not backed by a real database. Instead, it emulates responses for dev/testing purposes.
   Impossible to work in separate session using token or whatever.
2. Also there is ability to create entity(book, author) with already existing ID.
3. API has restricted number of BOOKIDs to create (1-200) and AUTHORSID(1-600).
5. Any DELETE or POST request returns a fake success response.
6. But the underlying data is not persisted (in memory only).
7. It resets either immediately or periodically (per session, or every few seconds).

IMPOSSIBLE:
- assert data consistency over time
- test workflows (create → get → update → delete → get again)
- confirm that something is actually deleted or saved
- get reasonable expected result

SUMMURY: the API is not ready for regression testing. 
!!!Most of the performed tests are RED as they check the required behavior specified in provided API.

RUN package.json scripts for run the framework:

npm run local - runs frame localy
npm run ci - in case of separating enviroments and different URL for CI




 