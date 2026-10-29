import { Component, OnInit,signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel} from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgForOf } from '@angular/common';
import axios from 'axios';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf],
})


export class Tab1Page implements OnInit {   

  ngOnInit(): void{}
}