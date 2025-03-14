
// AppError inherits from the built-in Error class.
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);// Call the parent Error class constructor with the message

    this.statusCode = statusCode;

    // Determine if the error is a client (4xx) or server (5xx) error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    //This helps in differentiating between expected and unexpected errors.
    this.isOperational = true;

    /**
     * Capture the stack trace (removes constructor call from stack trace).
     * This ensures the error message starts from where it was actually thrown,
     * making debugging easier.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
