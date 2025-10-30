
// locales/en.json
{
  "common": {
    "yes": "Yes",
    "no": "No",
    "search": "Search",
    "actions": "Actions",
    "save": "Save",
    "cancel": "Cancel"
  },
  "actions": {
    "create": "Create",
    "edit": "Edit",
    "delete": "Delete",
    "assign": "Assign",
    "remove": "Remove",
    "view": "View"
  },
  "entities": {
    "users": {
      "title": "Users",
      "fields": {
        "name": "Name",
        "email": "Email"
      }
    },
    "groups": {
      "title": "Groups"
    },
    "roles": {
      "title": "Roles"
    },
    "clients": {
      "title": "Clients"
    }
  },
  "table": {
    "no_results": "No results found",
    "per_page": "per page"
  }
}

// loacale/es.json
{
  "common": {
    "yes": "Sí",
    "no": "No",
    "search": "Buscar",
    "actions": "Acciones",
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "actions": {
    "create": "Crear",
    "edit": "Editar",
    "delete": "Eliminar",
    "assign": "Asignar",
    "remove": "Quitar",
    "view": "Ver"
  },
  "entities": {
    "users": {
      "title": "Usuarios",
      "fields": {
        "name": "Nombre",
        "email": "Correo"
      }
    },
    "groups": {
      "title": "Grupos"
    },
    "roles": {
      "title": "Roles"
    },
    "clients": {
      "title": "Clientes"
    }
  },
  "table": {
    "no_results": "No se encontraron resultados",
    "per_page": "por página"
  }
}


// translations/typis.ts

import en from "@/locales/en.json";
import es from "@/locales/es.json";

export const translations = { en, es } as const;

export type TranslationObject = typeof translations;
export type Lang = keyof TranslationObject;

/**
 * Construye las rutas posibles tipo "entities.users.title"
 */
type DotPaths<T, Prev extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, any>
    ? DotPaths<T[K], `${Prev}${K}.`>
    : `${Prev}${K}`;
}[keyof T & string];

/** Claves válidas dentro de un idioma */
type LangKeys<T extends Record<string, any>> = {
  [K in keyof T & string]: DotPaths<T[K]>;
}[keyof T & string];

export type BaseTranslationKeys = LangKeys<TranslationObject[Lang]>;
export type Interpolation = Record<string, string | number | boolean>;


// store

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, Lang, BaseTranslationKeys, Interpolation } from "./types";

type I18nState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: BaseTranslationKeys, vars?: Interpolation, fallback?: string) => string;
};

export const useTranslationStore = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: "es",
      setLang: (lang) => set({ lang }),

      t: (key, vars, fallback) => {
        const lang = get().lang;
        const [namespace, subkey] = key.includes(".")
          ? key.split(/\\.(.+)/)
          : ["common", key];

        // @ts-expect-error acceso dinámico
        let value: string | undefined = translations[lang]?.[namespace]?.[subkey];

        if (typeof value !== "string") {
          if (fallback) return fallback;
          // fallback a inglés
          // @ts-expect-error acceso dinámico
          value = translations["en"]?.[namespace]?.[subkey] ?? key;
        }

        if (vars) {
          return Object.keys(vars).reduce((acc, k) => {
            const v = String(vars[k]);
            return acc.split(`{{${k}}}`).join(v);
          }, value as string);
        }

        return value as string;
      },
    }),
    {
      name: "i18n-storage",
      partialize: (s) => ({ lang: s.lang }),
    }
  )
);


// hook

import { useTranslationStore } from "./store";

export function useTranslation() {
  const lang = useTranslationStore((s) => s.lang);
  const setLang = useTranslationStore((s) => s.setLang);
  const t = useTranslationStore((s) => s.t);
  return { lang, setLang, t } as const;
}

// ejemplo 

import { useTranslation } from "@/i18n";

export function UsersTableHeader() {
  const { t } = useTranslation();

  return (
    <header>
      <h2>{t("entities.users.title")}</h2>
      <button>{t("actions.create")}</button>
    </header>
  );
}