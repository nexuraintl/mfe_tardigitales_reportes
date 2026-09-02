import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analitica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analitica.component.html'
})
export class AnaliticaComponent {
  searchQuery = '';
  filtroEstado = '';
  pageSize = 10;
  currentPage = 1;
  sortColumn = 'fecha';
  sortDirection: 'asc' | 'desc' = 'desc';

  headerActions = [
    { id: 'exportExcel', label: 'Exportar a Excel (CSV)', icon: 'fa fa-file-excel-o', btnClass: 'btn btn-success' }
  ];

  solicitudes = [
    { radicado: 'RAD-2026-001428', solicitante: 'Carlos Andrés Restrepo', documento: 'CC 1020492811', tipo: 'Contador Primera Vez', estado: 'Aprobado', fecha: '2026-09-01 16:30', entidad: 'Bogotá D.C.' },
    { radicado: 'RAD-2026-001427', solicitante: 'Auditorías del Norte S.A.S.', documento: 'NIT 901.428.190-2', tipo: 'Sociedad de Contadores', estado: 'En Revisión', fecha: '2026-09-01 14:15', entidad: 'Medellín' },
    { radicado: 'RAD-2026-001426', solicitante: 'María Fernanda Gómez', documento: 'CC 52918234', tipo: 'Duplicado Tarjeta', estado: 'Aprobado', fecha: '2026-08-31 18:10', entidad: 'Cali' },
    { radicado: 'RAD-2026-001425', solicitante: 'Asesores Financieros Ltda.', documento: 'NIT 800.192.481-1', tipo: 'Sociedad de Contadores', estado: 'Aprobado', fecha: '2026-08-31 15:40', entidad: 'Barranquilla' },
    { radicado: 'RAD-2026-001424', solicitante: 'Juan David Pérez Torres', documento: 'CC 79812499', tipo: 'Contador Primera Vez', estado: 'Aprobado', fecha: '2026-08-30 11:20', entidad: 'Bucaramanga' },
    { radicado: 'RAD-2026-001423', solicitante: 'Diana Marcela Castro', documento: 'CC 1018273645', tipo: 'Duplicado Tarjeta', estado: 'Rechazado', fecha: '2026-08-30 09:05', entidad: 'Cartagena' },
    { radicado: 'RAD-2026-001422', solicitante: 'Consultores Tributarios S.A.', documento: 'NIT 900.581.294-0', tipo: 'Sociedad de Contadores', estado: 'Aprobado', fecha: '2026-08-29 17:00', entidad: 'Bogotá D.C.' },
    { radicado: 'RAD-2026-001421', solicitante: 'Jorge Eliecer Morales', documento: 'CC 80192837', tipo: 'Contador Primera Vez', estado: 'Aprobado', fecha: '2026-08-29 14:50', entidad: 'Pereira' }
  ];

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

  get totalPages() {
    return Math.ceil(this.filteredList.length / this.pageSize) || 1;
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
    let csv = 'Radicado,Solicitante,Documento,Tipo,Estado,Fecha,Ciudad\n';
    this.filteredList.forEach(r => {
      csv += `"${r.radicado}","${r.solicitante}","${r.documento}","${r.tipo}","${r.estado}","${r.fecha}","${r.entidad}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_solicitudes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }
}
