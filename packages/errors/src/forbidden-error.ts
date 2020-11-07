import { ApplicationError } from './application-error';

export class ForbiddenError extends ApplicationError {
    constructor(message = 'forbidden') {
        super(message);
        this.name = 'Forbidden';
        this.statusCode = 403;
    }
}
