import type { Usuario } from "./Usuario";

declare module '#auth-utils' {
    interface User extends Usuario { }
}

export { }