import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../core/services/reportes.service';

export interface SolicitudAnalitica {
  radicado: string;
  solicitante: string;
  documento: string;
  tipo: string;
  estado: string;
  fecha: string;
  correo: string;
  entidad: string;
}

@Component({
  selector: 'app-analitica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analitica.component.html'
})
export class AnaliticaComponent implements OnInit {
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  cargando: boolean = true;
  searchQuery = '';
  filtroEstado = '';
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 1;
  sortColumn = 'fecha';
  sortDirection: 'asc' | 'desc' = 'desc';

  headerActions = [
    { id: 'refresh', label: 'Actualizar', icon: 'fa fa-refresh', btnClass: 'btn btn-outline-secondary' },
    { id: 'exportExcel', label: 'Exportar CSV', icon: 'fa fa-download', btnClass: 'btn btn-primary' }
  ];

  solicitudes: SolicitudAnalitica[] = [];

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.reportesService.getTarjetas().subscribe({
      next: (tarjetas) => {
        if (tarjetas && tarjetas.length > 0) {
          this.solicitudes = tarjetas.map(t => ({
            radicado: t.codigo || `TRM-${t.id}`,
            solicitante: t.solicitante || t.representante || 'Sin solicitante',
            documento: t.documento || 'N/A',
            tipo: t.tipo_tarjeta === 'sociedades' ? 'Sociedad de Contadores' : 'Contador Público',
            estado: t.tarjeta || 'Activo',
            fecha: t.fecha || '2026-08-01',
            correo: t.correo || 'N/A',
            entidad: 'JCC'
          }));
        } else {
          this.solicitudes = [];
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tarjetas en analítica:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredList() {
    let result = this.solicitudes.filter(item => {
      const matchSearch = !this.searchQuery || 
        item.radicado.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.solicitante.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.documento.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.tipo.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchEstado = !this.filtroEstado || item.estado === this.filtroEstado;
      return matchSearch && matchEstado;
    });

    result.sort((a: any, b: any) => {
      const valA = a[this.sortColumn] || '';
      const valB = b[this.sortColumn] || '';
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  get pagedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  get totalRecords(): number {
    return this.filteredList.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  get startRecord(): number {
    if (this.totalRecords === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  get pagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  cambiarTamanoPagina(size: any): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  ordenar(col: string) {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
  }

  exportExcel() {
    let csv = 'Radicado,Solicitante,Documento,Tipo,Estado,Fecha,Correo\n';
    this.filteredList.forEach(r => {
      csv += `"${r.radicado}","${r.solicitante}","${r.documento}","${r.tipo}","${r.estado}","${r.fecha}","${r.correo}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_solicitudes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }
}
