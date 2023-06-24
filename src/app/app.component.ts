//@ts-nocheck
import { Component } from '@angular/core';
import { HubspotHttpservice } from './services/hubspot-httpservice.service';
import { DateTime } from 'luxon';

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
  allCountries: string[] = [];

  constructor(
    private hubspotHttpService: HubspotHttpservice
  ) {}

  getInitialData(): void {
    this.hubspotHttpService.getInitialData().subscribe(data => {
      if (data) {
        this.initialData = JSON.stringify(data);
        this.findAllCountriesAndDates(data);
      }
    })
  }

  findAllCountriesAndDates(list: any) {
    let allCountries = {};

    //Build an object with each country as a key, and an associated array of all dates for that country
    list.forEach((partner: any) => {
      let isValidPartner = partner.availableDates.filter((date: string, i: number) => {
        if (DateTime.fromISO(date).plus({days: 1}).toMillis() === DateTime.fromISO(partner.availableDates[i + 1]).toMillis() ||
        DateTime.fromISO(date).minus({days: 1}).toMillis() === DateTime.fromISO(partner.availableDates[i - 1]).toMillis()) {
          return true;
        } else {
          return false;
        }
      }).length > 0

      if (isValidPartner) {
        if (!allCountries[partner.country]) {
          allCountries[partner.country] = partner.availableDates;
        } else {
          allCountries[partner.country] = allCountries[partner.country].concat(partner.availableDates).sort();
        }
      }
    })

    //Create an object with each country as a key, containing an object with keys for each date. The value of each
    //is the total number of people who have that specific date available.
    let countriesMostCommonDates = {};
    Object.keys(allCountries).forEach(country => {
      let datesByMostAvailable = {}
      allCountries[country].forEach(date => {
        if (!datesByMostAvailable[date]) {
          datesByMostAvailable[date] = 1
        } else {
          datesByMostAvailable[date]++
        }
      })
      countriesMostCommonDates[country] = datesByMostAvailable;
    });
    
    //Iterate over the object from above, and call a separate function to determine which date is the most common. 
    Object.keys(countriesMostCommonDates).forEach(country => {
      countriesMostCommonDates[country] = this.findMostCommonDate(countriesMostCommonDates[country], country)
    })

    this.matchPeopleToAvailableDays(countriesMostCommonDates, list)
  }

  matchPeopleToAvailableDays(countriesWithDates: {}, allPartners): void {
    let request = {
      countries: []
    }
    //build the request object by checking attendees available dates and determining if they have 
    //A: the most common day for that country available, and B: the day after it. 
    Object.keys(countriesWithDates).forEach(country => {
      let attendees = [];
      allPartners.forEach(partner => {
        if (partner.country === country 
          && partner.availableDates.includes(countriesWithDates[country]) 
          && partner.availableDates.some(date => DateTime.fromISO(date).toMillis() === DateTime.fromISO(countriesWithDates[country]).plus({days: 1}).toMillis())) {
            attendees.push(partner.email);
          }
      })
      let requestObject = {
        name: country,
        attendees: attendees,
        startDate: countriesWithDates[country] ? countriesWithDates[country] : null,
        attendeeCount: attendees.length
      }
      request.countries.push(requestObject)
    });

    this.uploadData(request);
  }
  
  uploadData(request): void {
    this.formattedData = JSON.stringify(request);
    this.hubspotHttpService.sendFormattedData(request).subscribe();
  }

  findMostCommonDate(possibleDates: {}): string {
    let mostAvailable = 0;
    let bestDate = '';
    let possibleDatesArray = Object.keys(possibleDates).sort();

    //The list is sorted with the earliest dates at the beginning, so iterating backward ensures that the earliest
    //date is returned if multiple pairs have the same total number of people available.
    for (let i = possibleDatesArray.length - 1; i > 0; i--) {
      if (DateTime.fromISO(possibleDatesArray[i]).plus({days: 1}).toMillis() === DateTime.fromISO(possibleDatesArray[i + 1]).toMillis()) {
        if (possibleDates[possibleDatesArray[i]] + possibleDates[possibleDatesArray[i + 1]] >= mostAvailable) {
          mostAvailable = possibleDates[possibleDatesArray[i]] + possibleDates[possibleDatesArray[i + 1]];
          bestDate = possibleDatesArray[i];
        }
      }
    }
    return bestDate;
  }

  
}
