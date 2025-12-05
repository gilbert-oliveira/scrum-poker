# Frontend Guidelines

## Padrões de Código

### Estrutura de Pastas

Utilizaremos a estrutura padrão do **Next.js App Router**:

```
src/
  app/
    (public)/        # Rotas públicas (landing page, login)
    (app)/           # Rotas autenticadas ou do app principal
      rooms/
        [id]/
          page.tsx
    layout.tsx
    globals.css
  components/
    ui/              # Componentes de UI genéricos (Button, Input) - shadcn/ui like
    poker/           # Componentes específicos do domínio (PokerCard, Table)
    layout/          # Header, Footer
  lib/
    firebase.ts      # Inicialização do Firebase
    store.ts         # Store do Zustand
    utils.ts         # Helpers
  hooks/             # Custom Hooks
```

### Nomenclatura

- **Componentes**: PascalCase (ex: `PokerCard.tsx`, `CreateRoomForm.tsx`)
- **Funções/Hooks**: camelCase (ex: `useRoom`, `calculateAverage`)
- **Diretórios**: kebab-case (ex: `user-profile`, `settings`)

## Estilização (TailwindCSS)

- Utilizar classes utilitárias diretamente no JSX.
- Para classes condicionais complexas, usar `clsx` ou `tailwind-merge`.
- **Theming**: Utilizar variáveis CSS no `globals.css` para cores do tema (ex: `--primary`, `--background`) para facilitar Dark Mode.

### Exemplo de Componente

```tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded px-4 py-2 font-medium transition-colors",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" &&
          "bg-gray-200 text-gray-900 hover:bg-gray-300",
        className
      )}
      {...props}
    />
  );
}
```

## Gerenciamento de Estado

### Server State (Dados do Backend)

- Utilizar listeners do Firestore (`onSnapshot`) dentro de hooks customizados (`useRoomSubscription`).
- Evitar `useEffect` desnecessários para data fetching.

### Client State

- Utilizar **Zustand** para estado global da aplicação (ex: preferências do usuário, estado temporário da UI).
- Utilizar `useState` para estado local de componentes simples (ex: input de formulário, estado 'aberto/fechado' de um modal).

## Performance (Core Web Vitals)

- Otimizar imagens com `next/image`.
- Code splitting automático (padrão Next.js).
- Minimizar re-renders em componentes Realtime.
