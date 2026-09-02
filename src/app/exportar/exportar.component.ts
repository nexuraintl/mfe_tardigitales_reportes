import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exportar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exportar.component.html'
})
export class ExportarComponent {
  tipoInforme = 'general';
  fechaInicio = '2026-08-01';
  fechaFin = '2026-09-01';
  formato = 'pdf';
  incluirDetalle = true;
  generando = false;
  mensajeExito = false;

  generarInforme() {
    this.generando = true;
    this.mensajeExito = false;
    setTimeout(() => {
      this.generando = false;
      this.mensajeExito = true;
    }, 1200);
  }
}
