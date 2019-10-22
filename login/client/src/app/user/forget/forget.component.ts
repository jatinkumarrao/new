import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { NgForm } from '@angular/forms';
import{ Router } from "@angular/router";
@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
   emp:any = [];
  constructor(private userService: UserService,private router: Router) { }

  ngOnInit() {

  }
onSubmit(form: NgForm) {
    this.userService.getPassword(form.value).subscribe(
      data => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
       // this.router.navigateByUrl('/enterpassword', { state: { hello: 'world' } });
     
      //  this.router.navigateByUrl('/enterpassword',this.emp=data);
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
