import { shell } from "electron";
import type Strategy from "./Strategy.ts";
import { resolve } from 'path'
import { coreDir } from "../paths.ts";
import { exec } from "child_process";
export default function editStrategy(strategy: Strategy) {
    exec(`notepad "${resolve(coreDir, strategy.fullName)}"`)
}