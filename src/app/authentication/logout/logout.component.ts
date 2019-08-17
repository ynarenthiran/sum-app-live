import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signIn();
  }

  signIn() {
    this.afAuth.auth.signOut()
      .catch((error) => {
        this.snackBar.open(error.message, undefined, {
          duration: 5000,
        });
      })
      .then(() => {
        this.snackBar.open('You are logged out', 'Login', {
          duration: 5000,
        }).afterDismissed().subscribe((dismiss) => {
          if (dismiss.dismissedByAction)
            this.router.navigate(['/']);
        })
      });
  }

}
