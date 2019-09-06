import { OnInit, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { FormComponent } from '../dialog/form.component';


interface User {
  id: string;
  displayName: string;
  lastName: string;
  personalInfo: string;
  email: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild(FormComponent)
  form: FormComponent;

  private user$: Observable<User>;

  constructor(private db: AngularFirestore, private auth: AuthService) { }

  ngOnInit() {
    this.user$ = this.getUser();
  }

  getUser(): Observable<User> {
    const userId = this.auth.currentUserId;
    return this.db.doc<User>(`users/${userId}`)
      .snapshotChanges()
      .pipe(
        map(a => {
          const user = a.payload.data() as User;
          const id = a.payload.id;
          return Object.assign(user, { id: id }) as User;
        })
      );
  }

  saveUser() {
    alert("Hello " + this.form.getData().displayName);
  }


  firstName: string = "Rajnish"
  lastName: string = "Tiwari"
  personalInfo: string = "Cloud Developer"
  social1: string = "linkdin"
  social2: string = "facebook"
}
