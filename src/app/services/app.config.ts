import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';

export interface AppConfig {
  accountId: string;
}
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig;

  constructor(private db: AngularFirestore) { }

  loadConfig() {
    const host = window.location.host;
    if (host.startsWith("localhost")) {
      return new Promise((resolve, reject) => {
        this.config = environment.config;
        resolve();
      });
    }
    else {
      const name = host.split(":")[0];
      return this.db.collection("accounts", ref => ref.where('name', '==', name))
      .get()
      .toPromise()
      .then(value => {
        this.config = { accountId: value.docs[0].id };
      });
    }
  }

  getConfig() {
    return this.config;
  }
}