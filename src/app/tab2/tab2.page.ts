import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cameraOutline, arrowForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonItem, IonList, IonSelect, IonSelectOption, CommonModule, IonItem, IonTextarea, FormsModule, IonIcon
    ,IonButton, IonInput
  ]
})
export class Tab2Page {

  constructor() {
    addIcons({ cameraOutline, arrowForwardOutline });
  }

}
