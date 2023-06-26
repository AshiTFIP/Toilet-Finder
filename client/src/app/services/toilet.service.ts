import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Comment, Toilet } from "../models"
import { firstValueFrom } from 'rxjs';

//const URL = "http://localhost:8080"

@Injectable()
export class ToiletService{

    constructor(private http: HttpClient){ }

    addToilet(toilet: Toilet): Promise<any>{
        const form = new HttpParams().set('area', toilet.area).set('location', toilet.location)
        .set('directions', toilet.directions).set('submittedBy', toilet.submittedBy).set('verification', toilet.verification).set('coordinates', toilet.coordinates)
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')

        return firstValueFrom(
            //this.http.post<string>(URL+'/addtoilet', form.toString(), { headers })
            this.http.post<string>('/addtoilet', form.toString(), { headers })
        )
    }

    addComment(comment: Comment): Promise<any> {
        const form = new HttpParams().set('location', comment.location).set('rating', comment.rating)
        .set('comments', comment.comments).set('submittedBy', comment.submittedBy)
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')

        return firstValueFrom(
            //this.http.post<string>(URL+'/addcomment', form.toString(), { headers })
            this.http.post<string>('/addcomment', form.toString(), { headers })
        )
    }

    getToiletLocations(): Promise<any> {
        return firstValueFrom(
            //this.http.get<string>(URL+'/gettoiletlocations')
            this.http.get<string>('/gettoiletlocations')
        )
      }
    
    async getToiletLocationAndAvgRating(coords: google.maps.LatLng): Promise<string>{
        const coordinatesString = `${coords.lat()},${coords.lng()}`;
        const form = new HttpParams().set('coordinates', coordinatesString)
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        //const response = await firstValueFrom(this.http.post<string>(URL+'/gettoiletlocationandavgrating', form.toString(), { headers }));
        const response = await firstValueFrom(this.http.post<string>('/gettoiletlocationandavgrating', form.toString(), { headers }));
        return response;
    }

    getToiletInfo(location:string): Promise<any>{
        return firstValueFrom(
            //this.http.get<string>(URL+'/gettoiletinfo/'+location)
            this.http.get<string>('/gettoiletinfo/'+location)
        )
    }

    getToiletsByUserId(userId: string):Promise<any>{
        const params = new HttpParams().set('userId', userId)
        return firstValueFrom(
            //this.http.get<string>(URL+'/gettoiletsbyuserid', { params })
            this.http.get<string>('/gettoiletsbyuserid', { params })
        )
    }

    deleteToilet(location:string): Promise<any>{
        return firstValueFrom(
            //this.http.delete<string>(URL+'/deletetoilet/'+location)
            this.http.delete<string>('/deletetoilet/'+location)
        )
    }

    getJoke():Promise<any>{
        return firstValueFrom(
            //this.http.get<string>(URL+'/getjoke')
            this.http.get<string>('/getjoke')
        )
    }

    
    verifyToilet(location:string): Promise<any>{
        return firstValueFrom(
            //this.http.delete<string>(URL+'/deletetoilet/'+location)
            this.http.get<string>('/verifytoilet/'+location)
        )
    }

    getUnverifiedToilets():Promise<any>{
        return firstValueFrom(
            //this.http.get<string>(URL+'/gettoiletsbyuserid', { params })
            this.http.get<string>('/getunverifiedtoilets', )
        )
    }

    getVerifiedToilets():Promise<any>{
        return firstValueFrom(
            //this.http.get<string>(URL+'/gettoiletsbyuserid', { params })
            this.http.get<string>('/getverifiedtoilets')
        )
    }
}