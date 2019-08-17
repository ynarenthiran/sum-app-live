import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { auth } from 'firebase';
import { AccountService } from 'src/app/services/account.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'lib-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private hide = true;
  private emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  private passwordFormControl = new FormControl('', []);

  constructor(private auth: AngularFireAuth, private router: Router, private zone: NgZone,
    private srv: AccountService, private snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  signIn() {
    this.onSignIn(
      this.auth.auth.signInWithEmailAndPassword(this.emailFormControl.value, this.passwordFormControl.value));
  }

  signInWithGoogle() {
    this.onSignIn(
      this.signInWithProvider(new auth.GoogleAuthProvider()));
  }
  signInWithFacebook() {
    this.onSignIn(
      this.signInWithProvider(new auth.FacebookAuthProvider()));
  }
  signInWithTwitter() {
    this.onSignIn(
      this.signInWithProvider(new auth.TwitterAuthProvider()));
  }
  signInWithGithub() {
    this.onSignIn(
      this.signInWithProvider(new auth.GithubAuthProvider()));
  }

  private signInWithProvider(provider: auth.AuthProvider): Promise<auth.UserCredential> {
    return this.auth.auth.signInWithPopup(provider);
  }

  onSignIn(promise: Promise<auth.UserCredential>) {
    promise
      .catch((error) => {
        this.snackBar.open(error.message, undefined, {
          duration: 5000,
        });
      })
      .then((credential) => {
        if (credential)
          this.srv.setUserRegistration(credential.user.uid);
        this.zone.run(() => {
          // Navigate to the redirectUrl or '/'
          const redirectUrl = this.route.snapshot.queryParams.redirectUrl;
          if (redirectUrl) {
            this.router.navigateByUrl(decodeURI(redirectUrl));
          }
          else {
            this.router.navigate(['/']);
          }
        });
      });
  }
}
