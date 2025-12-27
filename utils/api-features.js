export class ApiFeatures {
  constructor(mongooseQuery, QueryString) {
    this.mongooseQuery = mongooseQuery;
    this.QueryString = QueryString;
  }

  // 1) Filtering
  filter() {
    const queryStringObject = { ...this.QueryString };
    const excludeFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
    excludeFields.forEach((field) => delete queryStringObject[field]);
    // Apply Filtering for gt, gte, lt, lte, in
    let queryString = JSON.stringify(queryStringObject);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    const queryStringObjectFinal = JSON.parse(queryString);
    this.mongooseQuery = this.mongooseQuery.find(queryStringObjectFinal);
    return this;
  }

  // 2) Sorting
  sort() {
    if (this.QueryString.sort) {
      const sortBy = this.QueryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  // 3) Field limiting
  limitFields() {
    if (this.QueryString.fields) {
      const fields = this.QueryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  // 4) Search
  search(modelName) {
    if (this.QueryString.keyword) {
      const { keyword } = this.QueryString;
      const query = {};
      if (modelName === 'Product') {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      } else {
        query.name = { $regex: keyword, $options: 'i' };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  // 5) Pagination
  paginate(documentsCount) {
    const page = this.QueryString.page * 1 || 1;
    const limit = this.QueryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const currentPageEndIndex = page * limit;

    //Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(documentsCount / limit);

    //next page
    if (currentPageEndIndex < documentsCount) {
      pagination.next = page + 1;
    }
    //previous page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}
