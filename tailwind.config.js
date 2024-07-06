import { join } from "path";
import { skeleton } from "@skeletonlabs/tw-plugin";
import tailwindForms from "@tailwindcss/forms";

import { priorlyTheme } from "./assets/theme/priorlyTheme";

export default {
    darkMode: "selector",
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
    ],
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
        skeleton({
            themes: {
                custom: [priorlyTheme],
            },
        }),
        tailwindForms,
    ],
};
