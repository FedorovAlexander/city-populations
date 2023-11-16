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
    this.createMap();
    this.initiateData();
    this.initiateMapStyle();
  }

  createMap() {
    this.map = new mapboxgl.Map({
      accessToken: config.MAPBOX_ACCESS_TOKEN,
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 5,
      center: [0, 0],
      pitch: 80,
      bearing: 160,
    });
  }

  initiateMapStyle() {
    this.map.setProjection('globe');

    this.map.on('style.load', () => {
      this.map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });

      this.map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      this.map.setFog({
        range: [0.8, 8],
        color: '#dc9f9f',
        'horizon-blend': 0.5,
        'high-color': '#245bde',
        'space-color': '#000000',
        'star-intensity': 0.15,
      });
    });
  }

  initiateData() {
    this.map.on('load', () => {
      console.log('initiateData');

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
