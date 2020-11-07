import { ApplicationError } from './application-error';

export class DomainError extends ApplicationError {
    constructor(message) {
        super(message);
        this.name = 'Bad Request';
        this.statusCode = 400;
    }
}
