'use strict';


const bookRepo = require('../repositories/book');
const sendResponse = require('../utils/sendResponse');
const authorRepo = require('../repositories/author');
const workflow = require('../workflow/workflow');

const createAuthors = function (authors) {
    return authors.map(function (author) {
        return authorRepo.createAuthor(author);
    });
};

const createAuthorsIfNotPresent = function (authors) {
    let authorFindPromises = [];
    authors.forEach(function (author) {
        if (author._id) {
            authorFindPromises.push(Promise.resolve(author))
            return;
        };

        let foundAuthorPromise = {};
        if (author.email) {
            foundAuthorPromise = authorRepo.findByNameOrEmail(author.name, author.email)
                .then(function (foundUser) {
                    if (foundUser) {
                        return Promise.resolve(foundUser);
                    } else {
                        return authorRepo.createAuthor(author)
                    }
                });
        } else {
            foundAuthorPromise = authorRepo.findByName(author.name).then(function (foundUser) {
                if (foundUser) {
                    return Promise.resolve(foundUser);
                } else {
                    return authorRepo.createAuthor(author);
                }
            });
        }
        ;
        authorFindPromises.push(foundAuthorPromise);
    });
    return authorFindPromises;
};

const getAuthorIds = function (authors) {
    let authorIds = {};
    authors.forEach(function (author) {
        const authorId = author._id || author[0]._id;
        if (!authorIds[authorId]) {
            authorIds[authorId] = authorId;
        }
    });
    return Object.keys(authorIds);
};

/**
 * @swagger
 * /books:
 *    get:
 *      operationId: getBooks
 *      parameters:
 *       -  name: limit
 *          in: query
 *          required: false
 *          description: 'Number of users to be retrieved'
 *          type: integer
 *       -  name: page
 *          in: query
 *          required: false
 *          description: 'Page number from where we want to start fetching books.'
 *          type: integer
 *      tags:
 *        - Book
 *      summary: Retrieves list of books
 *      responses:
 *       200:
 *         description: 'List of books'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                 default: true
 *               data:
 *                  type: object
 *                  properties:
 *                    docs:
 *                      type: array
 *                      items:
 *                        $ref: '#/definitions/Book'
 *                    total:
 *                       type: integer
 *                    limit:
 *                       type: integer
 *                    page:
 *                       type: integer
 *                    pages:
 *                       type: integer
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       404:
 *         description: 'Requested books not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *
 */
exports.getBooks = function (req, res) {

    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

    if (isNaN(page) || isNaN(limit)) {
        sendResponse(res, {message: 'Invalid input.', status: false}, 400);
    }

    bookRepo.findBooks(limit, page).then(function (result) {
        if (!result.docs.length) {
            sendResponse(res, {messgae: 'Could not find books', status: false}, 404);
        } else {
            sendResponse(res, {message: 'Found books', data: result, status: true}, 200);
        }
    }, function (error) {
        sendResponse(res, {messgae: 'Could not fetch books', status: false, error: error}, 500);
    });
};

/**
 * @swagger
 * /book/{bookId}:
 *   get:
 *     operationId: getBookById
 *     summary: Retrieves a book
 *     description: Retrieves book details by id
 *     tags:
 *      - Book
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: The id of book to be retrieved
 *         type: string
 *     responses:
 *       200:
 *         description: 'Book object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/Book'
 *       404:
 *         description: 'Requested book not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *
 *
 *
 */
exports.getBookById = function (req, res) {
    sendResponse(res, {'message': 'Found Book', status: true, data: req.bookSharing.book}, 200);
};


/**
 * @swagger
 * /book:
 *    post:
 *      operationId: addBook
 *      parameters:
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'Book object which needs to be added to the library'
 *          schema:
 *            $ref: '#/definitions/NewBook'
 *      tags:
 *        - Book
 *      summary: Creates a book
 *      responses:
 *       200:
 *          description: 'Book object which is added to the library'
 *          schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                 default: true
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Book'
 *
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 */
exports.post = function (req, res) {

    workflow.emitEvent("book_create_requested", req.body);

    const authors = createAuthorsIfNotPresent(req.body.authors);

    Promise.all(authors).then(function (authors) {

            const authorIds = getAuthorIds(authors);
            req.body.authors = authorIds;

            bookRepo.createBook(req.body).then(function (book) {

                workflow.emitEvent("book_created", book);

                bookRepo.findById(book._id).then(function (populatedBook) {
                        sendResponse(res, {'message': 'Book created', status: true, data: populatedBook}, 200);
                    }, function (err) {
                        sendResponse(res, {'message': 'Could not fetch saved book.', status: false, error: err}, 500);
                    }
                );

            }, function (err) {
                sendResponse(res, {'message': 'Could not save book.', status: false, error: err}, 500);
            }).end();
        },
        function (err) {
            sendResponse(res, {'message': 'Could not save author.', status: false, error: err}, 500);
        }
    );
};


/**
 * @swagger
 * /book/{bookId}:
 *    put:
 *      operationId: put
 *      summary: Updates book details
 *      tags:
 *        - Book
 *      parameters:
 *       -  name: bookId
 *          in: path
 *          required: true
 *          description: 'Id of the book to be modified'
 *          type: string
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'Book object details which needs to be updated'
 *          schema:
 *            type: object
 *            $ref: '#/definitions/NewBook'
 *      responses:
 *       200:
 *         description: 'Updated book object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/Book'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       404:
 *         description: 'Requested book not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *
 */
exports.put = function (req, res) {

    workflow.emitEvent("book_update_requested", req.body);

    const updateBook = function() {
        bookRepo.updateBook(req.body, req.bookSharing.book).then(function (updatedBook) {

            workflow.emitEvent("book_updated", updatedBook);

            bookRepo.findById(updatedBook._id).then(function (fetchedBook) {
                sendResponse(res, {'message': 'Updated Book', status: true, data: fetchedBook}, 200);
            }, function (err) {
                sendResponse(res, {'message': 'Could not fetch updated book.', status: false, error: err}, 500);
            }).end();

        }, function (err) {
            sendResponse(res, {'message': 'Could not update book', status: false, error: err}, 500);
        }).end();
    }

    if(req.body.authors) {
        const authors = createAuthorsIfNotPresent(req.body.authors);
        Promise.all(authors).then(function (newAuthors) {
            if(newAuthors) {
                const authorIds = getAuthorIds(newAuthors);
                req.body.authors = authorIds;
            } else {
                req.body.authors = undefined;
            }
            updateBook();
        }, function(err) {
            sendResponse(res, {'message': 'Could not save author.', status: false, error: err}, 500);
        });
    } else {
        updateBook();
    }
}


/**
 * @swagger
 * /book/{bookId}:
 *    delete:
 *      operationId: delete
 *      summary: Deletes book details
 *      tags:
 *        - Book
 *      parameters:
 *       -  name: bookId
 *          in: path
 *          required: true
 *          description: 'Id of the book to be modified'
 *          type: string
 *      responses:
 *       200:
 *         description: 'Deleted book object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/DeletedBook'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       404:
 *         description: 'Requested book not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *
 */
exports.delete = function (req, res) {
    const book = req.bookSharing.book;
    bookRepo.deleteBook(book._id).then(function (deletedBook) {
        sendResponse(res, {'message': 'Deleted Book', status: true, data: deletedBook}, 200);
    }, function (err) {
        sendResponse(res, {'message': 'Could not delete book.', status: false, error: err}, 500);
    });
};


