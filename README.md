# Trato — Frontend

Frontend para una plataforma comunitaria que ayuda a las personas a conocer cómo son los procesos de selección de las empresas.

La ruta `/resena` contiene el formulario para compartir una experiencia de selección. Por ahora funciona como prototipo: muestra una vista previa, pero no guarda ni publica reseñas porque la API aún no está integrada.

## Estructura de `src`

- `pages/`: vistas de la aplicación, incluida la landing y el formulario de reseñas.
- `styles/blocks/`: tokens del diseño, estilos base, utilidades, layout y componentes compartidos.
- `styles/pages/`: estilos específicos de cada página.
- `main.tsx`: punto de entrada que monta la aplicación e importa los estilos globales.

Bootstrap 5 aporta la cuadrícula responsive y utilidades reutilizables. La capa visual sigue Fluent Design mediante tokens de color, foco accesible, superficies y elevaciones suaves; no se usa Fluent UI React.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

La búsqueda usa nombres y valoraciones ficticios de muestra en el frontend. La integración con la API y el envío real de experiencias quedan pendientes.
