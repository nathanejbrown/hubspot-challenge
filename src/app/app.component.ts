import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubspotHttpservice } from './services/hubspot-httpservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

/**
 * Just for the record, building everything in the app component is a bad idea. 
 * But for these purposes, it made the most sense. 
 */
export class AppComponent {
  title = 'hubspot-challenge-Nathan-Brown';

  initialData: any;
  formattedData: any;
  displayFormatOptions: boolean = false;

  constructor(
    private hubspotHttpService: HubspotHttpservice
  ) {}

  getInitialData(): void {
    this.hubspotHttpService.getInitialData().subscribe(data => {
      if (data) {
        this.initialData = JSON.stringify(data);
        setTimeout(() => {
          this.displayFormatOptions = true;
        }, 800);
      }
    })
  }

  handleClick(): void {
    this.formattedData = 'testing 123';
  }
}
