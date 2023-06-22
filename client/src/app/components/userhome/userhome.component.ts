import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToiletService } from 'src/app/services/toilet.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent implements OnInit {
  userId!:string
  toilets:any = [];
  message!:string

  constructor(private route: ActivatedRoute, private tltSvc: ToiletService){ }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || 'default';
    this.getToiletsByUserId();
  }

  getToiletsByUserId() {
    this.tltSvc.getToiletsByUserId(this.userId).then(
      res => {
        this.toilets = res.toilets;
      },
      err => {
        this.message = 'Failed to get toilets: ', err;
        console.error('Failed to get toilets: ', err);
      }
    );
  }

  deleteToilet(location: string) {
    this.tltSvc.deleteToilet(location)
    .then((res: { result: string; }) => {
        if(res.result == 'Deleted successfully'){
          this.message = 'Toilet deleted successfully';
          setTimeout(() => {this.getToiletsByUserId(); }, 1500);
        }
      else {
        this.message = res.result;
      }
    })
    .catch((error: any) => {
      this.message = error;
      console.error(error);
    })
  }
}
