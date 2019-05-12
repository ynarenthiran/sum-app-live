import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User = null;

  constructor(private af: AngularFireAuth) {
    this.af.authState.subscribe((auth) => {
      this.user = auth;
    })
  }

  get authenticated(): boolean {
    return this.user != null;
  }

  get currentUser(): Observable<firebase.User> {
    return this.af.authState;
  }

  get currentUserId(): string {
    return this.user.uid;
  }

  get currentUserData(): firebase.User {
    return this.user;
  }
}
