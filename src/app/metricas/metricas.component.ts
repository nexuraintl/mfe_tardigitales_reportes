import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReportesService, MetricasDashboard } from '../core/services/reportes.service';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './metricas.component.html'
})
export class MetricasComponent implements OnInit {
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  cargando: boolean = true;
  errorMs: string | null = null;

  headerActions = [
    {
      id: 'refresh',
      label: 'Actualizar Datos',
      icon: 'fa fa-refresh',
      btnClass: 'btn btn-outline-primary',
      action: () => this.cargarDatos()
    },
    {
      id: 'export',
      label: 'Generar Reporte',
      icon: 'fa fa-download',
      btnClass: 'btn btn-primary',
      action: () => this.router.navigate(['/exportar'])
    }
  ];

  kpis = [
    { label: 'Tarjetas Digitales Emitidas', value: '...', change: 'Total', icon: 'fa fa-id-card', color: '#174a7e' },
    { label: 'Contadores Registrados', value: '...', change: 'Activos', icon: 'fa fa-user-circle', color: '#198754' },
    { label: 'Sociedades Registradas', value: '...', change: 'Activas', icon: 'fa fa-building', color: '#d97706' },
    { label: 'Trámites Disponibles', value: '...', change: 'Servicios', icon: 'fa fa-tasks', color: '#6366f1' }
  ];

  tramitesPorTipo: { nombre: string; total: number; porcentaje: number }[] = [];
  ultimasActividades: { id: string; solicitante: string; tipo: string; estado: string; fecha: string }[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMs = null;

    this.reportesService.getDashboardMetricas().subscribe({
      next: (data: MetricasDashboard) => {
        this.kpis[0].value = data.totalTarjetasEmitidas.toString();
        this.kpis[1].value = data.totalContadores.toString();
        this.kpis[2].value = data.totalSociedades.toString();
        this.kpis[3].value = data.totalTramitesActivos.toString();

        this.tramitesPorTipo = data.tramitesPorTipo;
        this.ultimasActividades = data.ultimasActividades;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos del MS:', err);
        this.errorMs = 'No se pudo sincronizar con el microservicio.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
