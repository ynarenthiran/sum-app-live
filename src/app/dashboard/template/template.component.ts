import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { interval, Observable, config } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';
import { AppConfigService } from 'src/app/services/app.config';

@Component({
  selector: 'app-dashboard-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  current: Observable<Date>;
  greetings: string;
  accountId: string;

  constructor(private auth: AuthService, private config: AppConfigService) { }

  ngOnInit() {
    this.accountId = this.config.getConfig().accountId;
    this.current = interval(1000).pipe(
      map(() => new Date())
    );
    this.updateGreetings();
    interval(10000).subscribe(() => this.updateGreetings());
  }

  updateGreetings() {
    const currentHour = moment().hour();
    if (currentHour >= 12 && currentHour <= 17) this.greetings = "Good Afternoon";
    else if (currentHour <= 18) this.greetings = "Good Evening";
    else this.greetings = "Good Morning";
  }

  createCollaboration() {

  }
}
