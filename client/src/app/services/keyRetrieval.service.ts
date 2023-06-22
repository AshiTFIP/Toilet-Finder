import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { firstValueFrom } from 'rxjs';

const URL = "http://localhost:8080"

@Injectable()
export class KeyRetrievalService{

    constructor(private http: HttpClient){ }

    getStripePublishableKey(): Promise<any> {
        return firstValueFrom(
            this.http.get<string>(URL+'/getstripepublishablekey')
        )
    }

    getGoogleMapsAPIKey(): Promise<any> {
        return firstValueFrom(
            this.http.get<string>(URL+'/getgooglemapsapikey')
        )
    }

}