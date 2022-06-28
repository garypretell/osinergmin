import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, map, retry } from 'rxjs/operators';

export class AppError {
    public status = 0;
    constructor(originalError?: any, public message?: any) { }
}

export class NotFoundError extends AppError { }

export class ConflictError extends AppError { }

export class InternalServerError extends AppError {
    constructor(public originalError?: any) {
        super(originalError);
        this.status = 500;
    }
}

export class BusinessError extends AppError {
    constructor(public originalError?: any, public override message?: any) {
        super(originalError, message);
        this.status = 900;
    }

    get errors(): any {
        if (this.originalError) {
            return this.originalError;
        }

        return null;
    }
}

export class BadRequestError extends AppError {
    constructor(public originalError?: any) {
        super(originalError);
    }

    get errors(): any {
        if (this.originalError) {
            return this.originalError;
        }

        return null;
    }
}

export class OptionsRequest {
    headers?:
        | HttpHeaders
        | {
            [header: string]: string | Array<string>;
        };
    observe?: 'body';
    params?: {};
    responseType?: 'json';
    preloader?: boolean;
    reportProgress?: boolean;
    withCredentials?: boolean;
    retry?: number;
    default?: any;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly pipes = [];

    constructor(private readonly httpClient: HttpClient) { }

    get<T>(endPoint: string, options?: any): Observable<T> {
        this.beforeRequest(options.preloader || false);

        const request: any = this.getUrlAndParameters(endPoint, options);

        const pipes = this.getPipesDefault(options);
        if (options.retry !== undefined) {
            pipes.push(retry(options.retry));
        }
        if (options.default !== undefined) {
            pipes.push(map(result => result || options.default));
        }

        // return this.httpClient.get<T>(request.url, request.options).pipe(...pipes);
        return pipes
            .reduce((obs, op) => obs.pipe(op), (this.httpClient.get<T>(request.url, request.options)))
            .pipe(distinctUntilChanged());
    }

    post<T>(endPoint: string, body: any, options: OptionsRequest = {}): Observable<T> {
        this.beforeRequest(options.preloader || false);

        const request: any = this.getUrlAndParameters(endPoint, options);

        const pipes = this.getPipesDefault(options);

        // return this.httpClient.post<T>(request.url, body, request.options).pipe(...pipes);
        return pipes
            .reduce((obs, op) => obs.pipe(op), (this.httpClient.post<T>(request.url, body, request.options)))
            .pipe(distinctUntilChanged());

    }

    private getPipesDefault(options?: any): Array<any> {
        const pipes = [];

        pipes.push(catchError((err: any) => this.onCatch(err)));
        pipes.push(
            finalize(() => {
                this.onFinally(options.preloader);
            })
        );

        return pipes;
    }

    private onCatch(error: any): Observable<any> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            // tslint:disable-next-line: no-shadowed-variable
            const messageError = `An error occurred: ${error.error.message}`;
            // this.notifyService.addError(`Error: ${messageError}`);

            return throwError(error);
        }
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        const messageError: string =
            `` + `Backend returned code ${error.status},` + `body was: ${error.error}` + `\nMessage: ${error.message}`;
        // this.notifyService.addErrorWithData(`Error: ${messageError}`, error);

        return this.handleError(error);
    }

    private isParameterInPath(endPoint: string, parameterKey: string): boolean {
        return !(endPoint.indexOf(`{${parameterKey}}`) === -1);
    }

    private getUrlAndParameters(url: string, optionsRequest: any): { url?: string; options?: OptionsRequest } {
        const options: OptionsRequest = new OptionsRequest();
        let paramsQuery = new HttpParams();

        if (optionsRequest.params) {
            Object.keys(optionsRequest.params).forEach((parameterKey: string) => {
                if (this.isParameterInPath(url, parameterKey)) {
                    // tslint:disable-next-line: no-parameter-reassignment
                    url = url.replace(`{${parameterKey}}`, optionsRequest.params[parameterKey]);
                } else {
                    paramsQuery = paramsQuery.append(parameterKey, optionsRequest.params[parameterKey]);
                }
            });
        }

        options.params = paramsQuery;
        options.headers = optionsRequest.headers;

        return {
            url,
            options
        };
    }


    private beforeRequest(preloader: boolean): void {
        if (preloader) {
            // this.notifyService.showPreloader();
        }
    }

    private afterRequest(preloader: boolean): void {
        if (preloader) {
            //   this.notifyService.hidePreloader();
        }
    }

    private onFinally(preloader: boolean = false): void {
        // this.notifyService.consoleLog('onFinally-Log');
        this.afterRequest(preloader);
    }


    private handleError(error: HttpErrorResponse): any {
        switch (error.status) {
            case 400:
                return throwError(new BadRequestError(error));
            case 404:
                return throwError(new NotFoundError());
            case 409:
                return throwError(new ConflictError());
            case 500:
                return throwError(new InternalServerError(error));
            case 900:
                return throwError(new BusinessError(error, error.error.mensaje));
            default:
                return throwError(new AppError(error));
        }
    }

}
