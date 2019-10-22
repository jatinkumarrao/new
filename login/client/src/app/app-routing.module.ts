import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { ForgetComponent } from './user/forget/forget.component';
import { EnterPasswordComponent } from './user/enter-password/enter-password.component';
//import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard';
import {UserProfileComponent} from './user/user-profile/user-profile.component';

const routes: Routes = [ 
{
        path: 'forgetpassword', component: UserComponent,
        children: [{ path: '', component: ForgetComponent }]
    },
    {
        path: 'reset/:token', component: UserComponent,
        children: [{ path: '', component: EnterPasswordComponent }]
    },
{
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
    },
    {
        path: 'user', component: UserProfileComponent 
    },

    //{
    //    path: 'userprofile', component: UserProfileComponent,canActivate:[AuthGuard]
    //},
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
