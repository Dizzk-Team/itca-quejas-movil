import { Component, OnInit,signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel} from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgForOf } from '@angular/common';
import axios from 'axios';

interface estudiante{
  id: number;
  nombre: string;
  apellido: string;
  carnet: string;
  correo: string;
  edad: number;
  carrera: string;
  grupo: string;

}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf],
})


export class Tab1Page implements OnInit {
  estudiante = signal<estudiante[]>([]);   

  ngOnInit(): void{
    void this.obtenerEstudiantes();
  }

  async obtenerEstudiantes(): Promise<void>{
    try{
      const response = await axios.get<estudiante[]>(
        'http://172.16.17.105:8000/api/estudiantes'
      );
      this.estudiante.set(response.data);
    }
    catch (error) {
      console.error('Error', error);
    }
  }
}