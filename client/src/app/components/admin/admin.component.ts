import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToiletService } from 'src/app/services/toilet.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  unverifiedToilets:any = [];
  verifiedToilets:any = [];
  message!:string

  constructor(private route: ActivatedRoute, private tltSvc: ToiletService){ }

  ngOnInit(): void {
    this.getUnverifiedToilets();
    this.getVerifiedToilets();
  }

  getUnverifiedToilets() {
    this.tltSvc.getUnverifiedToilets().then(
      res => {
        this.unverifiedToilets = res.toilets;
      },
      err => {
        this.message = 'Failed to get toilets: ', err;
        console.error('Failed to get toilets: ', err);
      }
    );
  }

  getVerifiedToilets() {
    this.tltSvc.getVerifiedToilets().then(
      res => {
        this.verifiedToilets = res.toilets;
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
          this.getUnverifiedToilets();
          this.getVerifiedToilets();
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

  verifyToilet(location: string) {
    this.tltSvc.verifyToilet(location)
    .then((res: { result: string; }) => {
        if(res.result == 'Verified successfully'){
          this.message = 'Toilet verified successfully';
          this.getUnverifiedToilets();
          this.getVerifiedToilets();
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
