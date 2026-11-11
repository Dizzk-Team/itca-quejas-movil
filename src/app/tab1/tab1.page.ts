import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgForOf } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  buildOutline,
  checkmarkCircleOutline,
  construct,
  timeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgForOf,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonButtons,
    IonBackButton,
  ],
})
export class Tab1Page {
  constructor() {
    // Registras el icono para poder usarlo en tu HTML
    addIcons({
      timeOutline,
      arrowBackOutline,
      buildOutline,
      checkmarkCircleOutline,
    });
  }

}
