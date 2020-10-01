import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { SocketService } from '../_services/socket.service';
import { Cronometro } from '../models/Cronometro';
import { takeUntil } from 'rxjs/operators';
import { Formulario } from '../models/Formulario';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  private nombresPreguntas = ['solicitaApoyo','nombreApoyo', 'esenaSegura'];

  horaRecepcion: string;
  folio: string;
  fechaRecepcion: Date;
  tiempoAcumulado: string;
  cronometro: Cronometro;
  destroyed$ = new Subject();
  
  SiERUMP_Fomulario = new FormGroup({
    solicitaApoyo: new FormControl('c4'),
    nombreApoyo: new FormControl(''),
    esenaSegura: new FormControl('si')
  });



  constructor(private route: ActivatedRoute,
              private chatService: SocketService) { }

  ngOnInit(): void {
    this.inicializarDatos();
    this.inicializarContronometro();
    const chatSub$ = this.chatService.connect(this.folio).pipe(
      takeUntil(this.destroyed$),
    );

    chatSub$.subscribe(respuesta => {
      let formulario = new Formulario(JSON.parse(respuesta));
      this.SiERUMP_Fomulario.get(formulario.campoCambiado).setValue(formulario.cambio,{emitEvent: false});
    });

    this.detectarCambios();    
  }

  private inicializarDatos(){
    this.folio = this.route.snapshot.paramMap.get('folio');
    if(!this.horaRecepcion && !this.fechaRecepcion){
      this.fechaRecepcion = new Date();
      let minutos = this.fechaRecepcion.getMinutes() < 10 ? '0' + this.fechaRecepcion.getMinutes() :
        this.fechaRecepcion.getMinutes();
      this.horaRecepcion = this.fechaRecepcion.getHours() + ':' + minutos;
    }
  }

  private inicializarContronometro(){
    this.cronometro = new Cronometro();
    const contador = interval(1000);
    contador.subscribe(() => this.tiempoAcumulado = this.cronometro.actualizarCronometro());
  }

  private detectarCambios(){    
    this.nombresPreguntas.forEach(nombre => {
      this.SiERUMP_Fomulario.get(nombre).valueChanges.subscribe(cambio => {
        this.chatService.send({campoCambiado:nombre, cambio: cambio});
      });
    });    
  }

}
