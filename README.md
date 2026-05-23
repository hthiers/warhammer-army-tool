# Herramienta de Ejército — Warhammer 40K 10ª Edición

Herramienta web personal para consultar fichas de unidad, doctrinas y estratagemas durante una partida.

## Stack

- **React 18** + **TypeScript**
- **Vite** (bundler)
- **CSS Modules** (estilos con scope por componente)
- Sin dependencias de UI externas

## Arrancar en local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Build para producción

```bash
npm run build
```

Los archivos estáticos se generan en `dist/`. Puedes subirlos a GitHub Pages,
Netlify o cualquier servidor de archivos estáticos.

## Estructura del proyecto

```
src/
├── types/           # Interfaces TypeScript (Unidad, Doctrina, Estratagema…)
├── data/
│   ├── unidades.ts  # Fichas de cada unidad
│   ├── doctrinas.ts # Doctrinas por destacamento
│   └── estratagemas.ts  # Estratagemas por destacamento
└── components/
    ├── Topbar/      # Cabecera: facción y selector de destacamento
    ├── Sidebar/     # Lista de unidades
    ├── DataSheet/   # Ficha de unidad (stats, armas, habilidades)
    ├── AbilitiesPanel/  # Panel lateral de estratagemas aplicables
    ├── DoctrineList/    # Vista de doctrinas del destacamento
    └── StratagemList/   # Vista de estratagemas del destacamento
```

## Añadir unidades

Edita `src/data/unidades.ts` y añade un nuevo objeto siguiendo la interfaz `Unidad`:

```ts
{
  id: 'mi-unidad',
  nombre: 'Nombre de la unidad',
  pts: 100,
  color: '#aabbcc',          // color del punto en el sidebar
  palabrasClave: ['Infantería', 'Primaris', ...],
  stats: { MOV: '6"', RES: 4, HER: 2, SALV: '3+', INV: '-', LID: '6+', OC: 1 },
  distancia: [...],
  combate: [...],
  habilidades: [...],
  estratagemasRelacionadas: ['id-estratagema-1', 'id-estratagema-2'],
}
```

## Añadir un destacamento

1. Agrega la entrada en `DESTACAMENTOS` dentro de `src/data/doctrinas.ts`
2. Añade sus doctrinas en `DOCTRINAS[nuevoId]`
3. Añade sus estratagemas en `ESTRATAGEMAS[nuevoId]` dentro de `src/data/estratagemas.ts`
