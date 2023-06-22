import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Loader } from '@googlemaps/js-api-loader';
import { KeyRetrievalService } from 'src/app/services/keyRetrieval.service';

declare var google: any;

@Component({
  selector: 'app-select-coordinates',
  templateUrl: './select-coordinates.component.html',
  styleUrls: ['./select-coordinates.component.css']
})
export class SelectCoordinatesComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  map!: any;
  private marker?: google.maps.Marker;
  private searchBox?: google.maps.places.SearchBox;
  private coordinates: any = null;
  apiKey=''

  constructor(public dialogRef: MatDialogRef<SelectCoordinatesComponent>, private keyRtvlSvc: KeyRetrievalService) { }

  async ngAfterViewInit(): Promise<void> {
    await this.retrieveKey();
  }

  async retrieveKey(){
    this.keyRtvlSvc.getGoogleMapsAPIKey()
    .then((response: { key: string; }) => {
      this.apiKey = response.key;
      this.loadGoogleMapsApi();
    })
    .catch((error: any) => {
      console.error(error);
    });
  }

  async loadGoogleMapsApi(){
    const loader = new Loader({
      apiKey: this.apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    try {
      await loader.importLibrary("core");
      console.log('Google Maps API loaded');
      this.mapInitializer();

    } catch (error) {
      console.error('Error occurred while loading Google Maps API', error);
    }
  }
    
  mapInitializer() {
    const coordinates = new google.maps.LatLng(1.295, 103.858);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 15,
    };
  
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

    this.map.addListener('click', (e: any) => {
      this.coordinates = e.latLng.toString();

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: e.latLng,
      map: this.map,
    });

    });

    const input = document.getElementById("pac-input") as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    if(this.searchBox){
      this.searchBox.addListener("places_changed", () => {
      const places = this.searchBox?.getPlaces();
      if (places && places.length == 0) {
        return;
      }

      if (this.marker) {
        this.marker.setMap(null);
      }
    
      const bounds = new google.maps.LatLngBounds();
      places?.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        this.marker = new google.maps.Marker({
          map: this.map,
          title: place.name,
          position: place.geometry.location,
        });

        this.coordinates = place.geometry.location.toString();
      
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      this.map.fitBounds(bounds);
    })
  };

  
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.map.setCenter(pos);

        if (this.marker) {
          this.marker.setMap(null);
        }

        this.marker = new google.maps.Marker({
          position: pos,
          map: this.map,
        });

        this.coordinates = "("+pos.lat + "," + pos.lng + ")";

      });
    } else {
      console.error('Browser doesn\'t support geolocation');
    }
  });
  }


  selectCoordinate() {
    if (this.coordinates) {
      this.dialogRef.close(this.coordinates);
    }
  }
}
