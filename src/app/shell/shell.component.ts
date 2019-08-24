import { Component, OnInit, Injectable } from '@angular/core';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppConfigService } from '../services/app.config';
import { flatMap, map, tap } from 'rxjs/operators';

interface AppEntry {
  icon: string;
  path: string;
  label: string;
  active?: boolean;
}
interface Notification {
  id: string;
  collaborationId: string;
  objPath: string;
  objId: string;
  createdByUid: string;
  changedByUid: string;
  createdOn: Date
  changedOn: Date
  who: User;
  when: Date;
  what: string;
  whatIcon: string;
}
interface User {
  id: string;
  displayName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShellService {
  title: string;

  subtitle: string;

  constructor() { }
}

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  private apps: AppEntry[] = [
    { icon: 'dashboard', path: 'dashboard', label: 'Dashboards' },
    { icon: 'question_answer', path: 'collaboration', label: 'Collaborations' },
    { icon: 'settings', path: 'configuration', label: 'Configuration' }
  ];
  private isPanelMin: boolean = true;
  private isRightPanelVisible: boolean = false;
  private notifications$: Observable<Notification[]>;
  private notificationsCount: number;

  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private srv: ShellService,
    private db: AngularFirestore, private config: AppConfigService) {
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.srv.title = "";
          this.srv.subtitle = "";
          const data = this.route.firstChild.routeConfig.data;
          if (data) {
            if (data.title)
              this.srv.title = data.title;
            if (data.subtitle)
              this.srv.subtitle = data.subtitle;
          }
          this.updateAppStatus();
        }
      })
    );
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openApplicationPath(path: string) {
    this.router.navigate([path]);
  }

  logoff() {
    this.router.navigate(['auth', 'logout']);
  }

  openNotificationPanel() {
    this.isRightPanelVisible = true;
  }

  openAdmin() {
    window.open('https://admin.sum-app.com', '_blank')
  }

  private updateAppStatus() {
    this.apps.forEach((app) => {
      const route =
        this.route.children.find((route) => route.routeConfig.path == app.path);
      app.active = (route ? true : false);
    });
  }

  private loadNotifications() {
    const accountId = this.config.getConfig().accountId;
    this.notifications$ = this.db.collection<Notification>(`accounts/${accountId}/notifications`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const notif = Object.assign(a.payload.doc.data(), { id: a.payload.doc.id }) as Notification;
          const when = (notif.changedOn) ? notif.changedOn : notif.createdOn;
          const userId = (notif.changedByUid) ? notif.changedByUid : notif.createdByUid;
          var what = '', whatIcon = '';
          switch (notif.objPath) {
            case 'documents': whatIcon = 'insert_drive_file'; break;
            case 'members': whatIcon = 'person'; break;
            case 'posts': whatIcon = 'comment'; break;
          }
          return this.db.doc<User>(`users/${userId}`)
            .snapshotChanges()
            .pipe(
              map(action => {
                const user = action.payload.data() as User;
                return Object.assign(notif, { who: user, when: when, what: what, whatIcon: whatIcon }) as Notification;
              })
            );
        })),
        flatMap(notifications => combineLatest(notifications)),
        tap(notifications => {
          this.notificationsCount = notifications.length;
        })
      );
  }
}
