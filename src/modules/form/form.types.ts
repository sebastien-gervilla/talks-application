export type FormHandler<Value, Event = any> = (event: FormEvent<Value, Event>) => void

export interface FormEvent<Value, Event> {
    name: string
    value: Value
    base: Event
}