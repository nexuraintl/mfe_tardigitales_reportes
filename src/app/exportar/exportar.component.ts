import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exportar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exportar.component.html'
})
export class ExportarComponent {
  headerActions = [
    { id: 'volverAnalitica', label: 'Ver Detalle Analítico', icon: 'fa fa-table', btnClass: 'btn btn-outline-secondary' }
  ];

  tipoInforme = 'general';
  fechaInicio = '2026-08-01';
  fechaFin = '2026-09-01';
  formato = 'pdf';
  incluirDetalle = true;
  generando = false;
  mensajeExito = false;

  constructor(private router: Router) {}

  volverAnalitica() {
    this.router.navigate(['/analitica']);
  }

  generarInforme() {
    this.generando = true;
    this.mensajeExito = false;
    setTimeout(() => {
      this.generando = false;
      this.mensajeExito = true;
    }, 1200);
  }
}
