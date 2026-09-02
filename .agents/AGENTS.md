# Reglas de Desarrollo y Control de Versiones - MFE Reportes (`mfe_tardigitales_reportes`)

Este documento contiene las reglas de cumplimiento obligatorio para el agente en este microfrontend Angular.

---

## 1. Política Estricta de Ramas y Git Push

- **Regla:** **NUNCA** hacer `git push` directo a la rama `master` o `main`.
- **Preproducción:** La rama final donde converge todo es `master`.
- **Estrategia de Ramas:**
  - Cada desarrollo, corrección o ajuste DEBE realizarse y enviarse en una rama con el formato:
    ```powershell
    feature/nombre_del_ajuste
    ```
  - Si el repositorio se encuentra en `master`, crear la rama correspondiente antes de realizar commits:
    ```powershell
    git checkout -b feature/nombre_del_ajuste
    git push -u origin feature/nombre_del_ajuste
    ```

---

## 2. Pipeline Automatizado de Pull Requests (Feature -> Dev -> QA -> Master)

- **Regla:** Cuando el usuario solicite procesar o fusionar los cambios hacia preproducción/master:
  ```powershell
  cmd /c "E:\laragon\nx\angular\azure_pr_pipeline.bat reportes"
  ```

---

## 3. Compilación y Empaquetado Automático Obligatorio

- **Regla:** Cada vez que se modifique código fuente de este MFE, compilar automáticamente:
  ```powershell
  cmd /c "E:\laragon\nx\angular\nx_manager.bat build reportes"
  ```

---

## 4. Gestión y Reinicio del Contenedor Docker

- **Regla:** Para reiniciar o reconstruir el contenedor Docker del MFE de Reportes en modo CLI (0 pausas):
  ```powershell
  cmd /c "E:\laragon\nx\angular\nx_manager.bat up reportes"
  ```
- **Deploy en 1 solo paso (Build + Docker):**
  ```powershell
  cmd /c "E:\laragon\nx\angular\nx_manager.bat deploy reportes"
  ```
