import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';



@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  connection$: WebSocketSubject<any>;

  constructor() { }

  connect(folio:string): Observable<any> {
    this.connection$ = webSocket({
      url: `${env.socket_endpoint}/formulario/${folio}`,
      deserializer: ({data}) => data,
    });
    return this.connection$;
  }

  send(data: any): void {
    if (this.connection$) {
      this.connection$.next(data);
    } else {
      console.log('Did not send data, unable to open connection');
    }
  }

  closeConnection(): void {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$= null;
    }
  }

  ngOnDestroy() {
    this.closeConnection();
  }
}
