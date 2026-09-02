import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metricas.component.html'
})
export class MetricasComponent {
  headerActions = [
    { id: 'refresh', label: 'Actualizar', icon: 'fa fa-refresh', btnClass: 'btn btn-outline-secondary' },
    { id: 'export', label: 'Descargar Resumen PDF', icon: 'fa fa-file-pdf-o', btnClass: 'btn btn-primary' }
  ];

  kpis = [
    { label: 'Total Solicitudes Emitidas', value: '1,428', change: '+12%', icon: 'fa fa-id-card', color: '#174a7e' },
    { label: 'Trámites Aprobados', value: '1,280', change: '+8%', icon: 'fa fa-check-circle', color: '#198754' },
    { label: 'En Verificación / Pendientes', value: '114', change: '-3%', icon: 'fa fa-clock-o', color: '#d97706' },
    { label: 'Notificaciones Entregadas', value: '3,892', change: '+24%', icon: 'fa fa-bell', color: '#6366f1' }
  ];

  tramitesPorTipo = [
    { nombre: 'Inscripción Contador Público por primera vez', total: 684, porcentaje: 48 },
    { nombre: 'Duplicado de Tarjeta Profesional', total: 342, porcentaje: 24 },
    { nombre: 'Registro y Tarjeta de Sociedades de Contadores', total: 256, porcentaje: 18 },
    { nombre: 'Actualización y Certificados Digitales', total: 146, porcentaje: 10 }
  ];

  ultimasActividades = [
    { id: 'TRM-9801', solicitante: 'Carlos Andrés Restrepo', tipo: 'Contador Primera Vez', estado: 'Aprobado', fecha: 'Hoy, 04:30 PM' },
    { id: 'TRM-9800', solicitante: 'Auditorías del Norte S.A.S.', tipo: 'Sociedad de Contadores', estado: 'En Revisión', fecha: 'Hoy, 02:15 PM' },
    { id: 'TRM-9799', solicitante: 'María Fernanda Gómez', tipo: 'Duplicado Tarjeta', estado: 'Aprobado', fecha: 'Ayer, 06:10 PM' },
    { id: 'TRM-9798', solicitante: 'Asesores Financieros Ltda.', tipo: 'Sociedad de Contadores', estado: 'Aprobado', fecha: 'Ayer, 03:40 PM' }
  ];
}
