import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { ActivatedRoute, NavigationStart, Router ,Params} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.css']
})
export class EnterPasswordComponent implements OnInit {
showSucessMessage: boolean;
  serverErrorMessages: string;
   state$: Observable<object>;
 private token: string;
 private email: string;

  constructor(public activatedRoute: ActivatedRoute,private userService: UserService, private router: Router) { }

  ngOnInit() {
  	  this.activatedRoute.params.forEach((params: Params) => {
      this.token = params['token'];
     // this.email = params['email']
    });

    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params);
    });
  	}
  onSubmit(form: NgForm) {
    this.userService.postUser2(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
}
  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName: '',
      email: '',
      password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }


}
