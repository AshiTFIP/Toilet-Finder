import { Injectable } from '@angular/core';
import { ToiletService } from './toilet.service';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { KeyRetrievalService } from './keyRetrieval.service';

@Injectable()
export class MapService {
  private map?: google.maps.Map;
  private infoWindow?: google.maps.InfoWindow;
  private searchBox?: google.maps.places.SearchBox;
  private marker?: google.maps.Marker;
  apiKey= ''
  response$!:Promise<any>

  constructor(private tltSvc: ToiletService, private router:Router, private keyRtvlSvc: KeyRetrievalService) {
    this.retrieveKey()
  }

  async retrieveKey(){
    this.response$ = this.keyRtvlSvc.getGoogleMapsAPIKey()
    .then((response: { key: string; }) => {
      this.apiKey = response.key;
      this.loadGoogleMapsApi();
    })
    .catch((error: any) => {
      console.error(error);
    });
  }

  async loadGoogleMapsApi() {
    const loader = new Loader({
      apiKey: this.apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    try {
      await loader.importLibrary("core");
      console.log('Google Maps API loaded');
      this.initMap();

    } catch (error) {
      console.error('Error occurred while loading Google Maps API', error);
    }
  }
  

  public initMap() {
    this.map = new google.maps.Map(document.getElementById("map")!, {
      center: { lat: 1.295, lng: 103.858 },
      zoom: 15
    });
    
    this.infoWindow = new google.maps.InfoWindow();
    
    const locationButton = document.createElement("button");
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    const setMapPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const input = document.getElementById('pac-input') as HTMLInputElement;
            if (input) input.value = '';
    
            this.infoWindow?.open(this.map);
            this.map?.setCenter(pos);

            if (this.marker) {
              this.marker.setMap(null);
            }
    
            this.marker = new google.maps.Marker({
              position: pos,
              map: this.map,
              title: "Click to zoom",
               zIndex: 500
            });
    
            this.marker.addListener("click", () => {
              const position = this.marker?.getPosition();
              if (this.map && position) {
                this.map.setZoom(18);
                this.map.setCenter(position);
              }
            });
          },
          () => {
            const center = this.map?.getCenter();
            if(center){
              this.handleLocationError(true, this.infoWindow!, center);
            }
          }
        );
      } else {
        const center = this.map?.getCenter();
        if(center){
          this.handleLocationError(false, this.infoWindow!, center);
        }
      }
    }

    setMapPosition();
        
    locationButton.addEventListener("click", setMapPosition);

    const input = document.getElementById("pac-input") as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    this.map.addListener("bounds_changed", () => {
      this.searchBox?.setBounds(this.map?.getBounds() as google.maps.LatLngBounds);
    });

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
          console.log("Place contains no coordinates");
          return;
        }

        this.marker = new google.maps.Marker({
          map: this.map,
          title: place.name,
          position: place.geometry.location,
          zIndex: 500
        });

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map?.fitBounds(bounds);
    });

    this.tltSvc.getToiletLocations()
    .then((response: { locations: any; }) => {
      this.showToilets(response.locations);
    })
    .catch((error: any) => {
      console.error(error);
    });
  }
  
  handleLocationError(browserHasGeolocation: boolean, infoWindow: google.maps.InfoWindow, pos: google.maps.LatLng) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(this.map);
  }

  public async showToilets(source: string | object) {
    if (!source) {
      console.error('No source provided');
      return;
    }

    let myArr: any;

    try {
      if (typeof source === 'string') {
        myArr = JSON.parse(source);
      } else if (typeof source === 'object') {
        myArr = source;
      } else {
        console.error('Source is neither a string nor an object');
        return;
      }
    } catch (e) {
      console.error('Invalid JSON', e);
      return;
    }

    if (myArr) {
      for (let i = 0; i < myArr.length; i++) {
        const coords = myArr[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[0], coords[1]);

        const marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          icon: {
            url: '/assets/toilet.png',
            scaledSize: new google.maps.Size(32, 32)
          },
          zIndex: 1000
        });

        const infowindow = new google.maps.InfoWindow({
          content: "hello",
        });

        marker.addListener("click", async () => {
            const position = marker.getPosition();
            if (position) {
                infowindow.setContent(await this.getToiletLocationAndAvgRating(position, 1));
                infowindow.open({
                    anchor: marker,
                    map: this.map,
                    shouldFocus: false,
                });
            
                marker.addListener("click", async () => {
                    const loc = await this.getToiletLocationAndAvgRating(position, 2);
                    this.router.navigate(['/toiletinfo/'+loc]);;
              });
            }
        });
    }
    } else {
      console.error('Invalid document structure');
    }
  }

  public async getToiletLocationAndAvgRating(coordinates: google.maps.LatLng, int:number): Promise<string> {
    let toiletinfo = await this.tltSvc.getToiletLocationAndAvgRating(coordinates);
    if (!toiletinfo) {
      console.error('No info provided');
      return 'No info provided';
    }

    let info: any;

    try {
      info = toiletinfo
    } catch (e) {
      console.error('Invalid JSON', e);
      return 'Invalid JSON';
    }

    if (info) {
        if(int == 1){
          if(info.avgRating == 0.0){
            return `${info.location}
            <br>No ratings yet
            <br>Click icon to see more`;
          }
          else{
            return `${info.location}
            <br>Rating: ${info.avgRating}/5 
            <br>Click icon to see more`;
          }
        }
        else if(int == 2){
            return `${info.location}`
        }
        else {
            return 'Correct option not selected'
        }
    } else {
      console.error('Invalid document structure');
      return 'Invalid document structure';
    }
  }

}
