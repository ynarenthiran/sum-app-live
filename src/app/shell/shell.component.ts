import { Component, OnInit, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../authentication/auth.service';

interface AppEntry {
  icon: string;
  path: string;
  label: string;
  active?: boolean;
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

  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private srv: ShellService) {
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.srv.title = "";
          this.srv.subtitle = "";
          this.updateAppStatus();
        }
      })
    );
  }

  ngOnInit() {
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

  private updateAppStatus() {
    this.apps.forEach((app) => {
      const route =
        this.route.children.find((route) => route.routeConfig.path == app.path);
      app.active = (route ? true : false);
    });
  }
}
