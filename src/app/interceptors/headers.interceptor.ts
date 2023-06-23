import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // request = request.clone({
    //   setHeaders: {
    //     'Cache-Control': 'no-cache',
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json, text/csv',
    //     'Access-Control-Allow-Origin': '*',
    //     Authorization: 'Bearer ' + accessToken,
    //     RequestFrom: 'ItAdminPortal',
    //     DeviceId: deviceId,
    //     ProfileId: profileId,
    //     server_version: '36',
    //     client_type: 'it_admin',
    //     client_version: environment.version,
    //     platform: 'web',
    //     TimeZone: timeZone,
    //     offset: offset,
    //     isFusionAuthLogin: isFusionAuth,
    //   },
    // });

    return next.handle(request);
  }
}
