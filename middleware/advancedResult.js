const advancedResults = (model, populate) => async (req, res, next) => {
    // Filltering   
    let query;

    // copy req.query
    const reqQuery = {...req.query };

    // Fields to exclude(when don't what match a filed in the document)
    const removeFields = ['select','sort','page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])


        // set the query into string
        let queryStr = JSON.stringify(reqQuery)
        //  Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        // set query to Bootcapme.find() & pass it into bootcamp.find and set it back to JSON || finding resource
        query = model.find(JSON.parse(queryStr));

        // select fields
        if(req.query.select){
            const fields =req.query.select.split(',').join(' ');
           query = query.select(fields)
        }

        // Sort 
        if(req.query.sort){
            const sortBy =req.query.sort.split(',').join(' ');
           query = query.sort(sortBy)
        } else {
            query = query.sort('-createedAt')
        }

        // Pagination 
        // setting the value to a number and it takes another parameter which is 10 || a default of 1.
        const page = parseInt(req.query.page, 10) ||1;
        const limit =parseInt(req.query.limit, 10) || 25; //100 per page
        const startIndex = (page - 1) * limit;  // to get the start of the page 
        const endIndex =page * limit ;   // to get the end of the page  
        const total = await model.countDocuments(); // to get the total number of document

        query = query.skip(startIndex).limit(limit);

       //  adding populate methods
        if(populate) {
            query = query.populate(populate)
        }
        // Executing query
        const results = await query; 

        // Pagination result 
         const pagination = {};
        // if there is no next page i don't want to show pagination
         if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
         }
        //  pervious pagination 
         if(startIndex > 0) {
             pagination.prev = {
                 page: page - 1,
                 limit  
             }
         }

         res.advancedResults = {
             success: true,
             count: results.length,
             pagination,
             data: results
         }

         next()
}

export default advancedResults;