import { ApplicationError } from './application-error';

export class BadRequestError extends ApplicationError {
    constructor(message = 'invalid_input') {
        super(message);
        this.name = 'Bad Request';
        this.statusCode = 400;
    }
}
