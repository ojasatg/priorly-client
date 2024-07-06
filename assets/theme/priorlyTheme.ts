// todo: delete this file if not used
export const priorlyTheme = {
    name: "priorly-theme",
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `Noto Sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Inter', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        "--theme-font-family-heading": `Noto Sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Inter', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        "--theme-font-color-base": "0 0 0",
        "--theme-font-color-dark": "255 255 255",
        "--theme-rounded-base": "4px",
        "--theme-rounded-container": "8px",
        "--theme-border-base": "2px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "255 255 255",
        "--on-secondary": "255 255 255",
        "--on-tertiary": "255 255 255",
        "--on-success": "0 0 0",
        "--on-warning": "0 0 0",
        "--on-error": "255 255 255",
        "--on-surface": "0 0 0",
        // =~= Theme Colors  =~=
        // primary | #1877F2
        "--color-primary-50": "220 235 253", // #dcebfd
        "--color-primary-100": "209 228 252", // #d1e4fc
        "--color-primary-200": "197 221 252", // #c5ddfc
        "--color-primary-300": "163 201 250", // #a3c9fa
        "--color-primary-400": "93 160 246", // #5da0f6
        "--color-primary-500": "24 119 242", // #1877F2
        "--color-primary-600": "22 107 218", // #166bda
        "--color-primary-700": "18 89 182", // #1259b6
        "--color-primary-800": "14 71 145", // #0e4791
        "--color-primary-900": "12 58 119", // #0c3a77
        // secondary | #2D3F7B
        "--color-secondary-50": "224 226 235", // #e0e2eb
        "--color-secondary-100": "213 217 229", // #d5d9e5
        "--color-secondary-200": "203 207 222", // #cbcfde
        "--color-secondary-300": "171 178 202", // #abb2ca
        "--color-secondary-400": "108 121 163", // #6c79a3
        "--color-secondary-500": "45 63 123", // #2D3F7B
        "--color-secondary-600": "41 57 111", // #29396f
        "--color-secondary-700": "34 47 92", // #222f5c
        "--color-secondary-800": "27 38 74", // #1b264a
        "--color-secondary-900": "22 31 60", // #161f3c
        // tertiary | #283544
        "--color-tertiary-50": "223 225 227", // #dfe1e3
        "--color-tertiary-100": "212 215 218", // #d4d7da
        "--color-tertiary-200": "201 205 208", // #c9cdd0
        "--color-tertiary-300": "169 174 180", // #a9aeb4
        "--color-tertiary-400": "105 114 124", // #69727c
        "--color-tertiary-500": "40 53 68", // #283544
        "--color-tertiary-600": "36 48 61", // #24303d
        "--color-tertiary-700": "30 40 51", // #1e2833
        "--color-tertiary-800": "24 32 41", // #182029
        "--color-tertiary-900": "20 26 33", // #141a21
        // success | #65F40D
        "--color-success-50": "232 253 219", // #e8fddb
        "--color-success-100": "224 253 207", // #e0fdcf
        "--color-success-200": "217 252 195", // #d9fcc3
        "--color-success-300": "193 251 158", // #c1fb9e
        "--color-success-400": "147 247 86", // #93f756
        "--color-success-500": "101 244 13", // #65F40D
        "--color-success-600": "91 220 12", // #5bdc0c
        "--color-success-700": "76 183 10", // #4cb70a
        "--color-success-800": "61 146 8", // #3d9208
        "--color-success-900": "49 120 6", // #317806
        // warning | #F6DF0B
        "--color-warning-50": "254 250 218", // #fefada
        "--color-warning-100": "253 249 206", // #fdf9ce
        "--color-warning-200": "253 247 194", // #fdf7c2
        "--color-warning-300": "251 242 157", // #fbf29d
        "--color-warning-400": "249 233 84", // #f9e954
        "--color-warning-500": "246 223 11", // #F6DF0B
        "--color-warning-600": "221 201 10", // #ddc90a
        "--color-warning-700": "185 167 8", // #b9a708
        "--color-warning-800": "148 134 7", // #948607
        "--color-warning-900": "121 109 5", // #796d05
        // error | #E80135
        "--color-error-50": "252 217 225", // #fcd9e1
        "--color-error-100": "250 204 215", // #faccd7
        "--color-error-200": "249 192 205", // #f9c0cd
        "--color-error-300": "246 153 174", // #f699ae
        "--color-error-400": "239 77 114", // #ef4d72
        "--color-error-500": "232 1 53", // #E80135
        "--color-error-600": "209 1 48", // #d10130
        "--color-error-700": "174 1 40", // #ae0128
        "--color-error-800": "139 1 32", // #8b0120
        "--color-error-900": "114 0 26", // #72001a
        // surface | #F5F5F5
        "--color-surface-50": "254 254 254", // #fefefe
        "--color-surface-100": "253 253 253", // #fdfdfd
        "--color-surface-200": "253 253 253", // #fdfdfd
        "--color-surface-300": "251 251 251", // #fbfbfb
        "--color-surface-400": "248 248 248", // #f8f8f8
        "--color-surface-500": "245 245 245", // #F5F5F5
        "--color-surface-600": "221 221 221", // #dddddd
        "--color-surface-700": "184 184 184", // #b8b8b8
        "--color-surface-800": "147 147 147", // #939393
        "--color-surface-900": "120 120 120", // #787878
    },
    properties_dark: {
        "--color-primary-50": "217 217 217", // #d9d9d9
        "--color-primary-100": "204 204 204", // #cccccc
        "--color-primary-200": "191 191 191", // #bfbfbf
        "--color-primary-300": "153 153 153", // #999999
        "--color-primary-400": "77 77 77", // #4d4d4d
        "--color-primary-500": "0 0 0", // #000000
        "--color-primary-600": "0 0 0", // #000000
        "--color-primary-700": "0 0 0", // #000000
        "--color-primary-800": "0 0 0", // #000000
        "--color-primary-900": "0 0 0", // #000000
    },
};
