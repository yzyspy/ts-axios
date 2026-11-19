// number 数字类型
let a: number = 1.0
console.log(a)

// string 字符串类型
let str: string = 'hello world'
console.log(str)

// boolean 布尔类型
let isDone: boolean = false
console.log(isDone)

// array 数组类型
let arr: number[] = [1, 2, 3]
console.log(arr)

let array: Array<number> = [1, 2, 3, 3]
console.log(array)

let set: Set<number> = new Set([1, 2, 3])
console.log(set)

// tuple 元组类型
let tuple: [string, number] = ['hello', 1]
console.log(tuple)

// enum 枚举类型
enum Color { Red, Green, Blue }
let c: Color = Color.Green
console.log(c)

// any 任意类型
let notSure: any = 4
console.log(notSure)

let anyArr: any[] = [1, 2, 3, 3, 'a', "b"]
console.log(anyArr)

// null 和 undefined
let u: undefined = undefined
let n: null = null
console.log(u)
console.log(n)

// object 对象类型
let obj: object = { name: 'Alice', age: 18 }
console.log(obj)

// symbol 符号类型
let sym: symbol = Symbol('foo')
console.log(sym)

// bigint 大整数类型
let bigInt: bigint = BigInt(9007199254740991)
console.log(bigInt)

