# BJB
<div align="center">
  <a href="https://github.com/bjb-cli/bjb"><img src="docs/bjb.png" alt="BJB"></a>
  <p>一个基于模板机制、简单而又强大的脚手架工具，用于提升个人生产力。</p>
  <p>
    <a href="https://codecov.io/gh/bjb-cli/bjb"><img src="https://img.shields.io/codecov/c/github/bjb-cli/bjb" alt="测试覆盖率"></a>
    <a href="https://github.com/bjb-cli/bjb/blob/master/LICENSE"><img src="https://img.shields.io/github/license/bjb-cli/bjb" alt="许可证"></a>
    <a href="https://npm.im/bjb"><img src="https://img.shields.io/npm/v/bjb" alt="NPM 版本"></a>
    <a href="https://npm.im/bjb"><img src="https://img.shields.io/node/v/bjb" alt="Node 版本要求"></a>
    <br>
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen" alt="代码风格"></a>
    <a href="https://npm.im/bjb"><img src="https://img.shields.io/npm/dm/bjb" alt="NPM 下载量"></a>
    <a href="https://packagephobia.com/result?p=bjb"><img src="https://packagephobia.com/badge?p=bjb" alt="安装包体积"></a>
    <a href="https://github.com/bjb-cli/bjb"><img src="https://img.shields.io/github/repo-size/bjb-cli/bjb" alt="仓库体积"></a>
    <a href="https://github.com/bjb-cli/bjb"><img src="https://img.shields.io/librariesio/github/bjb-cli/bjb" alt="依赖状态"></a>
  </p>
</div>

## 简介

BJB (**B**reak **J**op **B**oom)

这是一个基于模板机制、简单而强大的脚手架工具，用于提升个人生产力，受启发于 [Yeoman](https://yeoman.io)、[Vue CLI 2](https://npm.im/vue-cli) 等项目。

### 特性

- 简单易用
- 轻量化
- 依然强大
- 高工作效率
- 零生产依赖
- 基于模板
- 可配置
- 可扩展
- 使用 TypeScript（3.0.0）
- 使用现代化的 API

## 目录

- [BJB](#bjb)
  - [简介](#简介)
    - [特性](#特性)
  - [目录](#目录)
  - [起步](#起步)
    - [环境准备](#环境准备)
    - [安装](#安装)
    - [快速起步](#快速起步)
      - [选项](#选项)
  - [配方](#配方)
    - [GitHub 仓库模板](#github-仓库模板)
      - [使用自定义模板](#使用自定义模板)
    - [本地模板](#本地模板)
    - [远程压缩包模板](#远程压缩包模板)
    - [离线模式](#离线模式)
    - [命令行参数](#命令行参数)
    - [调试模式](#调试模式)
    - [列出可用模版](#列出可用模版)
      - [参数](#参数)
      - [选项](#选项-1)
  - [官方模板](#官方模板)
  - [高级](#高级)
    - [配置选项](#配置选项)
      - [请求代理](#请求代理)
    - [创建你的模板](#创建你的模板)
  - [参考资料](#参考资料)
    - [bjb(template, project?, options?)](#bjbtemplate-project-options)
      - [template](#template)
      - [project](#project)
      - [options](#options)
        - [force](#force)
        - [offline](#offline)
        - [[key: string]](#key-string)
  - [概念](#概念)
    - [如何工作](#如何工作)
      - [主要的工作流程](#主要的工作流程)
    - [用到什么](#用到什么)

## 起步

### 环境准备

- [Node.js](https://nodejs.org) (必须 >= 14.14, >= 16.13 更佳)
- [npm](https://www.npmjs.com) (>= 7.x) 或 [pnpm](https://pnpm.io) (>= 6.x) 或 [yarn](https://yarnpkg.com) (>= 1.22)
- [Git](https://git-scm.com) (>= 2.0)

### 安装

```shell
# 全局安装
$ npm install -g bjb

# 或者使用 yarn 安装
$ yarn global add bjb

# 本地link
$ git clone https://github.com/bjb-cli/bjb.git
# enter generated directory
$ cd bjb
# Link local
$ npm link
```

### 快速起步

使用模板创建一个新项目。

```shell
$ bjb <template> [project] [-f|--force] [-o|--offline]

# 使用官方模板
$ bjb <template> [project]

# 使用 GitHub 仓库（自定义模板）
$ bjb <owner>/<repo> [project]
```

如果您只是偶尔使用它，我建议您使用 `npx` 直接运行 `bjb`。

```shell
$ npx bjb <template> [project] [-f|--force] [-o|--offline]
```

#### 选项

- `-f, --force`: 如果目标存在就覆盖掉
- `-o, --offline`: 尝试使用本地离线缓存模板

## 配方

### GitHub 仓库模板

```shell
$ bjb nm my-project
```

此命令会从 [bjb-cli/nm](https://github.com/bjb-cli/nm) 拉取模板，然后根据模板的配置，询问你一些问题，最后生成项目在 `./my-project`。

```shell
$ bjb nm#mjs my-project
```

运行此命令，BJB 将从 [bjb-cli/nm](https://github.com/bjb-cli/nm) 的 `mjs` 分支拉取模板。

#### 使用自定义模板

```shell
$ bjb test/nm my-project
```

此命令会从 [test/nm](https://github.com/test/nm) 拉取模板。这意味着你也可以从你的公开 GitHub 仓库拉取模板。

**注意：模板必须使用公开的仓库。**

### 本地模板

你也可以使用本地文件系统的模板。

例如：

```shell
$ bjb ~/local/template my-project
```

以上命令将使用 `~/local/template` 文件夹作为模板。

### 远程压缩包模板

你也可以使用 zip 压缩包的模板。

例如：

```shell
$ bjb https://cdn.test.me/boilerplate.zip my-project
```

以上命令将从 `https://cdn.test.me/boilerplate.zip` 下载并解压模板。

### 离线模式

```shell
$ bjb nm my-project --offline
```

运行以上命令，BJB 将尝试从缓存中找到 `nm` 模板，如果找不到该模板的缓存，它仍将自动从 GitHub 下载。

### 命令行参数

BJB 允许你通过命令行参数来指定提示问题的答案。

```shell
$ bjb minima my-project --name my-proj
```

运行以上命令，你就不用再回答接下来 `name` 的问题了。

### 调试模式

```shell
$ bjb nm my-project --debug
```

`--debug` 参数将打开调试模式。

在调试模式下，一旦发生异常，命令行将自动输出异常详细信息。这对于查找模板中的错误非常有帮助。

### 列出可用模版

显示全部可用的模板：

```shell
$ bjb list [owner] [-j|--json] [-s|--short]
```

#### 参数

- `[owner]`: GitHub 组织或用户的别名, 默认值：`'bjb-test'`

#### 选项

- `-j, --json`: 以 JSON 格式输出
- `-s, --short`: 以精简格式输出

## 官方模板

目前 BJB 可用的官方模板有：

- [template](https://github.com/bjb-cli/template) - 用来创建 [BJB](https://github.com/bjb-cli/bjb) 的模板
- [nm](https://github.com/bjb-cli/nm) - 用来创建 [Node](https://nodejs.org) 模块
- [vite](https://github.com/bjb-cli/vite) - 用来创建基于 [Vite](https://github.com/vitejs/vite) 的 Vue.js 应用
- [component](https://github.com/bjb-cli/component) - 用来创建 组件库
- [x-pages](https://github.com/bjb-cli/pages) - 用来创建 [Pages](https://github.com/bjb-cli/pages) 静态站点

可能还有更多：https://github.com/bjb-cli

> 你也可以通过运行 `$ bjb list` 命令来实时列出所有官方模板。

## 高级

### 配置选项

BJB 将会读取 `~/.bjbrc` 配置文件，默认配置：

```ini
; 模板下载地址
; {owner} & {name} & {branch} 最终将被相应的值替换。
registry = https://github.com/{owner}/{name}/archive/{branch}.zip
; 模板列表地址
list = https://api.github.com/users/{owner}/repos
; 模板缺省 owner 的值，可以理解为官方名称
official = bjb-cli
; 缺省的模板分支名称
branch = master
```

这就意味着你可以通过修改配置文件来自定义配置。

例如，你的 `~/.bjbrc`：

```ini
registry = https://gitlab.com/{owner}/{name}/archive/{branch}.zip
official = uzi
branch = main
```

然后运行以下命令：

```shell
$ bjb nm my-project
```

这样就会从 `https://gitlab.com/uzi/nm/archive/main.zip` 下载模板。

#### 请求代理

BJB 支持网络请求代理配置。

`~/.bjbrc`:

```ini
proxy = socks5://127.0.0.1:1080
```

或者在使用环境变量:

```shell
$ ALL_PROXY=socks5://127.0.0.1:1080 bjb nm my-project
```

### 创建你的模板

```shell
$ bjb template my-template
```

以上命令会从 [bjb-cli/template](https://github.com/bjb-cli/template) 下载模板，并帮你创建你自己的 BJB 模板。

创建并发布模板，详细可以请参考 [如何创建模板](docs/create-template.md)。

## 参考资料

<!-- API Docs -->

### bjb(template, project?, options?)

使用指定模板创建一个新项目

#### template

- 类型：`string`
- 描述：模板名称，也可以是模板文件夹路径

#### project

- 类型：`string`
- 描述：项目名称，也可以是项目文件夹路径
- 默认值：`'.'`

#### options

- 类型：`object`
- 描述：选项参数 & 预设询问结果
- 默认值：`{}`

##### force

- 类型：`boolean`
- 描述：如果目标路径已存在就强制覆盖
- 默认值：`false`

##### offline

- 类型：`boolean`
- 描述：尝试使用离线模板
- 默认值：`false`

##### [key: string]

- 类型：`any`
- 描述：命令行参数覆盖问题答案

## 概念

### 如何工作

![脚手架工作流程](https://user-images.githubusercontent.com/6166576/88473012-d4ecb180-cf4b-11ea-968a-5508c6f84502.png)

#### 主要的工作流程

[核心代码](lib/index.ts) 根据项目提供的中间件，依次执行中间件机制。

以下中间件将按顺序依次执行：

1. [ready](lib/modules/ready.js) - 使用 [prompts](https://github.com/terkelg/prompts) 确认目标路径可用。
2. [resolve](lib/modules/resolve.js) - 从远程或者本地磁盘中找到模板。
3. [rely](lib/modules/rely.js) - 自动安装模板依赖项，使用 `require` 加载模板的配置文件。
4. [mutual](lib/modules/mutual.js) - 使用 [prompts](https://github.com/terkelg/prompts) 询问用户模板所需要的问题。
5. [setup](lib/modules/setup.js) - 只是调用模板中定义的 `setup` 钩子函数。
6. [before-render](lib/modules/before-render.js) - 读取内容并替换名称。
7. [render](lib/modules/render.js) - 如果文件是一个模板文件就渲染文件内容（替换文件内容中的变量）。
8. [after-render](lib/modules/after-render.js) - 将每一个文件内容输出写入到目标路径。
9.  [install](lib/modules/install.js) - 如果需要的话，执行 `npm | yarn install`。
10. [init](lib/modules/init.js) - 如果需要的话，执行 `git init && git add && git commit`。
11. [fulfill](lib/modules/fulfill.js) - 只是调用模板中定义的 `complete` 钩子函数。

### 用到什么

- [adm-zip](https://github.com/cthackers/adm-zip) - 一个 JavaScript 实现的 zip 文件压缩解压缩的库，支持内存和磁盘上的压缩解压缩。
- [cac](https://github.com/cacjs/cac) - 简单而强大的命令行工具框架。
- [env-paths](https://github.com/sindresorhus/env-paths) - 获取系统存储路径，例如数据、配置、缓存等。
- [fast-glob](https://github.com/mrmlnc/fast-glob) - 非常快的和非常高效的 glob 库，用于 Node.js
- [ini](https://github.com/npm/ini) - 一个 Node.js 的 ini 文件解析器。
- [lodash](https://github.com/lodash/lodash) - Lodash 工具库。
- [node-fetch](https://github.com/node-fetch/node-fetch) - 一个 Node.js 的 fetch API 的封装。
- [ora](https://github.com/sindresorhus/ora) - 强大的终端加载动画。
- [prompts](https://github.com/terkelg/promptss) - 轻量级，美观的和用户友好的提示。
- [semver](https://github.com/npm/node-semver) - 一个 Node.js 的 semver 库。
- [validate-npm-package-name](https://github.com/npm/validate-npm-package-name) - 一个 Node.js 的 npm 包名验证器。