import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Toilet } from 'src/app/models';
import { ToiletService } from 'src/app/services/toilet.service';
import { SelectCoordinatesComponent } from '../select-coordinates/select-coordinates.component';

@Component({
  selector: 'app-add-toilet',
  templateUrl: './add-toilet.component.html',
  styleUrls: ['./add-toilet.component.css']
})
export class AddToiletComponent implements OnInit {
  form!: FormGroup
  response$!: Promise<any>
  toiletDetails: Toilet = { area: '', location: '' , directions: '' , submittedBy: '', coordinates:'', verification: ''}
  message!: string
  userId!:string

  constructor(private tltSvc:ToiletService, private fb:FormBuilder, private route: ActivatedRoute, private dialog: MatDialog){ }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || 'default';
    this.form = this.fb.group({
      area: this.fb.control<string>('', [Validators.required]),
      location: this.fb.control<string>('', [Validators.required, this.locationValidator()]),
      directions: this.fb.control<string>(''),
      submittedby: this.fb.control<string>(this.userId, [Validators.required]),
      coordinates: this.fb.control<string>('', [Validators.required]),
      verification: this.fb.control<string>('Unverified', [Validators.required])
    })
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
    this.response$ = this.tltSvc.addToilet(this.toiletDetails)
    .then((response: { status: string; }) => {
      this.message = response.status
      if(this.message == "Toilet added successfully"){
        this.form.reset()
        this.form.controls['submittedby'].setValue(this.userId);
        this.form.controls['verification'].setValue('Unverified');
      }
    })
    .catch((error: any) => {
      this.message = error;
      console.error(error);
    })
  }

  locationValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !/^[a-zA-Z0-9 :$^&*()]+$/.test(control.value);
      return forbidden ? {'forbiddenCharacters': {value: control.value}} : null;
    };
  }

}

