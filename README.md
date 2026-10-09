# Trato — Frontend

Frontend para una plataforma comunitaria que ayuda a las personas a conocer cómo son los procesos de selección de las empresas.

La ruta `/resena` contiene el formulario para compartir una experiencia de selección. Requiere una sesión de Firebase Authentication. Por ahora funciona como prototipo: muestra una vista previa, pero no guarda ni publica reseñas porque la API de reseñas aún no está integrada.

## Estructura de `src`

- `pages/`: vistas de la aplicación, incluida la landing y el formulario de reseñas.
- `firebase.ts`: configuración del cliente Firebase y persistencia de sesión mediante Firebase Authentication.
- `styles/blocks/`: tokens del diseño, estilos base, utilidades, layout y componentes compartidos.
- `styles/pages/`: estilos específicos de cada página.
- `main.tsx`: punto de entrada que monta la aplicación e importa los estilos globales.

Bootstrap 5 aporta la cuadrícula responsive y utilidades reutilizables. La capa visual sigue Fluent Design mediante tokens de color, foco accesible, superficies y elevaciones suaves; no se usa Fluent UI React.

## Desarrollo

```bash
npm install
npm run dev
```

## Configurar Firebase Authentication

1. Crea o abre el proyecto de Trato en [Firebase Console](https://console.firebase.google.com/).
2. Añade una aplicación web y copia sus valores de configuración.
3. En **Authentication → Sign-in method**, habilita **Email/Password**.
4. Copia `.env.example` a `.env.local` y completa `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` y `VITE_FIREBASE_MESSAGING_SENDER_ID`.
5. Reinicia Vite después de modificar `.env.local`.

Los valores `VITE_*` se incorporan al bundle del navegador; la configuración web de Firebase no es una credencial de servidor. No pongas claves de cuenta de servicio, contraseñas ni secretos privados en variables `VITE_*`. `.env.local` está excluido de Git.

La pantalla permite crear cuentas de correo/contraseña, iniciar/cerrar sesión y solicitar restablecimiento. Firebase Authentication restaura la sesión al volver a cargar la aplicación y `/resena` queda detrás de ella. Para probar localmente, se puede configurar el Authentication Emulator con `VITE_FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099` (solo en desarrollo).

La opción de mostrar el nombre se conserva temporalmente en el navegador y **no se sincroniza entre dispositivos**. Hay que guardarla en un perfil de Firestore o en la API antes de tratarla como preferencia permanente. Firebase Authentication gestiona identidad y credenciales; la API de Spring Boot debe validar el ID token en cada operación protegida.

## Producción

```bash
npm run build
npm run preview
```

La búsqueda usa nombres y valoraciones ficticios de muestra en el frontend. El envío real de experiencias y la persistencia de perfiles/preferencias quedan pendientes.
