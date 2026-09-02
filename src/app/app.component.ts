import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MenuSection, UserProfile, AppTile, PrimaryAction } from './core/models/layout.models';

export interface HeaderAction {
  id: string;
  label: string;
  icon?: string;
  btnClass?: string;
  action?: () => void;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html'
})
export class App implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentUrl = (typeof window !== 'undefined' && window.location.pathname) ? window.location.pathname : '';
  pageTitle = 'Métricas y Dashboard de Tarjetas';
  activeComponent: any = null;
  viewActions: HeaderAction[] = [];

  private routeTitles: { [key: string]: string } = {
    '/metricas': 'Métricas y Dashboard de Tarjetas',
    '/analitica': 'Analítica y Detalle de Solicitudes',
    '/exportar': 'Generador y Exportación de Reportes'
  };

  currentUser: UserProfile = {
    name: 'Fabian Vargas',
    email: 'fvargas@nexura.com',
    role: 'Administrador',
    initials: 'FV'
  };

  primaryAction: PrimaryAction | null = {
    label: 'Generar Reporte',
    icon: 'fa fa-file-text-o',
    action: () => this.router.navigate(['/exportar'])
  };

  appGrid: AppTile[] = [
    { id: 'tarjetas', name: 'Tarjetas', color: 'blue', iconClass: 'fa fa-id-card', path: '/admin/tardigitales/tarjetas-contadores' },
    { id: 'sociedades', name: 'Sociedades', color: 'cyan', iconClass: 'fa fa-building-o', path: '/admin/tardigitales/sociedades' },
    { id: 'notificaciones', name: 'Notificaciones', color: 'orange', iconClass: 'fa fa-bell-o', path: '/admin/tardigitales/crear-notificacion' },
    { id: 'tramites', name: 'Trámites', color: 'green', iconClass: 'fa fa-list-alt', path: '/admin/tardigitales/crud' },
    { id: 'reportes', name: 'Reportes', color: 'purple', iconClass: 'fa fa-bar-chart', path: '/admin/reportes/metricas', active: true },
    { id: 'validador', name: 'Validador QR', color: 'dark', iconClass: 'fa fa-qrcode', path: '/admin/tardigitales/validador-qr' }
  ];

  menuSections: MenuSection[] = [
    {
      sectionTitle: 'ANALÍTICA & REPORTES',
      items: [
        {
          label: 'Dashboard y Métricas',
          icon: 'fa fa-tachometer',
          path: '/metricas'
        },
        {
          label: 'Detalle Analítico',
          icon: 'fa fa-table',
          path: '/analitica'
        },
        {
          label: 'Exportar Informes',
          icon: 'fa fa-download',
          path: '/exportar'
        }
      ]
    },
    {
      sectionTitle: 'MÓDULOS DEL SISTEMA',
      items: [
        {
          label: 'Ir a Tarjetas Digitales',
          icon: 'fa fa-id-card-o',
          path: '/admin/tardigitales/tarjetas-contadores'
        },
        {
          label: 'Ir a Trámites',
          icon: 'fa fa-list-alt',
          path: '/admin/tardigitales/crud'
        }
      ]
    }
  ];

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects || event.url;
      this.updatePageInfo(this.currentUrl);
      this.cdr.detectChanges();
    });
    this.updatePageInfo(this.router.url);
  }

  onRouteActivate(component: any) {
    this.activeComponent = component;
    if (component && component.headerActions) {
      this.viewActions = component.headerActions;
    } else {
      this.viewActions = [];
    }
  }

  ejecutarAccion(action: HeaderAction) {
    if (action.action) {
      action.action();
    } else if (this.activeComponent && typeof this.activeComponent[action.id] === 'function') {
      this.activeComponent[action.id]();
    }
  }

  private updatePageInfo(url: string) {
    const cleanUrl = url.split('?')[0];
    for (const route in this.routeTitles) {
      if (cleanUrl.includes(route)) {
        this.pageTitle = this.routeTitles[route];
        return;
      }
    }
    this.pageTitle = 'Reportes y Analítica';
  }

  onNavigate(event: CustomEvent) {
    const path = event.detail?.path;
    if (path) {
      if (path.startsWith('/admin/tardigitales')) {
        window.location.href = path;
      } else {
        this.router.navigate([path]);
      }
    }
  }

  onBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  }

  onPrimaryAction(event: CustomEvent) {
    this.router.navigate(['/exportar']);
  }

  onAppChange(event: CustomEvent) {
    const app = event.detail;
    if (app && app.path) {
      window.location.href = app.path;
    }
  }

  onProfileAction(event: CustomEvent) {
    console.log('Acción de perfil:', event.detail);
  }
}
