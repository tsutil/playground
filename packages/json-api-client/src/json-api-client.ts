import fetch from 'node-fetch';
import { ApplicationError } from '@tsutil/errors';
import { buildUrl } from '@tsutil/utils';
import { createLogger } from '@tsutil/logger';
import type { Response } from 'node-fetch';

const logger = createLogger('http-client');

export interface RequestResult {
    url: string;
    status: number;
    duration?: number;
    headers: any;
    success: boolean;
    data: any;
    error?: ApplicationError;
}

export interface ExecuteRequestOptions {
    method?: string;
    headers?: { [key: string]: any };
    query?: { [key: string]: any };
    body?: any;
    timeout?: number;
}


export type OnCompletedHandler = (response: RequestResult) => Promise<any>;
export interface JsonApiClientOptions extends ExecuteRequestOptions {
    baseUrl: string;
    onCompleted?: OnCompletedHandler;
}

/**
 * Syntaxic sugar for consuming json apis, result is serialization-friendly
 */
export class JsonApiClient {
    private _defaultOpt: ExecuteRequestOptions;
    private _baseUrl: string;
    private _onCompleted?: OnCompletedHandler;

    constructor(opt?: JsonApiClientOptions) {
        this._baseUrl = opt?.baseUrl;
        this._onCompleted = opt?.onCompleted;
        this._defaultOpt = {
            method: 'get',
            ...opt,
            headers: {
                'Content-Type': 'application/json',
                ...opt?.headers,
            }
        };
    }
    async executeRequest(
        url: string,
        opt?: ExecuteRequestOptions,
    ): Promise<RequestResult> {
        opt = {
            ...this._defaultOpt,
            ...opt,
            query: {
                ...this._defaultOpt.query,
                ...opt?.query,
            },
            headers: {
                ...this._defaultOpt.headers,
                ...opt?.headers
            }
        };
        const uri = buildUrl(this._baseUrl, url, opt.query);
        opt.body = opt.body != null
            && typeof opt.body != 'string'
            && JSON.stringify(opt.body)
            || opt.body;

        logger.debug(`about to call external api`, {
            method: opt.method,
            uri,
        });

        let response: Response;
        let result: RequestResult;
        let data: any;
        let error: ApplicationError;
        let startTime = Date.now();
        try {
            response = await fetch(uri, opt);
            data = await response.json();
        } catch (err) {
            error = err;
        } finally {
            const duration = Date.now() - startTime;
            result = {
                url: response.url,
                headers: response.headers,
                duration,
                status: response?.status,
                success: response?.status >= 200 && response?.status < 300,
                data,
                error,
            };
            logger.info(`http request completed (${response?.status})`, { result });

            if (typeof this._onCompleted === 'function') {
                await this._onCompleted(result);
            }
        }
        return result;
    }
}
