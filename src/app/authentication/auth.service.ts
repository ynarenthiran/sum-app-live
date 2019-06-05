import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest, of } from 'rxjs';
import { AccountService } from '../services/account.service';
import { map, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User = null;

  constructor(private af: AngularFireAuth, private srv: AccountService) {
  }

  isAuthenticated(): Observable<boolean> {
    return this.af.authState.pipe(
      flatMap((user) => {
        this.user = user;
        if (user)
          return this.srv.getUserRegistration(user.uid);
        else
          return of(false);
      })
    );
  }

  get currentUserId(): string {
    return this.user.uid;
  }

  get currentUserData(): firebase.User {
    return this.user;
  }
}
