import React from "react"; import create from "zustand"; import { persist } from "zustand/middleware";

/* i18n + Zustand + TypeScript

Autocompletado fuerte para claves (keys) derivadas desde translations

Persistencia del idioma elegido (localStorage)

Hook useTranslation (nombre solicitado)

Estructura de traducciones pensada para un backoffice (entidades, acciones, tablas, forms, notificaciones)


Nota: Esto es una implementación mínima y opinionada. No soporta pluralización ni ICU — si necesitás pluralización/formatting avanzado o externalización de archivos, usar i18next o formatjs. */

/* ----------------------------- Translations ----------------------------- */ export const translations = { en: { common: { yes: "Yes", no: "No", search: "Search", actions: "Actions", save: "Save", cancel: "Cancel", },

actions: {
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  assign: "Assign",
  remove: "Remove",
  view: "View",
},

entities: {
  users: {
    title: "Users",
    singular: "User",
    create_title: "Create user",
    edit_title: "Edit user",
    fields: {
      id: "ID",
      name: "Name",
      email: "Email",
      roles: "Roles",
      groups: "Groups",
    },
    actions: {
      assign_role: "Assign role",
      remove_role: "Remove role",
      add_to_group: "Add to group",
      remove_from_group: "Remove from group",
    },
    notifications: {
      created: "User created successfully",
      updated: "User updated",
      deleted: "User deleted",
    },
  },

  groups: {
    title: "Groups",
    singular: "Group",
    create_title: "Create group",
    edit_title: "Edit group",
    fields: {
      id: "ID",
      name: "Name",
      members: "Members",
    },
    actions: {
      add_user: "Add user",
      remove_user: "Remove user",
      assign_role: "Assign role",
      remove_role: "Remove role",
    },
    notifications: {
      created: "Group created",
      updated: "Group updated",
      deleted: "Group removed",
    },
  },

  roles: {
    title: "Roles",
    singular: "Role",
    categories: {
      client: "Client roles",
      realm: "Realm roles",
    },
    fields: {
      id: "ID",
      name: "Name",
      description: "Description",
    },
    notifications: {
      created: "Role created",
      updated: "Role updated",
      deleted: "Role deleted",
    },
  },

  clients: {
    title: "Clients",
    singular: "Client",
    fields: {
      id: "ID",
      clientId: "Client ID",
      name: "Name",
    },
    roles: {
      title: "Client roles",
      actions: {
        create: "Create client role",
        edit: "Edit client role",
        delete: "Delete client role",
      },
    },
    mappers: {
      title: "Mappers",
    },
    scopes: {
      title: "Scopes",
      actions: {
        create: "Create scope",
        edit: "Edit scope",
        delete: "Delete scope",
      },
      mappers: {
        title: "Scope mappers",
      },
    },
    notifications: {
      created: "Client created",
      updated: "Client updated",
      deleted: "Client deleted",
    },
  },
},

table: {
  no_results: "No results found",
  per_page: "per page",
  page_of: "Page {page} of {total}",
},

forms: {
  validation: {
    required: "This field is required",
    invalid_email: "Invalid email",
  },
},

notifications: {
  success: "Success",
  error: "Error",
},

},

es: { common: { yes: "Sí", no: "No", search: "Buscar", actions: "Acciones", save: "Guardar", cancel: "Cancelar", },

actions: {
  create: "Crear",
  edit: "Editar",
  delete: "Eliminar",
  assign: "Asignar",
  remove: "Quitar",
  view: "Ver",
},

entities: {
  users: {
    title: "Usuarios",
    singular: "Usuario",
    create_title: "Crear usuario",
    edit_title: "Editar usuario",
    fields: {
      id: "ID",
      name: "Nombre",
      email: "Correo",
      roles: "Roles",
      groups: "Grupos",
    },
    actions: {
      assign_role: "Asignar rol",
      remove_role: "Quitar rol",
      add_to_group: "Agregar a grupo",
      remove_from_group: "Quitar del grupo",
    },
    notifications: {
      created: "Usuario creado correctamente",
      updated: "Usuario actualizado",
      deleted: "Usuario eliminado",
    },
  },

  groups: {
    title: "Grupos",
    singular: "Grupo",
    create_title: "Crear grupo",
    edit_title: "Editar grupo",
    fields: {
      id: "ID",
      name: "Nombre",
      members: "Miembros",
    },
    actions: {
      add_user: "Agregar usuario",
      remove_user: "Quitar usuario",
      assign_role: "Asignar rol",
      remove_role: "Quitar rol",
    },
    notifications: {
      created: "Grupo creado",
      updated: "Grupo actualizado",
      deleted: "Grupo eliminado",
    },
  },

  roles: {
    title: "Roles",
    singular: "Rol",
    categories: {
      client: "Roles de cliente",
      realm: "Roles de reino",
    },
    fields: {
      id: "ID",
      name: "Nombre",
      description: "Descripción",
    },
    notifications: {
      created: "Rol creado",
      updated: "Rol actualizado",
      deleted: "Rol eliminado",
    },
  },

  clients: {
    title: "Clientes",
    singular: "Cliente",
    fields: {
      id: "ID",
      clientId: "Client ID",
      name: "Nombre",
    },
    roles: {
      title: "Roles cliente",
      actions: {
        create: "Crear rol de cliente",
        edit: "Editar rol de cliente",
        delete: "Eliminar rol de cliente",
      },
    },
    mappers: {
      title: "Mappers",
    },
    scopes: {
      title: "Scopes",
      actions: {
        create: "Crear scope",
        edit: "Editar scope",
        delete: "Eliminar scope",
      },
      mappers: {
        title: "Scope mappers",
      },
    },
    notifications: {
      created: "Cliente creado",
      updated: "Cliente actualizado",
      deleted: "Cliente eliminado",
    },
  },
},

table: {
  no_results: "No se encontraron resultados",
  per_page: "por página",
  page_of: "Página {page} de {total}",
},

forms: {
  validation: {
    required: "Este campo es obligatorio",
    invalid_email: "Correo inválido",
  },
},

notifications: {
  success: "Éxito",
  error: "Error",
},

}, } as const;

/* --------------------------------- Types --------------------------------- */ export type TranslationObject = typeof translations; export type Lang = keyof TranslationObject;

// Helper type to build dot paths from nested objects type DotPaths<T, Prev extends string = ""> = { [K in keyof T & string]: T[K] extends Record<string, any> ? DotPaths<T[K], ${Prev}${K}.> : ${Prev}${K}; }[keyof T & string];

// Keys for a single language (without the lang prefix) type LangKeys<T extends Record<string, any>> = { [K in keyof T & string]: DotPaths<T[K]>; }[keyof T & string];

export type BaseTranslationKeys = LangKeys<TranslationObject[Lang]>;

/* --------------------------------- Store --------------------------------- */ export type Interpolation = Record<string, string | number | boolean>;

type I18nState = { lang: Lang; setLang: (lang: Lang) => void; t: (key: BaseTranslationKeys, vars?: Interpolation, fallback?: string) => string; };

export const useTranslationStore = create<I18nState>( persist( (set, get) => ({ lang: "es", setLang: (lang: Lang) => set({ lang }),

t: (rawKey, vars, fallback) => {
    const lang = get().lang;

    const [namespace, key] = rawKey.includes(".")
      ? rawKey.split(/\.(.+)/)
      : ["common", rawKey];

    // @ts-expect-error dynamic access from translations
    const ns = (translations as any)[lang]?.[namespace];
    let value: string | undefined = undefined;

    if (ns) value = ns[ key ];

    if (typeof value !== "string") {
      if (fallback !== undefined) return fallback;
      // fallback to English if missing
      // @ts-expect-error
      value = (translations as any)["en"]?.[namespace]?.[key] ?? rawKey;
    }

    if (vars) {
      return Object.keys(vars).reduce((acc, k) => {
        const v = String((vars as any)[k]);
        return acc.split(`{{${k}}}`).join(v);
      }, value as string);
    }

    return value as string;
  },
}),
{
  name: "i18n-storage", // localStorage key
  partialize: (state) => ({ lang: state.lang }),
}

) );

/* ----------------------------- Public hook ------------------------------- */ export function useTranslation() { const lang = useTranslationStore((s) => s.lang); const setLang = useTranslationStore((s) => s.setLang); const t = useTranslationStore((s) => s.t); return { lang, setLang, t } as const; }

/* --------------------------- Example components -------------------------- */ export function LanguageSwitcher() { const { lang, setLang, t } = useTranslation(); return ( <div style={{ display: "flex", gap: 8, alignItems: "center" }}> <label htmlFor="lang">{t("common.actions")}</label> <select id="lang" value={lang} onChange={(e) => setLang(e.target.value as Lang)}> <option value="es">Español</option> <option value="en">English</option> </select> </div> ); }

export function ExampleUsage() { const { t } = useTranslation(); return ( <div> <h2>{t("entities.users.title")}</h2> <button>{t("actions.create")}</button> </div> ); }

/* ------------------------------- Notas ---------------------------------- */ // Convenciones recomendadas (ver README en el proyecto): // - namespaces principales: common, actions, entities, table, forms, notifications // - entities.X: para cada entidad — fields, actions, notifications, titles // - acciones reutilizables: actions.create / actions.edit / actions.delete // - keys usan snake_case o camelCase según preferencia del proyecto; aquí usamos camelCase para campos // - Para pluralización y formatos: usar i18next o intl (formatjs)

// Integración rápida: // import { useTranslation } from './i18n-zustand'; // const { t, setLang } = useTranslation(); // t('entities.users.fields.email') // autocompleta gracias a BaseTranslationKeys

// Podés extender translations exportando/consumiendo JSONs separados por idioma y recomponer el tipo // (manteniendo la inferencia) si lo necesitás.