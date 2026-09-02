import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';

export interface TarjetaRecord {
  id: number;
  tipo_tarjeta?: string;
  codigo?: string;
  expediente?: string;
  solicitante?: string;
  documento?: string;
  matricula?: string;
  correo?: string;
  representante?: string;
  tarjeta?: string;
  fecha?: string;
}

export interface TramiteRecord {
  id: number;
  nombre: string;
  tipo: string;
  costo: number | string;
  estado: string;
  descripcion?: string;
}

export interface MetricasDashboard {
  totalTarjetasEmitidas: number;
  totalContadores: number;
  totalSociedades: number;
  totalTramitesActivos: number;
  tramitesPorTipo: { nombre: string; total: number; porcentaje: number }[];
  ultimasActividades: { id: string; solicitante: string; tipo: string; estado: string; fecha: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private http = inject(HttpClient);
  private apiBase = '/apig/tardigitales/admin';
  private clientId = 20001;

  /**
   * Obtiene las tarjetas registradas desde el Microservicio Python
   */
  getTarjetas(tipoTarjeta?: 'contadores' | 'sociedades'): Observable<TarjetaRecord[]> {
    let params = new HttpParams().set('client_id', this.clientId.toString());
    if (tipoTarjeta) {
      params = params.set('tipo_tarjeta', tipoTarjeta);
    }
    return this.http.get<TarjetaRecord[]>(`${this.apiBase}/tarjetas/list`, { params }).pipe(
      catchError(err => {
        console.warn('Error al consultar tarjetas del microservicio:', err);
        return of([]);
      })
    );
  }

  /**
   * Obtiene la lista de trámites configurados desde el Microservicio
   */
  getTramites(): Observable<TramiteRecord[]> {
    const params = new HttpParams().set('client_id', this.clientId.toString());
    return this.http.get<TramiteRecord[]>(`${this.apiBase}/tramites/list`, { params }).pipe(
      catchError(err => {
        console.warn('Error al consultar trámites del microservicio:', err);
        return of([]);
      })
    );
  }

  /**
   * Consolida métricas y estadísticas reales cruzando las tarjetas y trámites del Microservicio
   */
  getDashboardMetricas(): Observable<MetricasDashboard> {
    return forkJoin({
      contadores: this.getTarjetas('contadores'),
      sociedades: this.getTarjetas('sociedades'),
      tramites: this.getTramites()
    }).pipe(
      map(({ contadores, sociedades, tramites }) => {
        const totalContadores = contadores.length;
        const totalSociedades = sociedades.length;
        const totalTarjetas = totalContadores + totalSociedades;
        const totalTramitesActivos = tramites.filter(t => t.estado?.toLowerCase() === 'activo').length;

        // Distribución por tipo de trámite
        const tramitesContadores = tramites.filter(t => t.tipo?.toLowerCase().includes('contador')).length;
        const tramitesSociedades = tramites.filter(t => t.tipo?.toLowerCase().includes('sociedad')).length;
        const tramitesOtros = Math.max(0, tramites.length - tramitesContadores - tramitesSociedades);
        const totalT = tramites.length || 1;

        const tramitesPorTipo = [
          {
            nombre: 'Trámites para Contadores Públicos',
            total: tramitesContadores,
            porcentaje: Math.round((tramitesContadores / totalT) * 100)
          },
          {
            nombre: 'Trámites para Sociedades Contables',
            total: tramitesSociedades,
            porcentaje: Math.round((tramitesSociedades / totalT) * 100)
          },
          {
            nombre: 'Otros Trámites y Certificados',
            total: tramitesOtros,
            porcentaje: Math.round((tramitesOtros / totalT) * 100)
          }
        ];

        // Últimas actividades procesadas (mezclando las tarjetas más recientes)
        const allTarjetas = [...contadores, ...sociedades].sort((a, b) => (b.id || 0) - (a.id || 0));
        const ultimasActividades = allTarjetas.slice(0, 6).map(t => ({
          id: t.codigo || `TRM-${t.id || 'N/A'}`,
          solicitante: t.solicitante || t.representante || 'Sin solicitante',
          tipo: t.tipo_tarjeta === 'sociedades' ? 'Sociedad de Contadores' : 'Contador Público',
          estado: t.tarjeta || 'Activo',
          fecha: t.fecha || 'Reciente'
        }));

        return {
          totalTarjetasEmitidas: totalTarjetas,
          totalContadores,
          totalSociedades,
          totalTramitesActivos,
          tramitesPorTipo,
          ultimasActividades
        };
      })
    );
  }
}
