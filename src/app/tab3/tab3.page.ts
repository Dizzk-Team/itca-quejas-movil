import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
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
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  locationSharp,
  peopleOutline,
  arrowUpCircleOutline,
  chevronDownOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    ExploreContainerComponent,
    IonItem,
    IonSelect,
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
})
export class Tab3Page {
  filtroMuro: string = 'recientes';
  constructor() {
    addIcons({
      businessOutline,
      locationSharp,
      peopleOutline,
      arrowUpCircleOutline,
      chevronDownOutline,
    });
  }
}
