import { RegisterHandlersFor } from "../HandlersRegistrator.ts";
import FakeManager from "./FakeManager.ts";

export default function InitFakeHandlers() {
    RegisterHandlersFor(FakeManager, [
        "init"
    ])
}