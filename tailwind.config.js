import tailwindForms from "@tailwindcss/forms";
import stwui from "stwui/plugin";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

export default {
    darkMode: "selector",
    content: ["./src/**/*.{html,js,svelte,ts}", "./node_modules/stwui/**/*.{svelte,js,ts,html}"],
    theme: {
        extend: {
            colors: {
                primary: "rgba(var(--primary))",
                secondary: "rgba(var(--secondary))",
                tertiary: "rgba(var(--tertiary))",

                success: "rgba(var(--success))",
                info: "rgba(var(--info))",
                warning: "rgba(var(--warning))",
                error: "rgba(var(--error))",

                surface: "rgba(var(--surface))",
            },
        },
    },
    plugins: [
        tailwindForms,
        stwui,
        iconsPlugin({
            collections: getIconCollections(["mdi"]),
        }),
    ],
    stwui: {
        themes: ["light", "dark"],
    },
};
