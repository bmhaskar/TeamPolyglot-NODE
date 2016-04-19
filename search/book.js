'use strict';

const searchUtil = require('../utils/search');

class BookSearch {

  mostReadBooks(numOfBooks, page, limit) {

    const body = {
      "query": {
        "bool": {
          "must": [
            {
              "term": {
                "event": "read"
              }
            }

          ],
          "must_not": [],
          "should": []
        }
      },
      "from": 0,
      "sort": [],
      "size": 1,
      "aggs": {
        "by_relatedBook": {
          "terms": {
            "field": "relatedBook._id",
            "size": numOfBooks,
            "order": {"_count": "desc"}
          }
        }
      }
    };


    return searchUtil.search({}, body)
      .then((data) => {

        let bookNoOfTimesReadData = {};

        data.aggregations.by_relatedBook.buckets.forEach(function (bucket) {
          bookNoOfTimesReadData[bucket.key] = bucket.doc_count;
        });

        let selectedBookIds =  Object.keys(bookNoOfTimesReadData);

        const noOfBooksToBeSkipped = limit * (page-1);
        const indexOfLastBook = (noOfBooksToBeSkipped + limit >  selectedBookIds.length)
          ? selectedBookIds.length: limit;
        selectedBookIds = selectedBookIds.splice(noOfBooksToBeSkipped,indexOfLastBook);


        return this.getBooksInfo(selectedBookIds).then((result) => {
          result.pages = parseInt(result.total/limit) || 1;
          result.page = page;
          result.limit = limit;
          return result;
        });
      })
  }


  getBooksInfo(books) {
    const body = {
      "query": {
        "bool": {
          "must": {
            "match": {"event": "lent"}
          },
          "should": [
            {
              "terms": {
                "relatedBook._id": books

              }
            }
          ]
        }
      }
    };
    return searchUtil.search({}, body)
      .then(searchUtil.parseSearchResult)
      .then((bookTransactions) => {
         let result = {total: bookTransactions.total};
         result.docs = bookTransactions.hits.map((bookTransaction) => {
            return bookTransaction._source.relatedBook
         });
         return result;
      });
  };
};

module.exports = new BookSearch();

