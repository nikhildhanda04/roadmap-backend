const errorHandler = (err, req, res, next)=> {
    const statusCode = res.statusCode ? res.statusCode: 500;

    switch(statusCode){
        case (400):
            res.json({title: "VALIDATION ERROR", message: err.message, stackTrace: err.stack});
        break;

        case (404):
            res.json({title: "NOT FOUND", message: err.message, stackTrace: err.stack})
        break;

        case(401):
            res.json({title:"AUTHORIZATION ERROR", message: err.message, stackTrace: err.stack})
        break;

        case(403):
            res.json({title: "FORBIDDEN REQ", message: err.message, stackTrace: err.stack})
        break;
        
        default:
            console.log("No Errors Found");
        break;
            
    }

};

module.exports = errorHandler;
