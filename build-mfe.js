const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'dist', 'mfe-tardigitales-reportes', 'browser');
const destDir = path.join(__dirname, 'dist', 'mfe-tardigitales-reportes-mfe');

async function buildMfe() {
  try {
    console.log('Iniciando empaquetado del Microfrontend de Reportes...');

    if (!fs.existsSync(srcDir)) {
      throw new Error(`El directorio de origen no existe: ${srcDir}.`);
    }

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = fs.readdirSync(srcDir);
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.endsWith('.map') && !f.includes('txt'));
    
    jsFiles.sort((a, b) => {
      if (a.includes('polyfills')) return -1;
      if (b.includes('polyfills')) return 1;
      return 0;
    });

    console.log('Archivos JS detectados:', jsFiles);

    let concatenatedJs = '';
    for (const file of jsFiles) {
      const filePath = path.join(srcDir, file);
      concatenatedJs += `\n/* --- Bundle: ${file} --- */\n`;
      concatenatedJs += fs.readFileSync(filePath, 'utf8');
    }

    const outputJsPath = path.join(destDir, 'mfe-tardigitales-reportes.js');
    fs.writeFileSync(outputJsPath, concatenatedJs, 'utf8');
    console.log(`¡JS unificado creado en: ${outputJsPath}!`);

    const cssFiles = files.filter(f => f.endsWith('.css') && !f.endsWith('.map'));
    let concatenatedCss = '';
    for (const file of cssFiles) {
      const filePath = path.join(srcDir, file);
      concatenatedCss += `\n/* --- Estilos: ${file} --- */\n`;
      concatenatedCss += fs.readFileSync(filePath, 'utf8');
    }

    const outputCssPath = path.join(destDir, 'mfe-tardigitales-reportes.css');
    fs.writeFileSync(outputCssPath, concatenatedCss, 'utf8');
    console.log(`¡CSS unificado creado en: ${outputCssPath}!`);

    // Copiar layout.js y layout.css desde wc_admin_layout
    const wcLayoutJs = path.join(__dirname, '..', 'wc_admin_layout', 'dist', 'layout.js');
    const wcLayoutCss = path.join(__dirname, '..', 'wc_admin_layout', 'dist', 'layout.css');
    
    if (fs.existsSync(wcLayoutJs)) {
      fs.copyFileSync(wcLayoutJs, path.join(destDir, 'layout.js'));
    } else if (fs.existsSync(path.join(__dirname, 'public', 'layout.js'))) {
      fs.copyFileSync(path.join(__dirname, 'public', 'layout.js'), path.join(destDir, 'layout.js'));
    }

    if (fs.existsSync(wcLayoutCss)) {
      fs.copyFileSync(wcLayoutCss, path.join(destDir, 'layout.css'));
    } else if (fs.existsSync(path.join(__dirname, 'public', 'layout.css'))) {
      fs.copyFileSync(path.join(__dirname, 'public', 'layout.css'), path.join(destDir, 'layout.css'));
    }

    const assetsSrc = path.join(srcDir, 'assets');
    const assetsDest = path.join(destDir, 'assets');
    if (fs.existsSync(assetsSrc)) {
      fs.cpSync(assetsSrc, assetsDest, { recursive: true });
    }

    const indexHtmlContent = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Reportes y Analítica - Nexura Platform</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="layout.css">
    <link rel="stylesheet" href="mfe-tardigitales-reportes.css">
    <script src="layout.js" type="module"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
  </head>
  <body>
    <app-root></app-root>
    <script src="mfe-tardigitales-reportes.js" type="module"></script>
  </body>
</html>`;

    fs.writeFileSync(path.join(destDir, 'index.html'), indexHtmlContent, 'utf8');
    console.log('Empaquetado de mfe_tardigitales_reportes finalizado exitosamente.');
  } catch (error) {
    console.error('Error durante el build del MFE:', error);
    process.exit(1);
  }
}

buildMfe();
