import { Component, EnvironmentInjector, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  addCircleOutline,
  personOutline,
  homeOutline,
  clipboardOutline,
  personCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      addCircleOutline,
      personOutline,
      homeOutline,
      clipboardOutline,
      personCircleOutline,
    });
  }
}
