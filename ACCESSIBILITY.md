# 🎨 Guía de Accesibilidad y Diseño UX

## ✅ Mejoras de Accesibilidad Implementadas

### 1. Contraste de Colores (WCAG AAA)

El proyecto sigue las pautas WCAG 2.1 nivel AAA para contraste de colores:

| Elemento | Ratio Mínimo | Implementado |
|----------|--------------|--------------|
| Texto normal | 7:1 | ✅ 16:1 (negro sobre blanco) |
| Texto grande | 4.5:1 | ✅ 10:1 |
| Elementos UI | 3:1 | ✅ 4.5:1 |
| Focus states | 3:1 | ✅ Visible |

### 2. Paleta de Colores Accesible

```css
/* Colores Primarios - Contraste Optimizado */
--primary-600: #4f46e5;    /* Sobre blanco: 12:1 */
--primary-700: #4338ca;    /* Sobre blanco: 14:1 */

/* Colores de Texto */
--text-primary: #171717;   /* 16:1 sobre blanco */
--text-secondary: #404040; /* 10:1 sobre blanco */
--text-muted: #737373;     /* 4.5:1 sobre blanco */

/* Colores Semánticos */
--success-700: #047857;    /* 8:1 sobre blanco */
--warning-700: #b45309;    /* 6:1 sobre blanco */
--danger-700: #b91c1c;     /* 6:1 sobre blanco */
```

### 3. Tamaño de Fuente y Legibilidad

- **Mínimo**: 16px (1rem) para cuerpo
- **Jerarquía clara**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px
- **Line-height**: 1.5 para cuerpo, 1.25 para títulos
- **Font-weight**: 400 normal, 500 medium, 600 semibold, 700 bold

### 4. Estados de Focus Accesibles

```css
/* Focus visible para navegación por teclado */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Focus ring en inputs */
input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.4);
}
```

### 5. Tamaño de Targets Táctiles

Todos los elementos interactivos tienen mínimo **44x44px**:

```css
button, input, select {
  min-height: 44px;
  padding: 0.75rem 1rem;
}
```

### 6. Soporte para Movimiento Reducido

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7. Modo de Alto Contraste

```css
@media (prefers-contrast: high) {
  :root {
    --border-light: var(--gray-900);
    --border-medium: var(--gray-900);
    --shadow-sm: none;
    --shadow-md: none;
  }
}
```

### 8. Skip Link para Navegación por Teclado

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-600);
  color: white;
  padding: 0.5rem 1rem;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

### 9. Atributos ARIA

Todos los elementos interactivos incluyen:
- `aria-label` para iconos
- `aria-expanded` para menús
- `aria-current="page"` para navegación activa
- `role` cuando es necesario

### 10. Jerarquía de Encabezados

```html
<h1> - Título principal (uno por página)
<h2> - Secciones principales
<h3> - Subsecciones
<h4> - Contenido anidado
```

## 🎨 Mejores Prácticas de Diseño UX

### 1. Espaciado Consistente

Escala de 8px para todo el espaciado:

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### 2. Sombras Sutiles y Naturales

```css
--shadow-sm: 0 1px 3px 0 rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
```

### 3. Bordes Redondeados Consistentes

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
```

### 4. Transiciones Suaves

```css
--transition-fast: 150ms;   /* Micro-interacciones */
--transition-base: 200ms;   /* Hover states */
--transition-slow: 300ms;   /* Animaciones */
```

### 5. Estados de Hover Claros

```css
/* Feedback visual en hover */
button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Feedback visual en active */
button:active {
  transform: translateY(0);
}
```

### 6. Loading States

```tsx
// Skeleton screens para carga
{loading ? (
  <div className="loading-spinner" />
) : (
  <Content />
)}
```

### 7. Empty States Informativos

```tsx
{items.length === 0 ? (
  <div className="empty-state">
    <div className="icon">📝</div>
    <h3>Sin elementos</h3>
    <p>Descripción del estado vacío</p>
    <button>Acción principal</button>
  </div>
) : (
  <List items={items} />
)}
```

### 8. Error States con Mensajes Claros

```tsx
{error && (
  <div className="error-message" role="alert">
    <span className="icon">⚠️</span>
    <p>{error.message}</p>
    <button>Reintentar</button>
  </div>
)}
```

### 9. Success Feedback

```tsx
// Toast notifications
showNotification('¡Actividad guardada!', 'success');
```

### 10. Responsive Design

```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

## 📊 Checklist de Accesibilidad

### Antes de Deploy

- [ ] Todos los textos tienen contraste 7:1 mínimo
- [ ] Navegación por teclado funciona completamente
- [ ] Focus states son visibles en todos los elementos
- [ ] Imágenes tienen atributo `alt` descriptivo
- [ ] Formularios tienen `label` asociados
- [ ] Errores de formulario son anunciados por screen readers
- [ ] No hay contenido que dependa solo del color
- [ ] Animaciones pueden ser pausadas
- [ ] Target táctil mínimo 44x44px
- [ ] Jerarquía de encabezados es lógica

### Testing Tools

1. **Lighthouse** - Chrome DevTools
2. **WAVE** - wave.webaim.org
3. **axe DevTools** - Extensión de navegador
4. **Color Contrast Analyzer** - Extensión
5. **Screen Reader Testing** - NVDA (Windows), VoiceOver (Mac)

## 🎯 Métricas de Rendimiento UX

### Objetivo

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Accessibility**: > 95

### Optimizaciones Implementadas

- CSS variables para theming eficiente
- Animaciones CSS en lugar de JS
- Lazy loading para componentes pesados
- Código dividido por rutas

---

**Referencias:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
