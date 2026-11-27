import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    // Existing React Compiler diagnostics remain visible as warnings during migration.
    // Do not suppress the warnings; address them in a dedicated UI refactor.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/use-memo": "warn",
      "react/jsx-no-comment-textnodes": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "backup/**", "site-backup-*/**"]),
])
