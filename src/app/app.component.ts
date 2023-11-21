import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title: string;
  constructor() {
    this.title = $localize`'Spring Boot - Angular Application'`;
  }

  ngOnDestroy(): void {
    window.alert("destroy");
  }
}