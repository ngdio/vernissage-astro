import EleventyVitePlugin from "@11ty/eleventy-plugin-vite"
import ViteReactPlugin from "@vitejs/plugin-react"
import ViteTailwindPlugin from "@tailwindcss/vite"
import "tsx/esm"
import { jsxToString } from "jsx-async-runtime"
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img"
import { register } from "tsx/esm/api";

const viteOptions = {
  publicDir: "public",
  clearScreen: false,
  server: {
    middlewareMode: true,
  },
  appType: "custom",
  build: {
    mode: "production",
    sourcemap: "true",
    manifest: true,
  },
  plugins: [ViteReactPlugin(), ViteTailwindPlugin()],
}

export default async function (eleventyConfig) {
  eleventyConfig.setServerPassthroughCopyBehavior("copy")
  eleventyConfig.addPassthroughCopy("public")

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: "_tmp",
    viteOptions,
  })

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    transformOnRequest: false,
    formats: ["avif", "webp", "jpeg"],
    widths: [200, 500, 1000, "auto"],
    htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
			pictureAttributes: {}
		},
  })

  eleventyConfig.addExtension(["11ty.jsx", "11ty.ts", "11ty.tsx"], {
    key: "11ty.js",
    compile: async function (inputContent, inputPath) {
      this.addDependencies(inputPath, ["./src/props.tsx"])
      this.addDependencies("./src/layouts/grid.11ty.tsx", ["./src/layouts/base.11ty.tsx", "./src/includes/image.tsx"])
      this.addDependencies("./src/layouts/base.11ty.tsx", ["./src/includes/header.tsx", "./src/includes/footer.tsx"])
      return async function (data) {
        let content = await this.defaultRenderer(data)
        return jsxToString(content)
      }
    },
  })

  eleventyConfig.addWatchTarget("src/includes")

  eleventyConfig.addPassthroughCopy("src/assets")

  let unregister;
	eleventyConfig.on("eleventy.before", () => {
		unregister = register({
			tsconfig: "./tsconfig.json",
		});
	});
	eleventyConfig.on("eleventy.after", () => {
		unregister();
	});

  return {
    templateFormats: ["md", "html", "11ty.jsx", "11ty.tsx"],
    htmlTemplateEngine: false,
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "_site",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
  }
}
