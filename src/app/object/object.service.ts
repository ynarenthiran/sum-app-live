import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app.config';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(private config: AppConfigService, private func: AngularFireFunctions) { }

  getObjectTypeDefinition(id: string): Observable<any> {
    const callable = this.func.httpsCallable('getObjectTypeDefinition');
    const accountId = this.config.getConfig().accountId;
    return callable({ accountId: accountId, objectTypeId: id });
  }
}