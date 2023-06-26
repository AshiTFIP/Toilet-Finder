import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { AddCommentsComponent } from './components/add-comments/add-comments.component';
import { AddToiletComponent } from './components/add-toilet/add-toilet.component';
import { GmapComponent } from './components/gmap/gmap.component';
import { ToiletinfoComponent } from './components/toiletinfo/toiletinfo.component';
import { UserhomeComponent } from './components/userhome/userhome.component';
import { StripeComponent } from './components/stripe/stripe.component';
import { EditToiletComponent } from './components/edit-toilet/edit-toilet.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  {path:"", component: GmapComponent},
  {path:"login", component: LoginPageComponent},
  {path:"createaccount", component: CreateAccountComponent},
  {path:"userhome/:userId", component: UserhomeComponent},
  {path:"addcomments/:location", component: AddCommentsComponent},
  {path:"addtoilet/:userId", component: AddToiletComponent},
  {path:"donation", component: StripeComponent},
  {path:"toiletinfo/:location", component: ToiletinfoComponent},
  {path:"edittoilet/:userId/:location", component: EditToiletComponent},
  {path:"admin", component: AdminComponent},
  {path:"**", redirectTo: "/", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
