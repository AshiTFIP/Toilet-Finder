import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { AddCommentsComponent } from './components/add-comments/add-comments.component';
import { ToiletService } from './services/toilet.service';
import { AddToiletComponent } from './components/add-toilet/add-toilet.component';
import { NgxStripeModule } from 'ngx-stripe';
import { ToiletinfoComponent } from './components/toiletinfo/toiletinfo.component';
import { GmapComponent } from './components/gmap/gmap.component';
import { MapService } from './services/map.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectCoordinatesComponent } from './components/select-coordinates/select-coordinates.component';
import { UserhomeComponent } from './components/userhome/userhome.component';
import { StripeComponent } from './components/stripe/stripe.component';
import { EditToiletComponent } from './components/edit-toilet/edit-toilet.component';
import { KeyRetrievalService } from './services/keyRetrieval.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    CreateAccountComponent,
    AddCommentsComponent,
    AddToiletComponent,
    StripeComponent,
    ToiletinfoComponent,
    GmapComponent,
    UserhomeComponent,
    SelectCoordinatesComponent,
    EditToiletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxStripeModule.forRoot('pk_test_51NFYpNIjvelEZeBSz87nn8eJu9wX2EVPhyexFHtPuXp5IGvX4pbsICBy3TVxCaPZjoneHBRebEv5x8JjKpvUI1IQ00NKKUlfuC'),
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [LoginService, ToiletService, MapService, KeyRetrievalService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
