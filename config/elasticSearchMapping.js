'use strict';
const elasticSearchMapping = {
    index: 'booksharing',
    mappings: {
        bookTransaction: {
            properties: {
                event: {
                    type: 'string',
                    index: 'not_analyzed'
                },
                createdAt: {
                    type: 'date'
                }

            }
        },
        book: {
            _parent: {
                type: 'bookTransaction'
            },
            properties: {
                name: {
                    type: 'string',
                    copy_to: 'name_exact'
                },
                name_exact: {
                    type: 'string',
                    index: 'not_analyzed'
                },
                publishedOn: {
                    type: 'date'
                },
                authors: {
                    type: 'nested',
                    properties: {
                        name: {
                            type: 'string',
                            copy_to: 'name_exact'
                        },
                        name_exact: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        email: {
                            type: 'string',
                            index: 'not_analyzed'
                        }
                    }
                },
                comments: {
                    type: 'nested',
                    properties: {
                        body: {
                            type: 'string'
                        },
                        createdBy: {
                            type: 'nested'
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                },
                publisher: {
                    properties: {
                        name: {
                            type: 'string',
                            copy_to: 'name_exact'
                        },
                        name_exact: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        address: {
                            properties: {
                                stree1: {
                                    type: 'string'
                                },
                                street2: {
                                    type: 'string'
                                },
                                country: {
                                    type: 'string'
                                },
                                city: {
                                    type: 'string'
                                },
                                state: {
                                    type: 'string'
                                },
                                zip: {
                                    type: 'string',
                                    index: 'not_analyzed'
                                }
                            }
                        },
                        urls: {
                            type: 'string'
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                },
                isbn13: {
                    type: 'string',
                    index: 'not_analyzed'
                },
                isbn10: {
                    type: 'string',
                    index: 'not_analyzed'
                },
                tags: {
                    type: 'string'
                },
                createdAt: {
                    type: 'date'
                },
                updatedAt: {
                    type: 'date'
                }
            }

        },
        relatedUser: {
            _parent: {
                type: 'bookTransaction'
            },
            properties: {
                username: {
                    type: 'string'
                },
                email: {
                    type: 'string',
                    index: 'not_analyzed'
                },
                password: {
                    type: 'string',
                    index: 'no'
                },
                roles: {
                    type: 'nested',
                    properties: {
                        name: {
                            type: 'string',
                            index: 'not_analyzed'
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                },
                createdAt: {
                    type: 'date'
                },
                updatedAt: {
                    type: 'date'
                }
            }
        }

    }
};


module.exports = elasticSearchMapping;
