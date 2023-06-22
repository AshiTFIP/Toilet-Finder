import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Toilet } from 'src/app/models';
import { ToiletService } from 'src/app/services/toilet.service';
import { SelectCoordinatesComponent } from '../select-coordinates/select-coordinates.component';

@Component({
  selector: 'app-edit-toilet',
  templateUrl: './edit-toilet.component.html',
  styleUrls: ['./edit-toilet.component.css']
})
export class EditToiletComponent implements OnInit {
  form!: FormGroup
  response$!: Promise<any>
  toiletInfo: any;
  toiletDetails: Toilet = { area: '', location: '' , directions: '' , submittedBy: '', coordinates:'', verification: ''}
  message!: string
  userId!:string
  originalLocation!: string;
  errorMessage!: string;

  constructor(private tltSvc:ToiletService, private fb:FormBuilder, private route: ActivatedRoute, private dialog: MatDialog){ }

  ngOnInit(): void {
    this.originalLocation = this.route.snapshot.paramMap.get('location') || 'default';
    this.userId = this.route.snapshot.paramMap.get('userId') || 'default';

    this.form = this.fb.group({
      area: this.fb.control('', [Validators.required]),
      location: this.fb.control('', [Validators.required, this.locationValidator()]),
      directions: this.fb.control(''),
      submittedby: this.fb.control(this.userId, [Validators.required]),
      coordinates: this.fb.control('', [Validators.required]),
      verification: this.fb.control('Unverified', [Validators.required])
    })

    this.tltSvc.getToiletInfo(this.originalLocation).then(response => {
      this.toiletInfo = response;

      this.form = this.fb.group({
        area: this.fb.control<string>(this.toiletInfo.area, [Validators.required]),
        location: this.fb.control<string>(this.toiletInfo.location, [Validators.required, this.locationValidator()]),
        directions: this.fb.control<string>(this.toiletInfo.directions),
        submittedby: this.fb.control<string>(this.userId, [Validators.required]),
        coordinates: this.fb.control<string>('('+this.toiletInfo.geometry.coordinates.join(',')+')', [Validators.required]),
        verification: this.fb.control<string>('Unverified', [Validators.required])
      })
    }).catch(error => {
      console.error('Error while fetching toilet info:', error);
      this.toiletInfo = "null"
      this.errorMessage = 'Error while fetching toilet info. Please try again later.';
    });
  }

  openSelectCoordinatesDialog(): void {
    const dialogRef = this.dialog.open(SelectCoordinatesComponent);

    dialogRef.afterClosed().subscribe(coordinates => {
      if (coordinates) {
        this.form.controls['coordinates'].setValue(coordinates);
      }
    });
  }

  process(){
    const result = this.form.value
    this.toiletDetails.area = result['area']
    this.toiletDetails.location = result['location']
    this.toiletDetails.directions = result['directions']
    this.toiletDetails.submittedBy = result['submittedby']
    this.toiletDetails.coordinates = result['coordinates']
    this.toiletDetails.verification = result['verification']

    if(this.originalLocation === this.toiletDetails.location){
      this.tltSvc.deleteToilet(this.originalLocation).then(() => {
        return this.tltSvc.addToilet(this.toiletDetails);
      }).then((response: { status: string; }) => {
        if(response.status == "Toilet added successfully"){
          this.message = "Toilet edited successfully";
        }
        else{
          this.message = response.status;
        }
      }).catch((error: any) => {
        this.message = error;
        console.error(error);
      });
    } else {
      this.tltSvc.addToilet(this.toiletDetails).then((response: { status: string; }) => {
        if(response.status == "Toilet added successfully"){
          this.message = "Toilet edited successfully";
          this.tltSvc.deleteToilet(this.originalLocation);
        }
        else{
          this.message = response.status;
        }
      }).catch((error: any) => {
        this.message = error;
        console.error(error);
      });
    }
  }

  locationValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !/^[a-zA-Z0-9 :$^&*()]+$/.test(control.value);
      return forbidden ? {'forbiddenCharacters': {value: control.value}} : null;
    };
  }

}
