import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  if (!statusCode) statusCode = 500;
  if (!message) message = "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
  });
};

export default errorHandler;
