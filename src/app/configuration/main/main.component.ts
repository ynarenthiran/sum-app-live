import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { Router, ActivatedRoute, NavigationEnd, UrlSegment, Route } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cfg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  steps: Route[] = [];

  constructor(private srv: ConfigurationService, private router: Router, private route: ActivatedRoute) {
    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .forEach(e => {
        this.onNavigationEnd();
      });
  }

  ngOnInit() {
  }

  onNodeSelected(node: Route) {
    this.srv.nodeSelected.emit(node);
  }

  onStepNavigate(index: number) {
    let path = this.srv.path.value.split("/").slice(0, index * 2 + 1).join("/");
    this.router.navigate([path], { relativeTo: this.route });
  }

  private onNavigationEnd() {
    let path = this.getPath(this.route).map((url) => url.path).join("/");
    this.srv.path.next(path);
    this.steps = this.getSteps(this.route);
  }
  private getPath(route: ActivatedRoute): UrlSegment[] {
    var url = route.snapshot.url;
    route.children.forEach((r) => {
      url = url.concat(this.getPath(r));
    });
    return url;
  }
  private getSteps(route: ActivatedRoute): Route[] {
    var steps = [];
    if (route.routeConfig.data) {
      steps.push(route.routeConfig);
    }
    route.children.forEach((r) => {
      steps = steps.concat(this.getSteps(r));
    });
    return steps;
  }
}
