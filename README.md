# oredon-compiler

Cli compiler for Oredon programming language. I really like the idea of two-dimensional programming languages so I created one of my own. It is a really weird one (not even starting on a fact that it is written in JavaScript) but it has variables, expressions, conditions, I/O, etc. so it kind of works like a programming language for simple loopy algorithms.

_I'm currently in progress of creating `oredon-runtime` so there is a possibility to run instructions `oredon-compiler` creates._

I came up with a syntax, for example `examples/counter.ore`

```
[@;\a;\n;>] [a<=n?>] [/a; v]
           [a=a+1;^]     [<]
```

_Just to breifly clarify what it does at runtime. It starts at "@". Prompts input into variable "a". Prompts input into variable "n". Goes to right. Checks if "a" is less than or equal to "n", it if is, it goes to the right. Outputs "a". Goes down. Goes left. Adds 1 to "a". Goes Up. Repeats the process from that condition operation._

I'm sure that wasn't a clarification at all, but it gets worse in `examples/counter.ins.ore`

```
0 0 e
0 1 i a
0 2 i n
0 3 m 1
1 0 c a n 2 2
2 0 o a
2 1 m 4
3 0 a a a+1
3 1 m 1
4 0 m 3
```

That is what this compiler does, it turns syntax into instructions

```
$ yarn oredon --input examples/counter.ore --output examples/counter.ins.ore
```

## Installation

```
$ git clone https://github.com/martyzz/oredon-compiler.git
$ cd oredon-compiler
$ yarn install
$ yarn test
```
