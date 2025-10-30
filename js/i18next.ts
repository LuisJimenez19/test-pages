// dependencias

npm install i18next react-i18next zustand i18next-browser-languagedetector

// estructura 

src/
 ├── locales/
 │    ├── en/
 │    │    └── common.json
 │    └── es/
 │         └── common.json
 ├── i18n/
 │    ├── i18n.ts
 │    └── useTranslation.ts
 └── main.tsx

// archivos de traducción 

{
  "common": {
    "language": "Language",
    "actions": {
      "create": "Create",
      "edit": "Edit",
      "delete": "Delete",
      "assign": "Assign",
      "remove": "Remove"
    },
    "entities": {
      "users": {
        "title": "Users",
        "fields": {
          "name": "Name",
          "email": "Email",
          "role": "Role"
        },
        "notifications": {
          "created": "User created successfully",
          "updated": "User updated successfully"
        }
      },
      "groups": {
        "title": "Groups",
        "fields": {
          "name": "Group Name"
        }
      }
    }
  }
}


{
  "common": {
    "language": "Idioma",
    "actions": {
      "create": "Crear",
      "edit": "Editar",
      "delete": "Eliminar",
      "assign": "Asignar",
      "remove": "Remover"
    },
    "entities": {
      "users": {
        "title": "Usuarios",
        "fields": {
          "name": "Nombre",
          "email": "Correo",
          "role": "Rol"
        },
        "notifications": {
          "created": "Usuario creado correctamente",
          "updated": "Usuario actualizado correctamente"
        }
      },
      "groups": {
        "title": "Grupos",
        "fields": {
          "name": "Nombre del grupo"
        }
      }
    }
  }
}.

// configuración de i18n

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en/common.json";
import es from "@/locales/es/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;


// persistir el idioma

import { useTranslation as useI18NextTranslation } from "react-i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "./i18n";

type Lang = "en" | "es";

type I18nState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: (localStorage.getItem("i18nextLng") as Lang) || "en",
      setLang: (lang) => {
        i18n.changeLanguage(lang);
        set({ lang });
      },
    }),
    { name: "i18n-storage" }
  )
);

export const useTranslation = () => {
  const { t } = useI18NextTranslation();
  const { lang, setLang } = useI18nStore();
  return { t, lang, setLang };
};

/// ejemplo de uso

import React from "react";
import { useTranslation } from "@/i18n/useTranslation";

export function ExamplePage() {
  const { t, lang, setLang } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{t("common.entities.users.title")}</h1>

      <p>{t("common.entities.users.notifications.created")}</p>

      <button
        className="mt-4 p-2 border rounded"
        onClick={() => setLang(lang === "en" ? "es" : "en")}
      >
        {t("common.language")}: {lang.toUpperCase()}
      </button>
    </div>
  );
}



/// generar tipos

npm install typesafe-i18n --save-dev

src/
 ├── locales/
 │    ├── en/
 │    │    └── common.json
 │    └── es/
 │         └── common.json
 ├── i18n/
 │    ├── i18n.ts
 │    ├── useTranslation.ts
 │    └── types.d.ts   ← generado automáticamente

//packaje.json

{
  "scripts": {
    "i18n:types": "typesafe-i18n --output src/i18n/types.d.ts --input src/locales"
  }
}

// ejemplo con tipos generador

import { useTranslation as useI18NextTranslation } from "react-i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "./i18n";
import type { TranslationKey } from "./types"; // generado automáticamente

type Lang = "en" | "es";

type I18nState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: (localStorage.getItem("i18nextLng") as Lang) || "en",
      setLang: (lang) => {
        i18n.changeLanguage(lang);
        set({ lang });
      },
    }),
    { name: "i18n-storage" }
  )
);

export const useTranslation = () => {
  const { t } = useI18NextTranslation();
  const { lang, setLang } = useI18nStore();

  // Sobreescribimos `t` para tener tipos fuertes:
  const typedT = (key: TranslationKey, options?: any) => t(key, options);

  return { t: typedT, lang, setLang };
};

// siempre que cambien los archivos de traducción hay que generar los tipos npm run i18n:types o se puede agregar un watcher

npx typesafe-i18n --output src/i18n/types.d.ts --input src/locales --watch

