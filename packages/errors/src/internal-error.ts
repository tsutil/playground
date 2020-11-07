import { ApplicationError } from './application-error';

export class InternalError extends ApplicationError {
    constructor(message = 'internal_error') {
        super(message);
        this.name = 'Internal Error';
        this.statusCode = 500;
    }
}
