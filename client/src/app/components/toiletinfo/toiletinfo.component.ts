import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToiletService } from 'src/app/services/toilet.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-toiletinfo',
  templateUrl: './toiletinfo.component.html',
  styleUrls: ['./toiletinfo.component.css']
})
export class ToiletinfoComponent implements OnInit{

  location!: string;
  toiletInfo: any;
  errorMessage: string | null = null;

  constructor(private fb:FormBuilder, private dialog: MatDialog, private route: ActivatedRoute, private tltSvc: ToiletService, private loc: Location) { }

  ngOnInit(): void {
    this.location = this.route.snapshot.paramMap.get('location') || 'default';
    this.tltSvc.getToiletInfo(this.location).then(response => {
      this.toiletInfo = response;
    }).catch(error => {
      console.error('Error while fetching toilet info:', error);
      this.toiletInfo = "null"
      this.errorMessage = 'Error while fetching toilet info. Please try again later.';
    });
  }

}

  







