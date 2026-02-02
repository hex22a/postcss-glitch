# postcss-glitch

Glitch effect implemented with PostCSS. With this plugin you can add a glitch effect to any text!

[![NPM Version](https://img.shields.io/npm/v/postcss-glitch)](https://badge.fury.io/js/postcss-glitch)
![CI](https://github.com/hex22a/postcss-glitch/actions/workflows/test-plugin.yml/badge.svg)

Check out our [demo page](https://hex22a.github.io/postcss-glitch/) ([source](https://github.com/crftd/postcss-glitch-demos))

## Installation

```bash
npm install postcss-glitch
```

You can use `postcss.config.js` to add plugin to your project just like this:

```javascript
// postcss.config.js

module.exports = {
	plugins: [
		require('postcss-glitch'),
		require('autoprefixer'),
	],
}
```

### Usage

#### TL;DR

```
.foo {
  glitch: <glitch mode> <height in px | pt | % | em | rem > <first color> <second color> <shadow size>;
}
```

#### Guide

##### SVG mode

1. Create an element which you want to apply a glitch effect

```html
<div class="glitch_svg"></div>
```

```postcss
.glitch_svg {
    background-image: url("awesome.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100px;
    height: 100px;
}
```

2. Add glitch property with mode `svg`

```postcss
.glitch_svg {
    background-image: url("awesome.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100px;
    height: 100px;
    glitch: svg 60% #f00 #00f 2px;
}
```

##### Text mode

1. Create an element which you want to apply a glitch effect

```html
<div class="glitch">PostCSS Glitch</div>
```

2. Add a **data-text** attribute to the last created element

```html
<div class="glitch" data-text="PostCSS Glitch">PostCSS Glitch</div>
```

3. Add glitch property with mode `text`

```postcss
.glitch {
	font-weight: 700;
	font-size: 23pt;
	glitch: text 42px #f00 #00f 2px;
}
```

## What actually happens?

> ❗️Note that `.glitch` element becomes a positioning context for its pseudo-elements

```css
.glitch {
	font-weight: 700;
	font-size: 23pt;
	glitch: text 42px #f00 #00f 2px;
}
```

transforms to

```css
@keyframes glitch-animation-before {
	0% {
		clip-path: inset(5px 0 32px 0);
	}
	25% {
		clip-path: inset(14px 0 23px 0);
	}
	50% {
		clip-path: inset(15px 0 22px 0);
	}
	75% {
		clip-path: inset(11px 0 26px 0);
	}
	to {
		clip-path: inset(18px 0 19px 0);
	}
}

@keyframes glitch-animation-after {
	0% {
		clip-path: inset(20px 0 17px 0);
	}
	25% {
		clip-path: inset(37px 0 0 0);
	}
	50% {
		clip-path: inset(16px 0 21px 0);
	}
	75% {
		clip-path: inset(20px 0 17px 0);
	}
	to {
		clip-path: inset(17px 0 20px 0);
	}
}

.glitch {
	position: relative;
	font-weight: 700;
	font-size: 23pt;
}

.glitch:after,
.glitch:before {
	content: attr(data-text);
	position: absolute;
	top: 0;
	left: 0;
	overflow: hidden;
	clip-path: inset(42px 0 0 0);
}

.glitch:before {
	text-shadow: -2px 0 #f00;
	animation: glitch-animation-before 3s infinite linear alternate-reverse;
}

.glitch:after {
	text-shadow: 2px 0 #00f;
	animation: glitch-animation-after 2s infinite linear alternate-reverse;
}
```

And yeah, it also works with CSSModules!

### Testing

There are two major groups of tests in this project:

* Tests that are running against source code powered with [jest](https://jestjs.io/)

```bash
# running jest in the watch mode
pnpm --filter postcss-glitch jest

# or alternatively run it without watch mode as it runs on CI server
pnpm --filter postcss-glitch test
```

> If you're having difficulties with running in watch mode see [the installation guide](https://facebook.github.io/watchman/docs/install.html#buildinstall) 

