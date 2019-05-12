import { Component, OnInit } from '@angular/core';
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

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }

  signIn() {
    this.auth.auth.signInWithEmailAndPassword(this.emailFormControl.value, this.passwordFormControl.value)
      .catch((error) => {
        window.alert(error.message);
      })
      .then(() => {
        this.router.navigate(['/']);
      });
  }

  signInWithGoogle() {
    this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  signInWithFacebook() {
    this.auth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }
  signInWithTwitter() {
    this.auth.auth.signInWithPopup(new auth.TwitterAuthProvider());
  }
  signInWithGithub() {
    this.auth.auth.signInWithPopup(new auth.GithubAuthProvider());
  }
}
