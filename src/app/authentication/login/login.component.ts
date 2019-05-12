import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase';

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

  constructor(private auth: AngularFireAuth, private router: Router, private zone: NgZone) { }

  ngOnInit() {
  }

  signIn() {
    this.auth.auth.signInWithEmailAndPassword(this.emailFormControl.value, this.passwordFormControl.value)
      .catch((error) => {
        window.alert(error.message);
      })
      .then(() => {
        this.zone.run(() => {
          this.router.navigate(['/']);
        });
      });
  }

  signInWithGoogle() {
    this.signInWithProvider(new auth.GoogleAuthProvider());
  }
  signInWithFacebook() {
    this.signInWithProvider(new auth.FacebookAuthProvider());
  }
  signInWithTwitter() {
    this.signInWithProvider(new auth.TwitterAuthProvider());
  }
  signInWithGithub() {
    this.signInWithProvider(new auth.GithubAuthProvider());
  }

  private signInWithProvider(provider: auth.AuthProvider) {
    this.auth.auth.signInWithPopup(provider)
      .catch((error) => {
        window.alert(error.message);
      })
      .then(() => {
        this.zone.run(() => {
          this.router.navigate(['/']);
        });
      });
  }
}
