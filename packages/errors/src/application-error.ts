export class ApplicationError extends Error {
    statusCode: number;
    data?: any;
    description?: string;

    constructor(message) {
        super(message);
        this.name = 'Application Error';
        this.statusCode = 500;
    }

    /**
     * Attach diagnostics data to an error
     * @param data arbitrary object
     */
    setData(data: any) {
        this.data = data;
        return this;
    }

    /**
     * Set error status code
     */
    setStatus(statusCode: number) {
        this.statusCode = statusCode;
        return this;
    }

    /**
     * Set detailed message about the error
     */
    setDescription(description: string) {
        this.description = description;
        return this;
    }
}
