import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToiletService } from 'src/app/services/toilet.service';
import { MapService } from 'src/app/services/map.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {
  source!: string
  response$!: Promise<any>
  jokeQuestion: string = '';
  jokeAnswer: string = '';
  jokeBoxSeen = true;

  constructor(private tltSvc: ToiletService, private mpSvc:MapService, private router:Router){}
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/') {
        this.mpSvc.initMap();
      }
    });
    this.getJoke();
 }

 async getJoke() {
  try {
    const jokeResponse = await this.tltSvc.getJoke();
    this.jokeQuestion = jokeResponse.setup;
    this.jokeAnswer = jokeResponse.punchline;
  } catch (error) {
    console.error('Failed to fetch joke:', error);
  }
}

closeJokeBox() {
  this.jokeBoxSeen = false;
}

}

