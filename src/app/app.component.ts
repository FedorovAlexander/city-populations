import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import config from '../assets/config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'cities';
  map!: mapboxgl.Map;

  constructor() {}

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: config.MAPBOX_ACCESS_TOKEN,
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 1,
      center: [-77.042754, -12.046373],
    });
    this.initiateData();
  }

  initiateData() {
    this.map.on('load', () => {
      console.log('initiateData');
      //get data from assets/data/geonames-all-cities-with-a-population-1000@public.geojson

      this.map.addSource('cities', {
        type: 'geojson',
        data: '../assets/data/geonames-all-cities-with-a-population-1000@public.geojson',
      });

      this.map.addLayer({
        id: 'cities',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
        },
      });
    });
  }
}
