# postcss-glitch

Glitch effect implemented with PostCSS. With this plugin you can easily add glitch effect to any text!

![animation](http://g.recordit.co/COmXbvzGfg.gif)

Check out our [demo page](https://crftd.github.io/postcss-glitch/) ([source](https://github.com/crftd/postcss-glitch-demos))

---

This is a monorepo for a PostCSS Glitch project. 
It contains both plugin source code and various demo projects that use the plugin. 

## Working with the repo

> **NOTE:** The following documentation describes how to work with this repo.
> You can find plugin documentation [here](plugin/README.md).
>
> Also, take a look at [demos](demos) directory if you are looking for working examples of how to use postcss-glitch plugin. 

### Pre-requirements

It's recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions

[NodeJS](https://nodejs.org/)

```bash
nvm install 24 && nvm use 24
```

[pnpm](https://pnpm.io/)

```bash
npm i -g pnpm
```
### Install dependencies

```bash
pnpm install
```

### Workspaces

This project is a monorepo containing multiple projects a.k.a workspaces.
Workspaces are defined in [pnpm-workspace.yaml](pnpm-workspace.yaml).
Here we have a workspace under [plugin](plugin) directory, additionally each directory under [demos](demos) is also considered a workspace.

```yaml
packages:
	- plugin
	- demos/*
```

This allows, for example, to install all the dependencies at once for both plugin and all the demo projects while running `pnpm install` in the root folder.

You can learn more about managing monorepo with yarn workspaces in the [documentation](https://pnpm.io/workspaces).


### Contributing

If you want to start contributing to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md). 


