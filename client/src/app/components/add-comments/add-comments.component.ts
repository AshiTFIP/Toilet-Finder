import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/models';
import { ToiletService } from 'src/app/services/toilet.service';

@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.css']
})
export class AddCommentsComponent implements OnInit {
  form!: FormGroup
  response$!: Promise<any>
  commentDetails: Comment = { location: '', rating: 0 , comments: '', submittedBy: '' }
  message!: string
  location!: string;

  constructor(private tltSvc:ToiletService, private fb:FormBuilder, private route: ActivatedRoute){ }

  ngOnInit(): void {
    this.location = this.route.snapshot.paramMap.get('location') || 'default';
    this.form = this.fb.group({
      location: this.fb.control<string>(this.location, [Validators.required]),
      rating: this.fb.control<number>(0, [Validators.required, Validators.pattern(/^[1-5]$/)]),
      comments: this.fb.control<string>('', [Validators.required]),
      submittedby: this.fb.control<string>('', [Validators.required])
    })
  }

  process(){
    const result = this.form.value
    this.commentDetails.location = result['location']
    this.commentDetails.rating = result['rating']
    this.commentDetails.comments = result['comments']
    this.commentDetails.submittedBy = result ['submittedby']
    this.response$ = this.tltSvc.addComment(this.commentDetails)
    .then((response: { status: string; }) => {
      this.message = response.status
      if(this.message == 'Comment added successfully'){
        this.form.reset()
        this.form.controls['location'].setValue(this.location)
      }
    })
    .catch((error: any) => {
      this.message = 'Unable to add comment. Please try again later.';
      console.error(error);
    })
  }
}
