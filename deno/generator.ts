import type { Promisify } from "./types"

export abstract class NeomanGenerator {

  abstract run(): Promisify<void>
  
}
